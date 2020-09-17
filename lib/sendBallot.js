import { engineFactory } from "https://deno.land/x/view_engine@v1.3.0/mod.ts";
import { shuffle, randomString } from "./random.js";

import { airtable } from "./Airtable.js";
import { sendEmail } from "./sendEmail.js";

// We send a Ballot to a Voter via the Email address they have on file.
// Each Ballot includes the Candidates being voted on, as well as where the
// Voter can submit their Ballot.
export const sendBallot = async ({ candidates, voter, election }) => {
  // This creates a random identifier for the Ballot that the Voter must enter
  // in order to cast their Vote.
  const ballotId = await createId();

  // We build the ballot from an `ejs` template, which allows us to interpolate
  // data from the Voter, Election, and Candidates.
  const ballot = render(
    ballotTemplate,
    // We `shuffle` the candidates to reduce the probability of ordering bias
    // impacting the outcome.
    { ballotId, candidates: shuffle(candidates), election, voter },
  );

  const subject = `Your ballot for the ${election.name} Election`;
  sendEmail({ to: voter, body: body, subject, from: election.secretary });
};

// We're relying on the `view_engine` deno module to compile the template.
// see: https://deno.land/x/view_engine
const render = engineFactory.getEjsEngine();

// Here is where we define the ballots content as Embedded JavaScript or `ejs`
// see: https://ejs.co
const ballotTemplate = `
<%= voter.name %>,

Your ballot id is <%= ballotId %>. Submit your ballot at <%= election.ballotDropoffUrl %>.

The following candidates are running for {{ election.name }}:

<%_ candidates.forEach(function(candidate)  { %>
<%= candidate.name %>
<%= candidate.statement %>
<%_  }) %>

If you have any questions, please reach out to your election secretary,
<%= election.secretary %>.
`;

// We generate a new Ballot ID and save it to the Ballot IDs table so that every
// Ballot has a unique ID. Because this is generated before the Ballot gets sent
// out, and because we can't read the email once it's been distributed, we don't
// know which Ballot went to which Voter.
const createId = async () =>
  await airtable
    .post("Ballot IDs", [{ fields: { "Ballot ID": generateId() } }])
    .then((bi) => bi[0].fields["Ballot ID"]);

// For now, we're using a relatively poor uniqueness algorithm, and we are not
// checking for conflicts.
const generateId = () => randomString(8);
