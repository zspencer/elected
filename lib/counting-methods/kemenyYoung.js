import { isNot } from "../composable-comparators.js";

// A cordorcet method that uses relative preference to allocate points to each
// candidate and sums them to a single score which determines the winner.
//
// See: https://en.wikipedia.org/wiki/Kemeny–Young_method
// See: https://en.wikipedia.org/wiki/Condorcet_method
export const kemenyYoung = (ballots) =>
  ballots.map(toHeadToHeadPreferences).reduce(intoKemenyYoungResults, {});

// Given a ballot, decomposes it into a collection of scored pairs.
export const toHeadToHeadPreferences = (ballot) =>
  candidatesFromBallot(ballot)
    .reduce(intoScoredPairs, {});

// Reduces a set of head to head scored pairs into a dictionary with the sum of
// the candidates scored results.
const intoKemenyYoungResults = (results, headToHeadPreferences) =>
  individualizePreferences(headToHeadPreferences)
    .reduce(intoTotalPoints, results);

// Once we have the pairwise scores, Kemeny-Young strips the competitor so we
// can tally each candidates total score.
const individualizePreferences = (headToHeadPreferences) =>
  Object.entries(headToHeadPreferences).map((
    [matchup, point],
  ) => [candidateFromMatchup(matchup), point]);

const intoTotalPoints = (results, [candidate, points]) => ({
  ...results,
  [candidate]: (results[candidate] || 0) + points,
});

// Extrapolates the set of candidates into a list from a ballot
//
// @param {ballot}
// @return {string[]} candidates
const candidatesFromBallot = (ballot) =>
  AVAILABLE_RANKINGS.map((r) => ballot[r] ? ballot[r][0] : null);

// Gathers a candidates scored pairs against all competitors and merges
// them into the full set of scored pairs
//
// @param {object} scoredPairs current set of scoredPairs
// @param {string} candidate current candidate to build a ranked pair of
// @param {rankedCandidates}
// @return {object} All candites ranked pairs
const intoScoredPairs = (
  previouslyScoredPairs,
  candidate,
  _index,
  rankedCandidates,
) => {
  const newScoredPairs = competitors(candidate, rankedCandidates)
    .reduce(intoScoredPair(candidate, rankedCandidates), {});

  return { ...previouslyScoredPairs, ...newScoredPairs };
};

// Curries a function to make a scored pair for a given candidate against
// competitors
const intoScoredPair = (candidate, rankedCandidates) =>
  (scoredPairs, competitor) => ({
    ...scoredPairs,
    [matchupName(candidate, competitor)]: score(
      candidate,
      competitor,
      rankedCandidates,
    ),
  });

const matchupName = (candidate, competitor) => `${candidate} -> ${competitor}`;
const candidateFromMatchup = (name) => name.split(" -> ")[0];

// Candidates higher or equal in ranking to a Competitor earn a single point
const score = (candidate, competitor, rankedCandidates) =>
  rank(candidate, rankedCandidates) <= rank(competitor, rankedCandidates)
    ? 1
    : 0;

// TODO: This does not yet support equal preference, as rankedCandidates is a
// single-dimensional array.
const rank = (candidate, rankedCandidates) =>
  rankedCandidates.indexOf(candidate);

// Determines the set of competitors of a given candidate
// @param {string} candidate
// @param {string[]} candidates
// @return {string[]} competitors of the given candidate
const competitors = (candidate, candidates) =>
  candidates.filter(isNot(candidate));

// TODO: We may want to decouple the Airtable-unique "First/Second/Third" pick
// fields in favor of a data structure that represents a ballot more broadly.
const AVAILABLE_RANKINGS = ["First Pick", "Second Pick", "Third Pick"];
