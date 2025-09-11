const express = require("express");
const { Issuer } = require("openid-client");

const app = express();
const port = 3002;

// Config from environment variables in docker-compose.yml
const nhsLoginIssuerUrl = process.env.NHS_LOGIN_ISSUER;
const nhsLoginClientId = process.env.NHS_LOGIN_CLIENT_ID;
const vitaCallbackUrl = process.env.VITA_CALLBACK_URL; // Your app's real callback

let oidcClient;

// The entrypoint for the entire flow
app.get("/", (req, res) => {
  console.log("Fake NHS App: Received initial request. Redirecting to Fake NHS Login...");
  const authUrl = oidcClient.authorizationUrl({
    scope: "openid profile",
    // This service's own internal callback
    redirect_uri: `http://localhost:3002/callback`,
  });
  res.redirect(authUrl);
});

// This service's internal callback to handle the return from NHS Login
app.get("/callback", async (req, res) => {
  console.log("Fake NHS App: Received callback from Fake NHS Login.");
  try {
    const params = oidcClient.callbackParams(req);
    // A real broker would exchange the code for a token here to validate the user.
    // For this fake service, we trust the login and just forward the code.

    console.log("Fake NHS App: Forwarding user to the actual ViA application.");

    // Construct the final URL to your application, passing along the code.
    const finalUrl = new URL(vitaCallbackUrl);
    finalUrl.searchParams.set("code", params.code);
    finalUrl.searchParams.set("state", params.state);
    finalUrl.searchParams.set("session_state", params.session_state);

    res.redirect(finalUrl.toString());
  } catch (err) {
    console.error("Error in Fake NHS App callback:", err);
    res.status(500).send("An error occurred in the fake NHS App service.");
  }
});

// Initialize the OIDC client and start the server
Issuer.discover(nhsLoginIssuerUrl)
  .then((issuer) => {
    oidcClient = new issuer.Client({
      client_id: nhsLoginClientId,
      redirect_uris: [`http://localhost:3002/callback`],
      response_types: ["code"],
    });

    app.listen(port, () => {
      console.log(`Fake NHS App service listening at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to discover OIDC issuer. Is the fake-nhs-login service running?", err);
    process.exit(1);
  });
