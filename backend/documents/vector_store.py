import faiss
import numpy as np
from documents.chunker import split_text
from documents.embeddings import create_embedding



document_index = None
document_chunks = []

def create_index(embeddings):

    dimension = len(embeddings[0])

    index = faiss.IndexFlatL2(dimension)

    vectors = np.array(embeddings).astype("float32")

    index.add(vectors)

    return index

def search_index(index, query_embedding):

    query_vector = np.array([query_embedding]).astype("float32")

    distances, indices = index.search(query_vector, 10)

    return distances, indices


def build_document_index(text):

    chunks = split_text(text)

    embeddings = []

    for chunk in chunks:
        embedding = create_embedding(chunk)
        embeddings.append(embedding)

    index = create_index(embeddings)

    return index, chunks


def add_document_to_index(text, document_id, filename):
    global document_index
    global document_chunks

    chunks = split_text(text)

    if not chunks:
        print(f"Skipping empty document: {filename}")
        return

    embeddings = []

    for chunk in chunks:
        embedding = create_embedding(chunk)
        embeddings.append(embedding)

    if not embeddings:
        print(f"No embeddings created for: {filename}")
        return

    vectors = np.array(embeddings).astype("float32")

    if document_index is None:
        dimension = len(embeddings[0])
        document_index = faiss.IndexFlatL2(dimension)

    document_index.add(vectors)

    for chunk in chunks:
        document_chunks.append({
            "document_id": document_id,
            "filename": filename,
            "chunk": chunk
        })


def search_document(index, chunks, query):

    query_embedding = create_embedding(query)

    distances, indices = search_index(
        index,
        query_embedding
    )

    results = []

    for position, index_number in enumerate(indices[0]):

        if index_number == -1:
            continue

        result = chunks[index_number].copy()

        result["distance"] = float(distances[0][position])

        results.append(result)

    return results

