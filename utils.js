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

function getIntersection(A, B, C, D) {
    // Line AB represented as A + t(B - A)
    // Line CD represented as C + u(D - C)
    
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    if (bottom !== 0) {
        
        const t = tTop / bottom;
        const u = uTop / bottom;
        

        // t between 0 and 1 means the intersection is on segment AB
        // u between 0 and 1 means the intersection is on segment CD
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            console.log("here ")
            return {
                x: A.x + t * (B.x - A.x),
                y: A.y + t * (B.y - A.y),
                offset: t
            };
        }
    }
    // console.log("returned null")
    return null; // no intersection
}


function polyIntersect(poly1, poly2){
  for (let i=0; i<poly1.length; i++){
    for (let j=0; j<poly2.length; j++){
      const touch = getIntersection( //will get the intersection of the lines and give us teh result in touch 
        poly1[i],
        poly1[(i+1)%poly1.length], //check for every edge by making a line using points in a cylindrical way 
        poly2[j],
        poly2[(j+1)%poly2.length]
      );
      if (touch) return true; // returns object {x,y,offset}
    }
  }
  return false;
}
