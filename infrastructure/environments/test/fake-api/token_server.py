import random
from pathlib import Path

from flask import Flask, Response, request

app = Flask(__name__)

TOKEN_DIR = Path("/usr/share/nginx/html/data/login/tokens")
tokens_by_nhs_number = {}

for token_file in TOKEN_DIR.glob("*.json"):
    print(f"loaded {token_file=}")
    nhs_number = token_file.stem
    tokens_by_nhs_number[nhs_number] = token_file.read_text()

tokens = list(tokens_by_nhs_number.values())


@app.route("/token", methods=["POST"])
def get_token():
    nhs_number_from_headers = request.headers.get("X-Nhs-Number")
    if nhs_number_from_headers and nhs_number_from_headers in tokens_by_nhs_number:
        return Response(tokens_by_nhs_number[nhs_number_from_headers], mimetype="application/json")

    return Response(random.choice(tokens), mimetype="application/json")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
