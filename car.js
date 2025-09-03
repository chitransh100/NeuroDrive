class Car {
  //no need to declare the variables in class
  //dealing with 4th qudrant here
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //let us introduce the speed and the accelerations here
    this.speed = 0;
    this.acceleration = 0.2;
    //introducing friction to stop the car
    this.friction = 0.05;
    this.maxSpeed = 3;
    //introduce an angle
    this.angle = 0; //from the x axis

    // ---------------------------> x asix
    // |\  angle from the x-axis
    // |  \
    // |    \
    // |      \
    // |
    // y-axis

    //till now there are no controls of the car so create a new object defining the controls
    this.controls = new Controls();
    //controls will be the object defining the movement of the car
  }

  update() {
    this.#move();
  }

  #move(){ 
    //for up and down
    if (this.controls.forward) {
      // this.y -= 2; the y increases downwards -> we need some acceleration here
      this.speed += this.acceleration; //v=v+a⋅Δt (Δt = 1sec)
    }
    if (this.controls.reverse) {
      // this.y += 1; have to use "this" keyword
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed; //capping the speed
    }
    if (this.speed < -this.maxSpeed) {
      this.speed = -this.maxSpeed;
      //capping the speed for the opposite direction (- == opposite direction)
    }
    if (this.speed > 0) {
      this.speed -= this.friction; //vnew=vold​×(1−f)
    }
    if (this.speed < 0) {
      //for reverse speed
      this.speed += this.friction; //friction always opposes motion
    }
    // Prevent oscillation near 0 (very important)
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
      //If the current speed is smaller than the friction amount, we just force the speed to 0 (stop the car completely).
    }
    //for left and right
    if (this.speed != 0) { //makes sure that if speed is 0 then do nothing dont move right or left 
        const flip = this.speed>0 ? 1:-1;
    
      if (this.controls.left) {
        // this.x -= 2;
        this.angle += 0.02*flip; //moving the line towards teh y axis
      }
      if (this.controls.right) {
        // this.x += 2;
        this.angle -= 0.02*flip ;
      }
    }

    // this.y -= this.speed; //y=y+v⋅Δt (Δt = 1sec)
    this.y -= Math.cos(this.angle) * this.speed; //speed has 2 components now
    this.x -= Math.sin(this.angle) * this.speed; //so as the distance will have
  }

  draw(ctx) {
    //initially canvas has the origin at the top left corner.
    ctx.save(); //??????????????????
    ctx.translate(this.x, this.y); //move origin to the car's (x, y) position
    ctx.rotate(-this.angle); //rotates the axes counterclockwise by θ around the origin (-ve for the clock wise)
    //takes ctx as a input which issues us the drawing commands
    ctx.beginPath(); //starting new shape (forget previous shapes )
    ctx.rect(
      //takes the center of rectangle (x,y) and the width
      //creates rectangle path on the given spaces
      //   this.x - this.width / 2,
      //   this.y - this.height / 2,
      -this.width / 2, //after translate teh center is this now
      -this.height / 2, //we shifted the origin to x,y
      this.width,
      this.height
    );
    ctx.fillStyle = "blue"; //sets (fills) the car's color
    ctx.fill(); //fills the rectangle with the current fillStyle (color).
    ctx.restore(); //????????????????
    //With save/restore: each shape can be drawn in its own local coordinate system.
  }
}
