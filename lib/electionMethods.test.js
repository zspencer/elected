import {
  instantRunoff,
  kemenyYoung,
  toHeadToHeadPreferences,
} from "./electionMethods.js";
import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.69.0/testing/asserts.ts";
const abcBallot = {
  "First Pick": "a",
  "Second Pick": "b",
  "Third Pick": "c",
};
const bacBallot = {
  "First Pick": "b",
  "Second Pick": "a",
  "Third Pick": "c",
};
const acbBallot = {
  "First Pick": "a",
  "Second Pick": "c",
  "Third Pick": "b",
};

Deno.test("toHeadToHeadPreferences", () => {
  assertEquals(
    {
      "a -> b": 1,
      "a -> c": 1,
      "b -> a": 0,
      "b -> c": 1,
      "c -> a": 0,
      "c -> b": 0,
    },
    toHeadToHeadPreferences(abcBallot),
  );
  assertEquals(
    {
      "a -> b": 0,
      "a -> c": 1,
      "b -> a": 1,
      "b -> c": 1,
      "c -> a": 0,
      "c -> b": 0,
    },
    toHeadToHeadPreferences(bacBallot),
  );

  assertEquals(
    {
      "a -> b": 1,
      "a -> c": 1,
      "b -> a": 0,
      "b -> c": 0,
      "c -> a": 0,
      "c -> b": 1,
    },
    toHeadToHeadPreferences(acbBallot),
  );
});

Deno.test("kemenyYoung", () => {
  assertEquals(
    {
      "a": 5,
      "b": 3,
      "c": 1,
    },
    kemenyYoung([abcBallot, bacBallot, acbBallot]),
  );
});
