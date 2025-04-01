import { v4 as uuid } from "uuid";

import { removeAccent } from "./removeAccent";
import { removeDuplicatedSpaceCharacter } from "./removeDuplicatedSpaceCharacter";
import { removeSpecialCharacter } from "./removeSpecialCharacter";
import { replaceSpaceCharacter } from "./replaceSpaceCharacter";

export function createSlug(value: string, add_uuid = false): string {
  let handled_value = value.toLowerCase().trim();

  handled_value = removeAccent(handled_value);

  handled_value = removeSpecialCharacter(handled_value);

  handled_value = removeDuplicatedSpaceCharacter(handled_value);

  handled_value = replaceSpaceCharacter(handled_value, "-");

  if (add_uuid) {
    handled_value += "-" + uuid();
  }

  return handled_value;
}
