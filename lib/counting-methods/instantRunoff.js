// Applies an instant runoff strategy to eliminate the furthest behind
// candidate.
// See: https://en.wikipedia.org/wiki/Instant-runoff_voting
// TODO: Support elections with > 3 candidates
export function instantRunoff(validBallots, without = []) {
  // Count the initial set of first preferences
  const unsortedResults = countFirstPicks(validBallots, without);

  // Sort them by most votes
  const sortedResults = Object.entries(unsortedResults).sort((a, b) => b[1] - a[1]);

  // Once there is a tie or a winner we are done!
  if(isTie(sortedResults) || isVictor(sortedResults)) { return sortedResults }
  // Remove the last place candidate
  without.push(sortedResults[sortedResults.length - 1][0]);
  return instantRunoff(validBallots, without)
}

const isVictor = (sortedResults) => sortedResults[0][1] > sortedResults[1][1]
const isTie = (sortedResults) => sortedResults[0][1] == sortedResults[sortedResults.length - 1][1]



// count the ballots, excluding the candidates who lost the runoff.
const countFirstPicks = (validBallots, without = []) => {
  return validBallots.reduce((results, ballot) => {
    const pick = getFirstPick(ballot, without);

    // When there is not a first pick, do not adjust results
    if (!pick) return results;

    // Ensure the count for a pick starts at 0
    results[pick] = (results[pick] || 0) + 1;
    return results;
  }, {});
};

// Determines the first pick on a ballot excluding candidates who lost the
// runoff
const getFirstPick = (ballot, without) => {
  const pick = AVAILABLE_RANKINGS
    .find((priority) => !without.includes(ballot[priority][0]));

  if (!pick) return;

  return ballot[pick][0];
};

// TODO: We may want to decouple the Airtable-unique "First/Second/Third" pick
// fields in favor of a data structure that represents a ballot more broadly.
const AVAILABLE_RANKINGS = ["First Pick", "Second Pick", "Third Pick"];
