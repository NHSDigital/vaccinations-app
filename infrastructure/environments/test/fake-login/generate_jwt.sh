#!/usr/bin/env zsh

# -----------------------------------------------------------------------------
# Configuration for NHS Login SSO Request Object JWT
# -----------------------------------------------------------------------------
# Path to your private RSA key in PEM format.
PRIVATE_KEY_FILE="private_key.pem"

# 🎯 Your client_id provided by NHS login.
CLIENT_ID="vita-app-sandpit"

# 🎯 The authorization endpoint URL for the target environment. Note: /authorize
AUTHORIZATION_ENDPOINT_URL="https://auth.sandpit.login.nhs.uk/authorize"

# 🎯 Your application's registered redirect URI.
REDIRECT_URI="https://localhost:3000/callback"

# 🎯 The user's unique ID from YOUR system.
USER_ID_IN_YOUR_SYSTEM="testuser"

# 🎯 Your unique provider ID, agreed with NHS login.
YOUR_PROVIDER_ID="my-healthcare-provider-01"

# 🎯 Scopes required for your application.
SCOPES="openid profile email gp_registration_details"
# -----------------------------------------------------------------------------

# --- Pre-flight Checks ---
for cmd in jq openssl uuidgen; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "Error: Required command '$cmd' is not installed." >&2; exit 1
  fi
done

if [ ! -r "$PRIVATE_KEY_FILE" ]; then
    echo "Error: Private key file '$PRIVATE_KEY_FILE' not found or is not readable." >&2; exit 1
fi

# --- Helper Function ---
base64_urlencode() {
    openssl base64 -e | tr -d '\n' | tr '+/' '-_' | sed 's/=//g'
}

# --- JWT Generation ---

# 1. Header
header_json='{"alg":"RS256","typ":"JWT"}'
header_base64=$(echo -n "$header_json" | base64_urlencode)

# 2. Payload
iat=$(date +%s)
exp=$((iat + 300)) # 5 minutes expiry
state=$(openssl rand -hex 16)
nonce=$(openssl rand -hex 16)

# Construct the complex JSON payload for the SSO request object.
payload_json=$(jq -c \
    --arg iss "$CLIENT_ID" \
    --arg aud "$AUTHORIZATION_ENDPOINT_URL" \
    --arg client_id "$CLIENT_ID" \
    --arg redirect_uri "$REDIRECT_URI" \
    --arg scope "$SCOPES" \
    --arg state "$state" \
    --arg nonce "$nonce" \
    --argjson exp "$exp" \
    --argjson iat "$iat" \
    --arg user_sub "$USER_ID_IN_YOUR_SYSTEM" \
    --arg provider_id "$YOUR_PROVIDER_ID" \
    '{
        "iss": $iss,
        "aud": $aud,
        "response_type": "code",
        "client_id": $client_id,
        "redirect_uri": $redirect_uri,
        "scope": $scope,
        "state": $state,
        "nonce": $nonce,
        "exp": $exp,
        "iat": $iat,
        "claims": {
            "vtr": ["P9.id"],
            "asserted_login_identity": {
                "sub": $user_sub,
                "identity_provider": $provider_id,
                "ial": "P9"
            }
        }
    }' <<< '{}')

if [ $? -ne 0 ]; then
  echo "Error: Failed to create the JSON payload with jq." >&2; exit 1
fi

payload_base64=$(echo -n "$payload_json" | base64_urlencode)

# 3. Signature
to_be_signed="${header_base64}.${payload_base64}"
signature_base64=$(echo -n "$to_be_signed" | \
    openssl dgst -sha256 -sign "$PRIVATE_KEY_FILE" | \
    base64_urlencode)

if [ $? -ne 0 ]; then
  echo "Error: Failed to sign the token with OpenSSL." >&2; exit 1
fi

# 4. Final JWT
jwt="${to_be_signed}.${signature_base64}"

echo "$jwt"
