import lazyConfig from "@src/utils/lazy-config";
import { JWT, getToken } from "next-auth/jwt";
import { cookies, headers } from "next/headers";

const getJwtToken = async (): Promise<JWT | null> => {
  const headerEntries = await headers();
  const cookieEntries = await cookies();
  const req = {
    headers: Object.fromEntries(headerEntries),
    cookies: Object.fromEntries(cookieEntries.getAll().map((c) => [c.name, c.value])),
  };

  return await getToken({ req, secret: (await lazyConfig.AUTH_SECRET) as string, secureCookie: true });
};
export { getJwtToken };
