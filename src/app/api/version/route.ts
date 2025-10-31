export const GET = async () => {
  const appVersion = process.env.APP_VERSION;

  return Response.json({ appVersion });
};
