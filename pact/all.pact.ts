import { readFile } from "node:fs/promises";

describe('Content API', () => {
  test("getContentForVaccine contract", async () => {
    const vaccineContent = await readFile("wiremock/__files/rsv-vaccine.json", { encoding: "utf8" });
    console.log(JSON.parse(vaccineContent));
  });
});
