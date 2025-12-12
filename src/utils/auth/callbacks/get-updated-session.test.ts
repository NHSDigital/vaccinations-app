import { NhsNumber } from "@src/models/vaccine";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { AccessToken, Age, BirthDate, ExpiresAt, IdToken } from "@src/utils/auth/types";
import { calculateAge } from "@src/utils/date";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/date", () => ({ calculateAge: jest.fn() }));

const mockBirthdate = "1995-01-01";
const mockCalculatedAge = 30;

describe("getSession", () => {
  beforeEach(() => {
    (calculateAge as jest.Mock).mockImplementation(() => mockCalculatedAge);
  });

  it("updates session user fields from token when both defined", () => {
    const session: Session = {
      user: {
        nhs_number: "" as NhsNumber,
        age: 0 as Age,
      },
      expires: "some-date",
    };

    const token = {
      user: {
        nhs_number: "test-nhs-number" as NhsNumber,
        birthdate: mockBirthdate as BirthDate,
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
    expect(result.user.age).toBe(mockCalculatedAge);
  });

  it("does not update session if token.user is missing", () => {
    const session: Session = {
      user: {
        nhs_number: "old-nhs-number" as NhsNumber,
        age: 36 as Age,
      },
      expires: "some-date",
    };

    const token = {} as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("old-nhs-number");
    expect(result.user.age).toBe(36);
  });

  it("does not update session if session.user is missing", () => {
    const session = {
      expires: "some-date",
    } as Session;

    const token = {
      user: {
        nhs_number: "test-nhs-number",
        birthdate: mockBirthdate,
      },
    } as JWT;

    const result: Session = getUpdatedSession(session, token);

    expect(result.user).toBeUndefined();
  });
});
