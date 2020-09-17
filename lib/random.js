import { Random } from "https://deno.land/x/random@v1.1.2/Random.js";

// Shuffle an array using the Fisher-yates Shuffle
// See: https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
// See: https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

// Generates a random string of the given length.
// See: https://deno.land/x/random@v1.1.2
export const randomString = (length) => Random.i.string(length);
