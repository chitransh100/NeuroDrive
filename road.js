class Road {
  constructor(x, width, lanecount = 3) {
    this.x = x; //the center of the road
    this.widht = width;
    this.lanecount = lanecount;

    this.left = x - width / 2;
    this.right = x + width / 2; //left and rigth boundary of the road

    this.infinity = 1000000; //want to have the road infinite length long
    this.top = -this.infinity;
    this.bottom = this.infinity; //y on the screen grows downwards

    //defining borders
    const topLeft = {x: this.left, y: this.top};
    const topRight = {x: this.right, y: this.top};
    const bottomLeft = {x: this.left, y: this.bottom};
    const bottomRight = {x: this.right, y: this.bottom};

    this.border = [
        [topLeft, topRight],
        [bottomLeft, bottomRight]
    ];

  }

  getLaneWidth(laneIndex){
    const lanewidht = this.widht /this.lanecount;
    return this.left+lanewidht/2+Math.min(laneIndex,this.lanecount-1)*lanewidht;
    //     from the extreme left + half the lane width + number of lane we covered * their width

  }

  draw(ctx) {
    // Set the thickness of the road boundary lines
    ctx.lineWidth = 5;
    // Set the color of the road boundary lines to white
    ctx.strokeStyle = "white";

    for (let i = 1; i < this.lanecount; i++) {
      const x = lerp(this.left, this.right, i / this.lanecount);
      
    //   if(i>0 && i<this.lanecount){
        ctx.setLineDash([20,20]); //Makes lines dashed: 20px drawn, 20px gap, repeat.
    //   }else{
    //     ctx.setLineDash([]) //Resets to solid line.

    //     //somethimes the last line inherits the dashed state from previous iteration.
    //   }
    //this should be defined at the drawing section;
        
      // -------- LEFT ROAD BORDER --------
      ctx.beginPath();
      // Tells canvas: "I’m starting a new drawing path now."
      //  ctx.moveTo(this.left, this.top);
      ctx.moveTo(x, this.top);
      // Moves the "pen" to the starting point (left border, top of road).
      // Note: (x,y) => x = this.left, y = this.top
      //   ctx.lineTo(this.left, this.bottom);
      ctx.lineTo(x, this.bottom);
      // Draws a straight line from current point to (left border, bottom of road).
      ctx.stroke();
      // Actually draws the path onto the canvas with the strokeStyle (white).
    }
    ctx.setLineDash([]);


    // // -------- RIGHT ROAD BORDER --------
    // ctx.beginPath();
    // // Starts a new path so the right border doesn’t connect with the left.
    // ctx.moveTo(this.right, this.top);
    // // Moves the "pen" to the starting point (right border, top of road).
    // ctx.lineTo(this.right, this.bottom); // Draws a straight line from current point to (right border, bottom of road).
    // ctx.stroke(); // Draws the right border onto the canvas.

    this.border.forEach(border => {
        ctx.beginPath();
        ctx.moveTo(border[0].x, border[0].y);
        ctx.lineTo(border[1].x, border[1].y);
        ctx.stroke();
    });
  }
}



