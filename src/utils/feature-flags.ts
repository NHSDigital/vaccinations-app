"use server";

const isMockedDevSession = async () => {
  return process.env.USE_MOCKED_SESSION === "true";
};

export { isMockedDevSession };
