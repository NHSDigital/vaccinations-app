# NHS Login Integration

NHS Login uses OIDC flow for authorization and authentication

## One Time Setup

### NHS Login Sandpit Environment

#### Create Asymmetric Key Pair

NHS Login OIDC flow requires us to use a private key to sign JWT token to ensure security. The public key generated from the private key is to be submitted as part of the form below.
The steps below explain how to generate that public key and corresponding private key.
- Generate private key (private_key.pem)
    ```
    openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
    ```
- Generate corresponding public key (public_key.pem)
    ```
    openssl rsa -pubout -in private_key.pem -out public_key.pem
    ```

### Submit Sandpit Environment Form

Complete and submit this [form](https://forms.office.com/e/HaKHCGFBxP) to initiate the integration with NHS Login.

```
Organisation Name:          VDS
Contact Email Address:      <your .net email address>
Client Friendly Name:       nhs-vaccinations-app
Contact Name:               <your name>
Client ID:                  vita-app-<NHS Login Environment>
Public Key:                 <See above, paste as plain text>
Refresh Token:              Yes
Scopes:                     openid, profile, gp_registration_details
```

After successful set up, you will receieve an email where you will get access to a list of users that you can use to test your NHS Login (OIDC) flow in the sandpit environment.
