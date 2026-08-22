from pypdf import PdfReader


def read_txt_file(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read()

    return text


def read_pdf_file(file_path):

    reader = PdfReader(file_path)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text