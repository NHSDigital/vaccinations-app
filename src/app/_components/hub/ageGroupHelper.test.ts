import { getAgeGroup, getAgeGroupOfUser } from "@src/app/_components/hub/ageGroupHelper";
import { AgeGroup } from "@src/models/ageBasedHub";
import { calculateAge } from "@src/utils/date";

jest.mock("sanitize-data", () => ({ sanitize: jest.fn() }));
jest.mock("@src/utils/date", () => ({ calculateAge: jest.fn() }));

describe("Age group helper", () => {
  describe("getAgeGroup", () => {
    const expectedGroupsForEachAge = [
      { age: 12, expectedAgeGroup: AgeGroup.AGE_12_to_16 },
      { age: 16, expectedAgeGroup: AgeGroup.AGE_12_to_16 },
      { age: 17, expectedAgeGroup: AgeGroup.AGE_17_to_24 },
      { age: 24, expectedAgeGroup: AgeGroup.AGE_17_to_24 },
      { age: 25, expectedAgeGroup: AgeGroup.AGE_25_to_64 },
      { age: 64, expectedAgeGroup: AgeGroup.AGE_25_to_64 },
      { age: 65, expectedAgeGroup: AgeGroup.AGE_65_to_74 },
      { age: 74, expectedAgeGroup: AgeGroup.AGE_65_to_74 },
      { age: 75, expectedAgeGroup: AgeGroup.AGE_75_to_80 },
      { age: 80, expectedAgeGroup: AgeGroup.AGE_75_to_80 },
      { age: 81, expectedAgeGroup: AgeGroup.AGE_81_PLUS },
      { age: 91, expectedAgeGroup: AgeGroup.AGE_81_PLUS },
    ];

    it.each(expectedGroupsForEachAge)(`returns $expectedAgeGroup for user age $age`, ({ age, expectedAgeGroup }) => {
      expect(getAgeGroup(age)).toEqual(expectedAgeGroup);
    });

    it("returns unknown age group when age not in defined ranges", () => {
      expect(getAgeGroup(6)).toBe(AgeGroup.UNKNOWN_AGE_GROUP);
    });
  });

  describe("getAgeGroupForUser", () => {
    const mockDateOfBirth = "mock-dob";
    const mockCalculatedAge = 30;

    beforeEach(() => {
      (calculateAge as jest.Mock).mockImplementation(() => mockCalculatedAge);
    });

    it("should return age group for given dob", () => {
      const ageGroupForUser = getAgeGroupOfUser(mockDateOfBirth);

      expect(ageGroupForUser).toBe(AgeGroup.AGE_25_to_64);
    });

    it("should return unknown age group if calculateAge throws", () => {
      const calculateAgeError = new Error('[{ "code": "custom","message": "Invalid date value","path": []}]');

      (calculateAge as jest.Mock).mockImplementation(() => {
        throw calculateAgeError;
      });

      const ageGroupForUser = getAgeGroupOfUser(mockDateOfBirth);

      expect(ageGroupForUser).toBe(AgeGroup.UNKNOWN_AGE_GROUP);
    });
  });
});
