import { getContentForVaccine } from "@src/services/content-api/gateway/content-reader-service";
import { VaccineTypes } from "@src/models/vaccine";


describe('Content API', () => {
  test("getContentForVaccine contract", async () => {
    const res = await getContentForVaccine(VaccineTypes.RSV);
    console.log(res.styledVaccineContent);
    expect(res.styledVaccineContent).toEqual({});
  });
});
