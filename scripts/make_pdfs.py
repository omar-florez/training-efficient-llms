"""Render the book chapters to PDF. Run on a machine with internet access
(KaTeX loads from cdnjs) so equations render properly:
    pip install playwright && playwright install chromium
    python scripts/make_pdfs.py
"""
import pathlib
from playwright.sync_api import sync_playwright

root = pathlib.Path(__file__).resolve().parents[1]
(root / "pdf").mkdir(exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    for ch in sorted((root / "chapters").glob("ch*.html")):
        pg.goto(ch.as_uri())
        pg.wait_for_timeout(3000)  # let KaTeX render
        out = root / "pdf" / (ch.stem + ".pdf")
        pg.pdf(path=str(out), format="A4", print_background=True,
               margin={"top": "14mm", "bottom": "14mm", "left": "12mm", "right": "12mm"})
        print("wrote", out)
    b.close()
