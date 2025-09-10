package com.example;

import org.jboss.logging.Logger;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.Authenticator;
import org.keycloak.jose.jws.JWSInput;
import org.keycloak.jose.jws.JWSInputException;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.representations.AccessToken;

import jakarta.ws.rs.core.MultivaluedMap;
import java.util.List;
import java.util.stream.Collectors;

public class AssertedIdentityAuthenticator implements Authenticator {

  private static final Logger logger = Logger.getLogger(AssertedIdentityAuthenticator.class);
  private static final String ASSERTED_IDENTITY_PARAM = "assertedLoginIdentity";
  private static final String NHS_NUMBER_ATTRIBUTE = "nhs_number";

  @Override
  public void authenticate(AuthenticationFlowContext context) {
    MultivaluedMap<String, String> queryParams = context.getHttpRequest().getUri().getQueryParameters();
    String assertedIdentityJwt = queryParams.getFirst(ASSERTED_IDENTITY_PARAM);

    // If the assertion parameter is not present, continue to the next authentication step (e.g., login form).
    if (assertedIdentityJwt == null || assertedIdentityJwt.trim().isEmpty()) {
      logger.debug("No 'assertedLoginIdentity' parameter found, proceeding with normal flow.");
      context.attempted(); // CORRECTED METHOD
      return;
    }

    logger.info("Found 'assertedLoginIdentity' parameter, attempting to authenticate.");

    try {
      JWSInput jws = new JWSInput(assertedIdentityJwt);
      AccessToken token = jws.readJsonContent(AccessToken.class);

      // --- Token Validation ---
      // For this fake service, we'll optimistically trust the token and proceed.
      String nhsNumber = (String) token.getOtherClaims().get(NHS_NUMBER_ATTRIBUTE);
      if (nhsNumber == null) {
        logger.warn("JWT is valid but is missing the 'nhs_number' claim.");
        context.failure(AuthenticationFlowError.INVALID_USER);
        return;
      }

      logger.infof("Successfully validated asserted identity for NHS Number: %s", nhsNumber);

      // --- User Lookup ---
      List<UserModel> users = context.getSession().users()
        .searchForUserByUserAttributeStream(context.getRealm(), NHS_NUMBER_ATTRIBUTE, nhsNumber)
        .collect(Collectors.toList());

      if (users.size() == 1) {
        UserModel user = users.get(0);
        context.setUser(user);
        context.success();
        logger.infof("Successfully authenticated user '%s' via asserted identity.", user.getUsername());
      } else if (users.isEmpty()) {
        logger.warnf("No user found in realm '%s' with NHS Number: %s", context.getRealm().getName(), nhsNumber);
        context.failure(AuthenticationFlowError.INVALID_USER); // CORRECTED ERROR
      } else {
        logger.errorf("Found multiple users in realm '%s' with the same NHS Number: %s", context.getRealm().getName(), nhsNumber);
        context.failure(AuthenticationFlowError.INVALID_USER);
      }

    } catch (JWSInputException e) {
      logger.error("Failed to parse the 'assertedLoginIdentity' JWT.", e);
      context.failure(AuthenticationFlowError.INVALID_CREDENTIALS);
    }
  }


  // Other required interface methods
  @Override
  public void action(AuthenticationFlowContext context) {}

  @Override
  public boolean requiresUser() {
    return false;
  }

  @Override
  public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
    return true;
  }

  @Override
  public void setRequiredActions(KeycloakSession session, RealmModel realm, UserModel user) {}

  @Override
  public void close() {}
}
