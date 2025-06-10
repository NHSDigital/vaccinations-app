export const dateMatcher = (actual: string) => {
  expect(Date.parse(actual)).not.toBeNaN();
}
