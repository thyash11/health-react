import { PersonalTargets, TargetHistoryEntry } from "../types";

export const upsertTargetRevision = (
  history: TargetHistoryEntry[],
  effectiveDate: string,
  targets: PersonalTargets,
) => [
  ...history.filter((entry) => entry.effectiveDate !== effectiveDate),
  { effectiveDate, targets },
].sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

export const resolveTargetsForDate = (
  history: TargetHistoryEntry[],
  date: string,
  fallback: PersonalTargets,
) => {
  const chronological = history.slice().sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
  const applicable = chronological.filter((entry) => entry.effectiveDate <= date);
  return (applicable[applicable.length - 1] || chronological[0])?.targets || fallback;
};

export const getLatestWeightGoalRevisionDate = (
  history: TargetHistoryEntry[],
  date: string,
) => {
  const applicable = history
    .filter((entry) => entry.effectiveDate <= date)
    .slice()
    .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));

  let latestRevisionDate: string | undefined;
  let previousTargets: PersonalTargets | undefined;
  applicable.forEach((entry) => {
    if (
      !previousTargets
      || entry.targets.goalWeightKg !== previousTargets.goalWeightKg
      || entry.targets.goalIntensity !== previousTargets.goalIntensity
    ) {
      latestRevisionDate = entry.effectiveDate;
    }
    previousTargets = entry.targets;
  });

  return latestRevisionDate;
};
