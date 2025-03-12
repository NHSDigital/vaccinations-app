import { getPageCopyForVaccine } from "@src/services/content-api/contentFilter";
import { VaccineTypes } from "@src/models/vaccine";
import { getContentForVaccine } from "@src/services/content-api/contentService";
import genericMockVaccineData from "@test-data/genericMockVaccineData";

jest.mock("@src/services/content-api/contentService");

describe("Content Filter", () => {
  describe("getPageCopyForVaccine", () => {
    it("should return overview text for 6-in-1 vaccine", async () => {
      const expectedPageCopyFor6in1 = {
        overview:
          "The generic vaccine helps protect against serious illnesses.",
        whatVaccineIsFor:
          '<p>Benefits Health Aspect:</p><ul><li><a href="https://www.nhs.uk/conditions/diphtheria/">diphtheria</a></li></ul><p>Second paragraph Benefits Health Aspect.</p><ul><li>Some list</li></ul>',
      };
      (getContentForVaccine as jest.Mock).mockResolvedValue(
        genericMockVaccineData,
      );
      const pageCopyFor6in1 = await getPageCopyForVaccine(
        VaccineTypes.SIX_IN_ONE,
      );

      expect(pageCopyFor6in1).toEqual(expectedPageCopyFor6in1);
    });
  });
});
