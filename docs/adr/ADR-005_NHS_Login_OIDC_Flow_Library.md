# ADR-nnn: Any Decision Record Template

>|              |                                                        |
>| ------------ |--------------------------------------------------------|
>| Date         | `25/04/2025`                                           |
>| Status       | `Accepted`                                             |
>| Deciders     | `Engineering`                                          |
>| Significance | `Structure, Nonfunctional characteristics, Interfaces` |
>| Owners       | `Ankur Jain, Anoop Surej, Donna Belsey`                |

---

- [ADR-005: NHS Login OIDC Flow Library](#adr-nnn-any-decision-record-template)
  - [Context](#context)
  - [Decision](#decision)
    - [Assumptions](#assumptions)
    - [Drivers](#drivers)
    - [Options](#options)
    - [Outcome](#outcome)
    - [Rationale](#rationale)
  - [Consequences](#consequences)
  - [Compliance](#compliance)
  - [Notes](#notes)
  - [Actions](#actions)
  - [Tags](#tags)

## Context

Integrating with NHS Login necessitates handling several OpenID Connect (OIDC) calls to the NHS Login provider. These calls
include /authorize to retrieve the authorization code, /token to exchange the authorization code for an id_token and
access_token, and /userinfo to fetch user details. To streamline this process and avoid manual implementation of the OIDC
flow, we evaluated established libraries. This Architectural Decision Record (ADR) details the decision-making process
for selecting one of these libraries.

## Decision
We have decided to adopt the next-auth library (also known as [authjs](https://authjs.dev/)). This library offers a clean
and concise approach to configuring authentication providers and provides flexibility for future use cases. Furthermore,
next-auth manages sessions and session lifecycle, eliminating the need for a separate session management library.
Notably, next-auth leverages the well-regarded [openid-client](https://github.com/panva/openid-client) library internally.

### Assumptions

### Drivers
- Ease of Development: next-auth automates the authentication flow, significantly reducing the development effort required to integrate with NHS Login.
- Additional Features: By handling sessions, next-auth prevents the need to integrate and manage a separate session management library.
- Maintainability: The reduced codebase resulting from using next-auth will lead to easier maintenance and debugging.

### Options
The primary alternative considered was the openid-client library. This is a lower-level library that provides the tools
to construct authorization and authentication requests. However, it requires manual handling of callbacks and the retrieval
of user information. Additionally, session management would need to be implemented using a separate library.

### Outcome
The decision to use next-auth is reversible. Should we encounter significant challenges or limitations with next-auth in
the future, we can transition to openid-client and potentially integrate with a session management library like [iron-session](https://github.com/vvo/iron-session).

### Rationale
- Automated Auth Flow: next-auth automatically handles the chain of OIDC calls required for the authentication flow.
- Reduced Boilerplate: The library abstracts away much of the low-level implementation details, minimizing the amount of code developers need to write.
- Integrated Session Management: next-auth provides built-in session management capabilities, simplifying the overall integration.

## Consequences
- Dependency on Beta Version: The version of next-auth that includes native support for PrivateKeyJwt signing (a requirement for the NHS Login flow) is currently in beta. This introduces a potential risk of encountering bugs or breaking changes.

## Compliance
- Security/Penetration Testing: Thorough security reviews and penetration testing will be crucial to ensure the chosen library and its configuration do not introduce any security vulnerabilities.

## Notes
None

## Actions
- [x] Anoop Surej, 25/04/2025, created the ADR

## Tags
`#maintainability`, `#testability`, `#simplicity`, `#security`
