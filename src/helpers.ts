interface ComputeDistribution {
  start: number
  end: number
  spread: number[]
  targetIndex: number
  dest: number
  minSize?: number
}

export const computeDistribution = ({
  start, // Absolute value representing the start of the row/col
  end, // Absolute value representing the end of the row/col
  spread, // Array of relative sizes representing the percent height/width
  targetIndex, // Index passed to the dragger component, representing subsiquent component
  dest, // Absolute value representing the cursors position
  minSize = 36, // Minimum size of a component
}: ComputeDistribution): number[] => {
  // Total size of the row/col in pixels
  const size = end - start

  // Calculate relative value accounding for all components prev/post the two components in question
  const prev = spread.slice(0, targetIndex - 1).reduce((memo, x) => memo + x, 0)
  const post = spread.slice(targetIndex + 1).reduce((memo, x) => memo + x, 0)

  // Calculate the min/max for absolute value of the drop location
  // These are the min/max pixel values acceptable for dest
  const min = size * (prev / 100) + minSize + start
  const max = end - (size * (post / 100) + minSize)

  // Offset the absolute position of the cursor by the starting point of the panel
  // Limit the destination within the min/max bounds
  const destAdjusted = dest - start
  const closestDest = Math.max(min, Math.min(max, destAdjusted))

  // Calculate the relative value for closestDest
  const closestDestRel = (closestDest / size) * 100

  // Return a new array containing the new relative sizes
  // Since the number of components is the same, this will be easy to update
  return spread.map((x, i) => {
    // If the target comes before the split, set the new value relative to all post components
    if (i === targetIndex - 1) return closestDestRel - prev
    if (i === targetIndex) return 100 - (closestDestRel + post)
    return x
  })
}
