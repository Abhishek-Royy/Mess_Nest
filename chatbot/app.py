"""
app.py - MessNest AI Chatbot Flask Server
------------------------------------------
Loads model.pkl + vectorizer.pkl and exposes:
    POST /api/chat   { "message": "..." }  →  { "reply": "..." }

Run:
    python app.py
Server starts on http://localhost:5001
"""

import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.metrics.pairwise import cosine_similarity

# ── App Setup ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "vectorizer.pkl")

# ── Load Model ───────────────────────────────────────────────────────────────
print("[*] Loading AI model...")

if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
    raise FileNotFoundError(
        "[!] model.pkl or vectorizer.pkl not found.\n"
        "   Please run: python train.py  first."
    )

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Pre-vectorize all training vectors for cosine-similarity fallback
training_matrix = vectorizer.transform(model.classes_)

print(f"[+] Model loaded - {len(model.classes_)} answer classes.")

# ── Helpers ──────────────────────────────────────────────────────────────────
CONFIDENCE_THRESHOLD = 0.25
FALLBACK_REPLY = (
    "I'm not sure about that. Please contact support or browse our listings "
    "for more information."
)


def get_reply(user_message: str) -> str:
    """
    Returns the best-matching answer.
    Uses Logistic Regression probability; falls back to cosine similarity
    if max probability is below CONFIDENCE_THRESHOLD.
    """
    msg_lower = user_message.strip().lower()
    vec = vectorizer.transform([msg_lower])

    # Primary: LR probability
    proba = model.predict_proba(vec)[0]
    max_prob = np.max(proba)

    if max_prob >= CONFIDENCE_THRESHOLD:
        best_class_idx = np.argmax(proba)
        return model.classes_[best_class_idx]

    # Fallback: cosine similarity over training question vectors
    # model.classes_ are answers; use vectorizer on question text isn't available
    # so we measure similarity of user query against all class label texts.
    sim = cosine_similarity(vec, training_matrix)[0]
    best_sim_idx = np.argmax(sim)
    best_sim = sim[best_sim_idx]

    if best_sim >= 0.1:
        return model.classes_[best_sim_idx]

    return FALLBACK_REPLY


# ── Routes ───────────────────────────────────────────────────────────────────
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True)
    if not data or not data.get("message", "").strip():
        return jsonify({"error": "Missing 'message' field"}), 400

    user_message = data["message"].strip()
    reply = get_reply(user_message)

    return jsonify({"reply": reply})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "loaded"})


# ── Main ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("[*] MessNest AI Chatbot API running on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=False)
