from documents.reader import read_txt_file, read_pdf_file
from documents.vector_store import add_document_to_index

import os

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
from sqlalchemy.orm import Session

from database import get_db
from models.document import Document
from core.security import admin_required, verify_token

import documents.vector_store as vector_store
from documents.ai import generate_answer
from schemas.document import DocumentQuestion

from models.activity_log import ActivityLog


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================
# UPLOAD DOCUMENT
# ADMIN ONLY
# =========================

@router.post("/upload")
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(admin_required)
):

    if not file.filename.endswith((".pdf", ".txt")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are allowed"
        )

    existing_document = db.query(Document).filter(
        Document.filename == file.filename
    ).first()

    if existing_document:
        raise HTTPException(
            status_code=400,
            detail="Document already exists"
        )

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as f:
        f.write(file.file.read())

    document = Document(
        filename=file.filename,
        file_path=file_path,
        uploaded_by=current_user["user_id"]
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    activity = ActivityLog(
        user_id=current_user["user_id"],
        action="DOCUMENT_UPLOAD",
        details=f"Uploaded document: {file.filename}"
    )

    db.add(activity)
    db.commit()

    if file.filename.endswith(".txt"):
        text = read_txt_file(file_path)

    elif file.filename.endswith(".pdf"):
        text = read_pdf_file(file_path)

    else:
        raise HTTPException(
            status_code=400,
            detail="Only .txt and .pdf files are allowed"
        )

    add_document_to_index(
        text,
        document.id,
        file.filename
    )

    return {
        "message": "Document uploaded successfully",
        "document_id": document.id,
        "filename": document.filename,
        "uploaded_by": document.uploaded_by
    }


# =========================
# SEARCH DOCUMENTS
# ADMIN + USER
# =========================

@router.get("/search")
def search_documents(
    q: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(verify_token)
):

    if vector_store.document_index is None:
        raise HTTPException(
            status_code=404,
            detail="No documents indexed"
        )

    results = vector_store.search_document(
        vector_store.document_index,
        vector_store.document_chunks,
        q
    )

    activity = ActivityLog(
        user_id=current_user["user_id"],
        action="DOCUMENT_SEARCH",
        details=f"Searched documents for: {q}"
    )

    db.add(activity)
    db.commit()

    return {
        "query": q,
        "results": results
    }


# =========================
# ASK AI
# ADMIN + USER
# =========================

@router.post("/ask")
def ask_document(
    data: DocumentQuestion,
    current_user=Depends(verify_token)
):

    if vector_store.document_index is None:
        raise HTTPException(
            status_code=404,
            detail="No documents indexed"
        )

    results = vector_store.search_document(
        vector_store.document_index,
        vector_store.document_chunks,
        data.question
    )

    relevant_results = []

    for result in results:

        if result["distance"] <= 1.3:
            relevant_results.append(result)

    if not relevant_results:

        return {
            "question": data.question,
            "answer": "I could not find the answer in the uploaded documents.",
            "sources": []
        }

    context = ""

    for result in relevant_results:
        context += result["chunk"] + "\n"

    answer = generate_answer(
        data.question,
        context
    )

    return {
        "question": data.question,
        "answer": answer,
        "sources": relevant_results
    }