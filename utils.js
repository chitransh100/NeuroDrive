//linear interpolation A= start, B= end, t= fraction
// So lerp makes sure lines are perfectly spaced, no matter how wide the road is.
function lerp(A, B, t) {
  return A + (B - A) * t;
    //   (B - A) is the total distance.
    // (B - A) * t gives you how much distance to move from A.
    // Add back A to shift to the correct spot.
}

// Example:
// Say road has 3 lanes → 4 vertical lines total:
// |   |   |   |
// Left border: lerp(left, right, 0/3) → left edge
// Lane divider 1: lerp(left, right, 1/3) → 1/3 across road
// Lane divider 2: lerp(left, right, 2/3) → 2/3 across road
// Right border: lerp(left, right, 3/3) → right edge
// So lerp makes sure lines are perfectly spaced, no matter how wide the road is.