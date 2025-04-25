import { defaultSession, getSession } from "@src/utils/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ defaultSession });
    }
    return Response.json({
      isLoggedIn: session.isLoggedIn,
      userInfo: session.userInfo,
    });
  } catch (e) {
    return Response.json({ error: e }, { status: 500 });
  }
}
