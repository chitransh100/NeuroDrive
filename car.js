const carColors = [
  "#FF5733", // orange-red
  "#33FF57", // green
  "#3357FF", // blue
  "#F1C40F", // yellow
  "#9B59B6", // purple
  "#E67E22", // orange
  "#1ABC9C", // turquoise
  "#E74C3C", // red
  "#2ECC71", // emerald green
  "#3498DB", // sky blue
  "#7D3C98", // violet
  "#27AE60", // dark green
  "#F39C12", // golden orange
  "#C0392B", // crimson
  "#16A085"  // teal
];
class Car {
  //no need to declare the variables in class
  //dealing with 4th qudrant here
  constructor(x, y, width, height, controlType) {
    //introduced the controlType so that we can diffrentiate between the original and traffic car 
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //let us introduce the speed and the accelerations here
    this.speed = 0;
    this.acceleration = 0.2;
    //introducing friction to stop the car
    this.friction = 0.05;
    if(controlType == "KEYS" || controlType == "AI"){
      this.maxSpeed = 3;
    }else{
      this.maxSpeed = 2;
    }
    //introduce an angle
    this.angle = 0; //from the x axis
    this.color;

    // ---------------------------> x asix
    // |\  angle from the x-axis
    // |  \
    // |    \
    // |      \
    // |
    // y-axis

    //set teh useBrain to true if the control type is AI;
    this.useBrain = controlType == "AI"; 

    if(controlType == "KEYS" || controlType == "AI"){
      //creating a new sensor and passing the car to it so that when the car is created the sensor is already created automatically
       this.sensor = new Sensor(this); 
       //creating a neural network 
       this.brain = new NeuralNetwork( 
        [this.sensor.rayCount, 6, 4] //passing array of neuron counts for the network the last 4 because of the controls;
       )
    }else{
      this.color = carColors[Math.floor(Math.random()*carColors.length)]
    }
   
    //till now there are no controls of the car so create a new object defining the controls
    this.controls = new Controls(controlType); //passing such that there must be a object for controls but differenct controls for every car 
    //controls will be the object defining the movement of the car
    this.damaged = false; //detecting road borders and the cars did they collide 
  }

  update(roadborder, traffic) {
    
    if(!this.damaged){ //dont move teh car if its damaged 
      this.#move();
      this.polygon = this.#createPolygon(); //creating a polygon to know the coordinates of a the car 
      this.damaged = this.#assessDamage(roadborder, traffic) //function to detect any intersection between the car borders and the borders;
    }
    // if(controlType == "KEYS") we cant check for the controlTypes in an other function
    if(this.sensor){ //check if the sensor is present or not rather than 
      // so that the sensor gets update when the car is getting updated
      this.sensor.update(roadborder, traffic); 
      //as offset tells you how far along the ray/line segment the collision happened and the more close value to 0 the more close the collision occurs 
      //but in this case if the offsets is high means the object is vey near
      const offsets = this.sensor.readings.map(s=> s==null ? 0 : 1-s.offset); 
      //now we have the offsets and now we will send these inputs we are getting from the offsets to the neural network 
      //originally the first input to the network is the sensor readings so we pass these offsets (high value means the object is close)
      //these outputs are the control of the car [1, 0, 1, 0] = [forward, left, right, backward]
      const outputs = NeuralNetwork.feedForward(offsets, this.brain); //brain is object of the neural Network
      console.log(outputs)
      if(this.useBrain){
        this.controls.forward = outputs[0];
        this.controls.reverse = outputs[1];
        this.controls.left = outputs[2];
        this.controls.right = outputs[3];

      }

      
    }
  }

  #assessDamage(roadborder, traffic){
    for(let i=0; i<roadborder.length; i++){
      if(polyIntersect(this.polygon, roadborder[i])){ //another utility function to detect intesection between the car borders and the road border lines 
        //roadborders is array of array so we pass roadborders[i] to check with the first raodborder and teh the other one 
        return true;
      }
    }
    //polyIntersect takes only 2 parameters so we have to check for the traffic 
    for(let i=0; i<traffic.length; i++){
      if(polyIntersect(this.polygon, traffic[i].polygon)){ //another utility function to detect intesection between the car borders and the road border lines 
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
      if(this.sensor)
      ctx.fillStyle = "#32CD32";
      else{
        // ctx.fillStyle = "black"
        ctx.fillStyle = this.color;
      }

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
    // if(controlType == "KEYS") same here line 46
    if(this.sensor) //if the sensor object is created then only we can have teh sensors on a car 
    this.sensor.draw(ctx) //this is to draw the sensor when ever the car is drwan and updated to draw 
  }
}
