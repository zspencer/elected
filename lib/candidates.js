import { airtable } from "./Airtable.js";

const toCandidateFromAirtable = (airtableRecord) => ({
  id: airtableRecord.id,
  name: airtableRecord.fields["Name"],
  statement: airtableRecord.fields["Statement"],
});

export const retrieveCandidates = async () =>
  (await airtable.get("Candidates"))
    .map(toCandidateFromAirtable);
