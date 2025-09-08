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
    this.sensor = new Sensor(this);//creating a new sensor and passing the car to it so that when the car is created the sensor is already created automatically 
    //till now there are no controls of the car so create a new object defining the controls
    this.controls = new Controls();
    //controls will be the object defining the movement of the car
    this.damaged = false; //detecting road borders and the cars did they collide 
  }

  update(roadborder) {
    if(!this.damaged){ //dont move teh car if its damaged 
      this.#move();
      this.polygon = this.#createPolygon(); //creating a polygon to know the coordinates of a the car 
      this.damaged = this.#assessDamage(roadborder) //function to detect any intersection between the car borders and the borders;
    }
    this.sensor.update(roadborder); // so that the sensor gets update when the car is getting updated
  }

  #assessDamage(roadborder){
    for(let i=0; i<roadborder.length; i++){
      if(polyIntersect(this.polygon, roadborder[i])){ //another utility function to detect intesection between the car borders and the road border lines 
        //roadborders is array of array so we pass roadborders[i] to check with the first raodborder and teh the other one 
        return true;
      }
    }
    return false;
  }

  #createPolygon(){
    const points = [];
    const rad = Math.hypot(this.width,this.height)/2;
    // const alpha = Math.tanh(this.width, this.height); //used to calculate the hyperbolic tangent of a given number 
    const alpha = Math.atan2(this.width, this.height);  //give the clockwise tand angle of the positive x and the (x,y)
    points.push({
      x: this.x - Math.sin(this.angle-alpha)*rad,
      y: this.y - Math.cos(this.angle-alpha)*rad,
    })
    points.push({
      x: this.x - Math.sin(this.angle+alpha)*rad,
      y: this.y - Math.cos(this.angle+alpha)*rad,
    })
    points.push({
      x: this.x - Math.sin(Math.PI+this.angle-alpha)*rad,
      y: this.y - Math.cos(Math.PI+this.angle-alpha)*rad,
    })
    points.push({
      x: this.x - Math.sin(Math.PI+this.angle+alpha)*rad,
      y: this.y - Math.cos(Math.PI+this.angle+alpha)*rad,
    })
    return points ;
    
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
    if(this.damaged){
      ctx.fillStyle = "red";
    }
    else{
      ctx.fillStyle = "#32CD32";
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x , this.polygon[0].y);
    for(let i=1; i<this.polygon.length; i++){
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    
    ctx.fill()

    //all this without the coordinate of the corner of the car 

    //initially canvas has the origin at the top left corner.
    // ctx.save(); //??????????????????
    // ctx.translate(this.x, this.y); //move origin to the car's (x, y) position
    // ctx.rotate(-this.angle); //rotates the axes counterclockwise by θ around the origin (-ve for the clock wise)
    // //takes ctx as a input which issues us the drawing commands
    // ctx.beginPath(); //starting new shape (forget previous shapes )
    // ctx.rect(
    //   //takes the center of rectangle (x,y) and the width
    //   //creates rectangle path on the given spaces
    //   //   this.x - this.width / 2,
    //   //   this.y - this.height / 2,
    //   -this.width / 2, //after translate teh center is this now
    //   -this.height / 2, //we shifted the origin to x,y
    //   this.width,
    //   this.height
    // );
    // ctx.fillStyle = "blue"; //sets (fills) the car's color
    // ctx.fill(); //fills the rectangle with the current fillStyle (color).
    // ctx.restore(); //????????????????
    // //With save/restore: each shape can be drawn in its own local coordinate system.

    this.sensor.draw(ctx) //this is to draw the sensor when ever the car is drwan and updated to draw 
  }
}
