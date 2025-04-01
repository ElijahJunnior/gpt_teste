export function removeSpecialCharacter(text: string): string {
  return text.replace(/[^\w\s]/gi, "");
}
