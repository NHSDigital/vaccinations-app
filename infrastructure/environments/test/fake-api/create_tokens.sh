#!/usr/bin/env zsh

set -e

if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <private_key_file> <issuer_url> <expires_in>" >&2
    exit 1
fi

PRIVATE_KEY_FILE="$1"
ISSUER_URL="$2"
EXPIRES_IN="$3"

NHS_NUMBERS=()
for f in data/elid/*.json; do
    num="$(basename "${f%.json}")"   # strip directory + extension
    NHS_NUMBERS+=("$num")
done

if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo "Error: Private key file not found at '$PRIVATE_KEY_FILE'" >&2
    exit 1
fi

base64url() {
  openssl base64 -e -A | tr '+/' '-_' | tr -d '='
}

header_json='{"alg":"RS512","typ":"JWT"}'
header_base64url=$(echo -n "$header_json" | base64url)

mkdir -p data/login/tokens

for nhs_num in "${NHS_NUMBERS[@]}"; do
  current_time=$(date +%s)
  expiration_time=$((current_time + $EXPIRES_IN))

  payload_json=$(jq -n \
    --arg iss "$ISSUER_URL" --arg sub "fake-login-sub" --arg aud "vita-app-sandpit" \
    --arg vtm "$ISSUER_URL/trustmark/localhost:3000" --arg vot "P9.Cp.Cd" \
    --arg jti "fake-login-jti" --arg nhs_number "$nhs_num" --arg identity_proofing_level "P9" \
    --arg id_status "verified" --arg token_use "id" --arg surname "MILLAR" \
    --arg family_name "MILLAR" --arg birthdate "1968-12-02" \
    --argjson iat "$current_time" --argjson auth_time "$current_time" --argjson exp "$expiration_time" \
    '{ "iss": $iss, "sub": $sub, "aud": $aud, "iat": $iat, "vtm": $vtm, "auth_time": $auth_time, "vot": $vot, "exp": $exp, "jti": $jti, "nhs_number": $nhs_number, "identity_proofing_level": $identity_proofing_level, "id_status": $id_status, "token_use": $token_use, "surname": $surname, "family_name": $family_name, "birthdate": $birthdate }')

  payload_base64url=$(echo -n "$payload_json" | base64url)

  unsigned_token="$header_base64url.$payload_base64url"
  signature_base64url=$(echo -n "$unsigned_token" | openssl dgst -sha512 -sign "$PRIVATE_KEY_FILE" | base64url)

  id_token="$unsigned_token.$signature_base64url"


  final_json_response=$(jq -n \
    --arg id_token "$id_token" \
    --arg access_token "fake-access-token-${nhs_num}" \
    --arg refresh_token "fake-refresh-token-${nhs_num}" \
    --arg expires_in $EXPIRES_IN \
    '{
      "access_token": $access_token,
      "refresh_token": $refresh_token,
      "token_type": "Bearer",
      "expires_in": $expires_in,
      "id_token": $id_token
    }')

  output_file="data/login/tokens/${nhs_num}.json"
  echo "$final_json_response" > "$output_file"
done
