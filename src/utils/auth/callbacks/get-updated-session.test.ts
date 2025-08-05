import { NhsNumber } from "@src/models/vaccine";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { AccessToken, BirthDate, ExpiresAt, IdToken } from "@src/utils/auth/types";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

describe("getSession", () => {
  it("updates session user fields from token when both defined", () => {
    const session: Session = {
      user: {
        nhs_number: "" as NhsNumber,
        birthdate: "" as BirthDate,
      },
      expires: "some-date",
      nhs_login: {
        id_token: "" as IdToken,
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
        expires_at: 0 as ExpiresAt,
      },
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("test-nhs-number");
    expect(result.user.birthdate).toBe("test-birthdate");
    expect(result.nhs_login.id_token).toBe("test-id-token");
  });

  it("does not update session if token.user is missing", () => {
    const session: Session = {
      user: {
        nhs_number: "old-nhs-number" as NhsNumber,
        birthdate: "old-birthdate" as BirthDate,
      },
      expires: "some-date",
      nhs_login: {
        id_token: "old-id-token" as IdToken,
      },
    };

    const token = {} as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("old-nhs-number");
    expect(result.user.birthdate).toBe("old-birthdate");
    expect(result.nhs_login.id_token).toBe("old-id-token");
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
