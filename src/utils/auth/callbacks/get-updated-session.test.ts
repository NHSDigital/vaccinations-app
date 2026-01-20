import { AgeGroup } from "@src/models/ageBasedHub";
import { NhsNumber } from "@src/models/vaccine";
import { getUpdatedSession } from "@src/utils/auth/callbacks/get-updated-session";
import { AccessToken, BirthDate, ExpiresAt, IdToken } from "@src/utils/auth/types";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));

const mockBirthdate = "1995-01-01";
const mockAgeGroup = AgeGroup.AGE_17_to_24;

const session: Session = {
  user: {
    nhs_number: "" as NhsNumber,
    age_group: undefined,
  },
  expires: "some-date",
};

const token = {
  user: {
    nhs_number: "test-nhs-number" as NhsNumber,
    birthdate: mockBirthdate as BirthDate,
    age_group: mockAgeGroup,
  },
  nhs_login: {
    id_token: "test-id-token" as IdToken,
  },
  apim: {
    access_token: "test-access-token" as AccessToken,
    expires_at: 0 as ExpiresAt,
  },
} as JWT;

describe("getUpdatedSession", () => {
  beforeEach(() => {});

  it("updates session with user fields and age information from token", () => {
    const result: Session = getUpdatedSession(session, token);

    expect(result.user.nhs_number).toBe("test-nhs-number");
    expect(result.user.age_group).toBe(mockAgeGroup);
  });

  it("does not update session if token.user is missing", () => {
    const session: Session = {
      user: {
        nhs_number: "old-nhs-number" as NhsNumber,
        age_group: AgeGroup.AGE_25_to_64,
      },
      expires: "some-date",
    };

    const emptyToken = {} as JWT;

    const result: Session = getUpdatedSession(session, emptyToken);

    expect(result.user.nhs_number).toBe("old-nhs-number");
    expect(result.user.age_group).toBe(AgeGroup.AGE_25_to_64);
  });

  it("does not update session if session.user is missing", () => {
    const sessionWithoutUser = {
      expires: "some-date",
    } as Session;

    const token = {
      user: {
        nhs_number: "test-nhs-number",
        birthdate: mockBirthdate,
      },
    } as JWT;

    const result: Session = getUpdatedSession(sessionWithoutUser, token);

    expect(result.user).toBeUndefined();
  });
});
