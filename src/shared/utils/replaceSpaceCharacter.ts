export function replaceSpaceCharacter(
  value: string,
  new_character: string
): string {
  return value.replace(/ /g, new_character);
}
