const express = require("express");
const { Provider } = require("oidc-provider");

const app = express();

const ISSUER = process.env.ISSUER || "http://localhost:3001";
const CLIENT_ID = process.env.CLIENT_ID || "your_app_client_id";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "your_app_client_secret";
const REDIRECT_URIS = (process.env.REDIRECT_URIS || "http://localhost:3000/callback").split(",");

if (!ISSUER || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URIS.length) {
  console.error("Missing required environment variables: ISSUER, CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS");
  process.exit(1);
}

const configuration = {
  clients: [
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uris: REDIRECT_URIS,
      response_types: ["code"],
      grant_types: ["authorization_code"],
    },
  ],
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims() {
        return {
          sub: id,
          nhs_number: "9991234567",
          family_name: "Faker",
          given_name: "Jane",
          birthdate: "1970-01-01",
          identity_proofing_level: "P9",
          email: "jane.faker@example.com",
          phone_number: "07700900000",
        };
      },
    };
  },
  features: {
    devInteractions: { enabled: false }, // Disable the dev login prompt
  },
  formats: {
    AccessToken: "jwt",
  },
};

const oidc = new Provider(ISSUER, configuration);

app.use("/interaction/:uid", async (req, res, next) => {
  try {
    const result = {
      login: {
        accountId: "fake-user-123",
      },
    };
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  } catch (err) {
    next(err);
  }
});

app.use(oidc.callback());

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Fake NHS Login OIDC Provider running on ${ISSUER}`);
  console.log(`Accepting connections from client_id: "${CLIENT_ID}"`);
  console.log(`Redirecting to: ${REDIRECT_URIS.join(", ")}`);
});
