# ── Python Chatbot (Flask + scikit-learn) ─────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install OS-level deps needed by numpy/scikit-learn
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source and pre-trained model artefacts
COPY app.py .
COPY model.pkl .
COPY vectorizer.pkl .

# Create a non-root user
RUN useradd -m messnest && chown -R messnest /app
USER messnest

EXPOSE 5001

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

CMD ["python", "app.py"]
