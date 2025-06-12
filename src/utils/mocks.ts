import { Session } from "next-auth";
import { readFile } from "node:fs/promises";

const mockSession = (): Session => {
  const session: Session = {
    user: {
      nhs_number: process.env.MOCK_NHS_NUMBER || "",
      birthdate: "12/02/1968",
      access_token: "mock_access_token",
      id_token: {
        jti: "mock_id_token_jti",
      },
    },
    expires: "mock_expires",
  };

  return session;
};

const mockEligibilityApiResponse = async (nhsNumber: string) => {
  const response = await readFile(
    `${process.env.MOCK_ELIGIBILITY_CONTENT_PATH}${nhsNumber}.json`,
    { encoding: "utf8" },
  );
  return JSON.parse(response);
};

export { mockSession, mockEligibilityApiResponse };
