#!/usr/bin/env -S deno run --allow-read --allow-net 
import { airtable } from "./lib/Airtable.js";
import { sendBallot } from "./lib/sendBallot.js";
import { config } from "https://deno.land/x/dotenv/mod.ts";

// First, we retrieve the eligible voters from the Voters
// table and extract their Name and Email.
const voters = (await airtable.get("Voters"))
  .map((v) => ({ name: v.fields["Name"], email: v.fields["Email"] }));

// We put in a Candidate named `Abstain` as a hacky way to
// ensure Voters have a way to not prefer someone.
const notAbstain = (c) => c.name !== "Abstain";

// Then, we retrieve the Candidates, extract their Name and Statement
// and remove the candidates who are named "Abstain"
const candidates = await retrieveCandidates()
  .filter(notAbstain);

// Then we gather the election information from the environment
const election = {
  name: config()["ELECTION_NAME"],
  ballotDropoffUrl: config()["ELECTION_BALLOT_DROPOFF_URL"],
  secretary: config()["ELECTION_SECRETARY"],
};

// And send a Ballot to each voter!
voters.forEach((voter) => sendBallot({ election, candidates, voter }));
