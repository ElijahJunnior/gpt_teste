export function removeDuplicatedSpaceCharacter(text: string): string {
  return text.replace(/\s+/g, " ");
}
