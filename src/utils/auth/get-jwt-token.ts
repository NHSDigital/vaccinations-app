import { AppConfig, configProvider } from "@src/utils/config";
import { JWT, getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

const getJwtToken = async (): Promise<JWT | null> => {
  const config: AppConfig = await configProvider();
  const headerEntries = await headers();
  const cookieEntries = await cookies();
  const req = {
    headers: Object.fromEntries(headerEntries),
    cookies: Object.fromEntries(cookieEntries.getAll().map((c) => [c.name, c.value])),
  };

  return await getToken({ req, secret: config.AUTH_SECRET, secureCookie: true });
};
export { getJwtToken };
