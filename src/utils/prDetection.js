export function detectPR(previousSets, exercise, weight, reps) {
  const sameExercise = previousSets.filter((s) => s.exercise === exercise)
  if (sameExercise.length === 0) return true

  const best = sameExercise.reduce(
    (max, s) => {
      const score = s.weight * s.reps
      return score > max.score ? { score, weight: s.weight, reps: s.reps } : max
    },
    { score: 0, weight: 0, reps: 0 },
  )

  return weight > best.weight || (weight === best.weight && reps > best.reps)
}
