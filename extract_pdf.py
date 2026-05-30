import sys
import subprocess

try:
    import fitz  # PyMuPDF
except ImportError:
    print("Installing PyMuPDF...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "PyMuPDF"])
    import fitz

def extract_text(pdf_path, txt_path):
    print(f"Opening {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for i, page in enumerate(doc):
            text += page.get_text()
        
        print(f"Writing to {txt_path}...")
        with open(txt_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Extraction complete! Saved to", txt_path)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    pdf_path = r"C:\Users\chean\OneDrive\Desktop\the-complete-collection.pdf"
    txt_path = r"C:\Users\chean\OneDrive\Desktop\the-complete-collection.txt"
    extract_text(pdf_path, txt_path)
