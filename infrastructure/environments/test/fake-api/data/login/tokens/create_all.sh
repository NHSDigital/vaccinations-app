#!/usr/bin/env zsh

set -e

PRIVATE_KEY_FILE="../../../../../../../../vita-app-sandpit.pid"

ISSUER_URL="http://localhost:9123/api/fake-login"

NHS_NUMBERS=(
  "9436793375"
  "9450114080"
  "9451019030"
  "9466447939"
  "9657933617"
  "9658218873"
  "9658218881"
  "9658218903"
  "9658218989"
  "9658218997"
  "9658219004"
  "9658219012"
  "9658220142"
  "9658220150"
  "9661033404"
  "9661033498"
  "9686368906"
  "9686368973"
  "9686369120"
  "9735548844"
  "9735548852"
  "9735549018"
  "9735549026"
  "9735549034"
  "9735549042"
  "9735549050"
  "9735549069"
  "9735549077"
  "9735549085"
  "9735549093"
  "9735549107"
  "9800878378"
)

if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo "Error: Private key file not found at '$PRIVATE_KEY_FILE'"
    exit 1
fi

base64url() {
  openssl base64 -e -A | tr '+/' '-_' | tr -d '='
}

header_json='{"alg":"RS512","typ":"JWT"}'
header_base64url=$(echo -n "$header_json" | base64url)

for nhs_num in "${NHS_NUMBERS[@]}"; do
  current_time=$(date +%s)
  expiration_time=$((current_time + 3600)) # Expires in 1 hour

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
    '{
      "access_token": $access_token,
      "refresh_token": $refresh_token,
      "token_type": "Bearer",
      "expires_in": 3600,
      "id_token": $id_token
    }')

  output_file="${nhs_num}.json"
  echo "$final_json_response" > "$output_file"
done
