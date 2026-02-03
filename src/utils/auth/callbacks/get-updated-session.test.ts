import { NhsNumber } from "@src/models/vaccine";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { AccessToken, ExpiresAt, IdToken } from "@src/utils/auth/types";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

describe("getSession", () => {
  it("updates session user fields from token when both defined", () => {
    const session: Session = {
      user: {
        nhs_number: "" as NhsNumber,
      },
      expires: "some-date",
    };

    const token = {
      user: {
        nhs_number: "test-nhs-number" as NhsNumber,
      },
      nhs_login: {
        id_token: "test-id-token" as IdToken,
      },
      apim: {
        access_token: "test-access-token" as AccessToken,
        expires_at: 0 as ExpiresAt,
      },
      sessionId: "test-session-id",
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("test-nhs-number");
    expect(result.user.session_id).toBe("test-session-id");
  });

  it("does not update session if token.user is missing", () => {
    const session: Session = {
      user: {
        nhs_number: "old-nhs-number" as NhsNumber,
        session_id: "old-session-id",
      },
      expires: "some-date",
    };

    const token = {} as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("old-nhs-number");
    expect(result.user.session_id).toBe("old-session-id");
  });

  it("does not update session if session.user is missing", () => {
    const session = {
      expires: "some-date",
    } as Session;

    const token = {
      user: {
        nhs_number: "test-nhs-number",
      },
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user).toBeUndefined();
  });
});
