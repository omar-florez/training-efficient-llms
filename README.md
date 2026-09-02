# Training Efficient LLMs

A six-month program that takes a working engineer from ML fundamentals to
training and fine-tuning large language models efficiently — built around the
book *Efficient Training of LLMs* (written from the experience of pre-training
LatamGPT) and a set of hands-on pipelines: data generation & validation,
training & fine-tuning, benchmarking, and model ranking.

Live site: https://omar-florez.github.io/training-efficient-llms/

## Layout

- `index.html` — the program page (phases, deliverables, materials)
- `chapters/` — book chapter sources (HTML, local-only: git-ignored while the book is in progress; the public site serves the PDFs)
- `pdf/` — PDF versions of the chapters (regenerate with `scripts/make_pdfs.py`)
- `labs/` — companion notebooks (in preparation)
- `scripts/make_pdfs.py` — renders chapters to PDF with Playwright/Chromium

## Publishing

Push to GitHub, then Settings → Pages → deploy from the `main` branch, root.
The site appears at `https://<user>.github.io/training-efficient-llms/`.
