import { promises as fs } from "fs";

export async function GET() {
  const path: string = process.cwd() + "/src/app/mock/api/rsv-vaccine.json";
  const file: string = await fs.readFile(path, "utf8");
  const mockedResponse = JSON.parse(file);

  return Response.json(mockedResponse);
}
