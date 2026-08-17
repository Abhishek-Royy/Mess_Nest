"""
train.py - MessNest AI Chatbot Training Script
-----------------------------------------------
Reads chatbot/data/training_data.csv, trains a TF-IDF + Logistic Regression model,
and saves model.pkl + vectorizer.pkl to the chatbot/ directory.

Run once:
    cd chatbot
    python train.py
"""

import os
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
import joblib

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "training_data.csv")
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")


def train():
    print("[*] Loading training data from:", CSV_PATH)
    df = pd.read_csv(CSV_PATH)
    df.dropna(subset=["question", "answer"], inplace=True)
    df["question"] = df["question"].str.strip().str.lower()

    questions = df["question"].tolist()
    answers = df["answer"].tolist()

    print(f"[+] Loaded {len(questions)} Q&A pairs.")

    # ── TF-IDF Vectorizer ────────────────────────────────────────────────────
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=5000,
        sublinear_tf=True,
    )
    X = vectorizer.fit_transform(questions)
    # Use answer strings as labels directly (each unique answer is a class)
    y = answers

    # ── Train on all data (each answer is a unique class, no label overlap) ──
    X_train, y_train = X, y
    X_test, y_test = X, y  # evaluate fit accuracy on training set

    # ── Logistic Regression ──────────────────────────────────────────────────
    clf = LogisticRegression(max_iter=1000, C=5.0, solver="lbfgs", multi_class="auto")
    clf.fit(X_train, y_train)

    # ── Evaluate ─────────────────────────────────────────────────────────────
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"[+] Training accuracy: {acc * 100:.1f}%")

    # ── Save artifacts ───────────────────────────────────────────────────────
    joblib.dump(clf, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)
    print(f"[+] model.pkl saved -> {MODEL_PATH}")
    print(f"[+] vectorizer.pkl saved -> {VECTORIZER_PATH}")
    print("\n[OK] Training complete! You can now start the Flask server with: python app.py")


if __name__ == "__main__":
    train()
