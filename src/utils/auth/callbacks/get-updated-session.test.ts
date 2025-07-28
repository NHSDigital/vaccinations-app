import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

describe("getSession", () => {
  it("updates session user fields from token when both defined", () => {
    const session: Session = {
      user: {
        nhs_number: "",
        birthdate: "",
        id_token: {
          jti: "",
        },
      },
      expires: "some-date",
    };

    const token = {
      user: {
        nhs_number: "test-nhs-number",
        birthdate: "test-birthdate",
      },
      id_token: {
        jti: "jti_test",
      },
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("test-nhs-number");
    expect(result.user.birthdate).toBe("test-birthdate");
    expect(result.user.id_token.jti).toBe("jti_test");
  });

  it("does not update session if token.user is missing", () => {
    const session: Session = {
      user: {
        nhs_number: "old-nhs-number",
        birthdate: "old-birthdate",
        id_token: {
          jti: "old-id-token",
        },
      },
      expires: "some-date",
    };

    const token = {} as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("old-nhs-number");
    expect(result.user.birthdate).toBe("old-birthdate");
    expect(result.user.id_token.jti).toBe("old-id-token");
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
