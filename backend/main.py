
from sqlalchemy.orm import Session
import os

from core.security import verify_token, admin_required

from tasks.routes import router as task_router

from database import get_db, SessionLocal

from models import Role, User, Task, Document, ActivityLog

from auth.routes import router as auth_router

from documents.routes import router as document_router

from documents.reader import read_txt_file, read_pdf_file
from documents.vector_store import add_document_to_index

from analytics.routes import router as analytics_router

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def load_documents():

    db = SessionLocal()

    try:
        documents = db.query(Document).all()

        for document in documents:

            print(f"Loading document: {document.filename}")

            file_path = document.file_path

            if not os.path.exists(file_path):
                print(f"File not found: {file_path}")
                continue

            if document.filename.endswith(".txt"):
                text = read_txt_file(file_path)

            elif document.filename.endswith(".pdf"):
                text = read_pdf_file(file_path)

            else:
                continue

            add_document_to_index(
                text,
                document.id,
                document.filename
            )

    finally:
        db.close()


app.include_router(auth_router)

app.include_router(task_router)

app.include_router(document_router)

app.include_router(analytics_router)


@app.get("/session-test")
def session_test(db: Session = Depends(get_db)):

    return {"message": "Database session working"}


@app.get("/protected-test")
def protected_test(current_user=Depends(verify_token)):

    return {
        "message": "You are authenticated",
        "user": current_user
    }


@app.get("/admin-test")
def admin_test(current_user=Depends(admin_required)):

    return {
        "message": "Welcome Admin",
        "user": current_user
    }