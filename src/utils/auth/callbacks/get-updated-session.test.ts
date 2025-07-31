import { NhsNumber } from "@src/models/vaccine";
import { AccessToken, ExpiresIn, IdToken } from "@src/utils/auth/apim/types";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

describe("getSession", () => {
  it("updates session user fields from token when both defined", () => {
    const session: Session = {
      user: {
        nhs_number: "" as NhsNumber,
        birthdate: "",
      },
      expires: "some-date",
      nhs_login: {
        id_token: "" as IdToken,
      },
      apim: {
        access_token: "" as AccessToken,
        expires_in: "0" as ExpiresIn,
      },
    };

    const token = {
      user: {
        nhs_number: "test-nhs-number" as NhsNumber,
        birthdate: "test-birthdate",
      },
      nhs_login: {
        id_token: "test-id-token" as IdToken,
      },
      apim: {
        access_token: "test-access-token" as AccessToken,
        expires_in: "0" as ExpiresIn,
      },
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("test-nhs-number");
    expect(result.user.birthdate).toBe("test-birthdate");
    expect(result.nhs_login.id_token).toBe("test-id-token");
    expect(result.apim.access_token).toBe("test-access-token");
    expect(result.apim.expires_in).toBe("0");
  });

  it("does not update session if token.user is missing", () => {
    const session: Session = {
      user: {
        nhs_number: "old-nhs-number" as NhsNumber,
        birthdate: "old-birthdate",
      },
      expires: "some-date",
      nhs_login: {
        id_token: "old-id-token" as IdToken,
      },
      apim: {
        access_token: "old-access-token" as AccessToken,
        expires_in: "0" as ExpiresIn,
      },
    };

    const token = {} as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("old-nhs-number");
    expect(result.user.birthdate).toBe("old-birthdate");
    expect(result.nhs_login.id_token).toBe("old-id-token");
    expect(result.apim.access_token).toBe("old-access-token");
    expect(result.apim.expires_in).toBe("0");
  });

  it("does not update session if session.user is missing", () => {
    const session = {
      expires: "some-date",
    } as Session;

    const token = {
      user: {
        nhs_number: "test-nhs-number",
        birthdate: "test-birthdate",
      },
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user).toBeUndefined();
  });
});
