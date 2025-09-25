import random
from pathlib import Path

from flask import Flask, Response

app = Flask(__name__)

TOKEN_DIR = Path("/usr/share/nginx/html/data/login/tokens")
tokens = []

for token_file in TOKEN_DIR.glob("*.json"):
    print(f"loaded {token_file=}")
    tokens.append(token_file.read_text())


@app.route("/token", methods=["POST"])
def get_token():
    return Response(random.choice(tokens), mimetype="application/json")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
