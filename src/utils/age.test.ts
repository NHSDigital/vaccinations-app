import { calculateAge } from "./age";

describe("calculateAge", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-15T00:00:00.000Z").getTime());
  });

  it("should return age based on birthdate", () => {
    const birthdate = "2011-11-01";

    const result = calculateAge(birthdate);

    expect(result).toEqual(13);
  });

  it("should return age of previous year if upcoming birthday is this month", () => {
    const birthdate = "1987-01-17";

    const result = calculateAge(birthdate);

    expect(result).toEqual(37);
  });

  it("should return updated age if today is their birthday", () => {
    const birthdate = "1987-01-15";

    const result = calculateAge(birthdate);

    expect(result).toEqual(38);
  });

  it("should return age of this year if birthday was yesterday", () => {
    const birthdate = "1987-01-14";

    const result = calculateAge(birthdate);

    expect(result).toEqual(38);
  });

  it("should throw if birthdate is invalid", () => {
    const birthdate = "1987-13-17";

    expect(() => {
      calculateAge(birthdate);
    }).toThrow();
  });
});
