import fitz
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "Portfolio CMS Platform \u2014 Product Requirements Document (PRD).pdf"
doc = fitz.open(pdf_path)
text = ""
for page in doc:
    text += page.get_text()

lines = text.split('\n')
for i, line in enumerate(lines[:60]):
    print(f"{i}: {line}")
