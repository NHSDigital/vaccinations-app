"use server";

const isMockedDevSession = async () => {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.USE_MOCKED_SESSION === "true"
  );
};

const isMockedEligibilityApi = async () => {
  return (
    process.env.NODE_ENV === "development" &&
    process.env.USE_MOCKED_ELIGIBILITY_API === "true"
  );
};

export { isMockedDevSession, isMockedEligibilityApi };
