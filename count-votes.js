#!/usr/bin/env -S deno run --allow-read --allow-net

import { Random } from "https://deno.land/x/random@v1.1.2/Random.js";
import { airtable } from "./lib/Airtable.js";
import { retrieveCandidates } from "./lib/candidates.js";
import { instantRunoff, kemenyYoung } from "./lib/electionMethods.js";

const votes = (await airtable.get("Votes")).map((record) => record.fields);

const voterIds = (await airtable.get("Ballot IDs"))
  .map((v) => v.fields["Ballot ID"]);

const isValidBallot = (ballot) => voterIds.includes(ballot["Ballot ID"]);

const validBallots = votes.filter(isValidBallot);

const candidates = await retrieveCandidates();
console.log({ validBallots });
const instantRunOffResults = instantRunoff(validBallots);
const kemenyYoungResults = kemenyYoung(validBallots);
console.log({ candidates, instantRunOffResults, kemenyYoungResults });
