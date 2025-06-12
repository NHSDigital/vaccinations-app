import { Session } from "next-auth";

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

export { mockSession };
