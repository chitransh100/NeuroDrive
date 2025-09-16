const carCanvas = document.getElementById("carCanvas"); //refrencing the canvas we defined in the html
// canvas.height = window.innerHeight;
const networkCanvas = document.getElementById("newtworkCanvas");
networkCanvas.width = 500;
carCanvas.width = 300;
//  <canvas> element used for drawing graphics on a web page, the context refers to the specific rendering API or environment that provides the methods and properties for performing drawing operations.
// Essentially, the <canvas> element itself acts as the drawing surface, while the context is the "toolset" you use to actually draw on that surface.
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
// canvas.getContext('2d'), you are requesting an object that provides a set of methods and properties specifically designed for drawing 2D shapes, text, and images. This object, typically assigned to a variable like ctx, then becomes your interface for all your 2D drawing operations on that particular canvas.

const N = 100; //number of cars

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.96); //(center, width * so that the lines of the road has some margin )
// const car = new Car(road.getLaneWidth(1), 100, 30, 50, "AI"); //introducing "KEYS" to impement the key functions of our car
// localStorage.setItem("toggle", "AI")
let toggle = localStorage.getItem("toggle") || "AI";
const cars = generateCars(N);
let bestCar = cars[0];

function change() {
      toggle = toggle === "AI" ? "KEYS" : "AI";
      localStorage.setItem("toggle", toggle); 
  console.log("Switched to:", toggle);
  let newCars;
  if(toggle === "AI"){
    newCars = generateCars(N);
  }else{
    newCars = generateCars(1);
  }
  cars.length = 0;
  cars.push(...newCars);
  bestCar = cars[0];
  
  // Load brains after creating new cars
  if (toggle === "AI" && localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
      cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
      if (i != 0) {
        NeuralNetwork.mutate(cars[i].brain, 0.2);
      }
    }
  }
    window.location.reload(); 

}

//when we refresh the page or restart the simulation, normally all progress is lost, and all cars start with random brains again. That’s wasteful.
// this checks that if there is already a brain present in teh local storage if yes it assigns the brain to teh car
//sets the brain of best car to the car after refresh
// if (toggle === "AI" && localStorage.getItem("bestBrain")) {
//   for (let i = 0; i < cars.length; i++) {
//     cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
//     if (i != 0) {
//       NeuralNetwork.mutate(cars[i].brain, 0.3);
//     }
//   }
// }

//this will save the current best brain
function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}
//this will remove all teh brain saved in the main memory in the
function discard() {
  localStorage.removeItem("bestBrain");
}

//till now we were dealing with a single car and in that we were finding the best car with tral and error here, now we are making multiple cars and then we will have multiple cars to start with which will reduce our chances of the having multiple trial and error
function generateCars(N) {
  const cars = [];
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneWidth(1), 100, 30, 50, toggle));
  }
  return cars;
}

const traffic = [
  new Car(road.getLaneWidth(1), -200, 30, 50, "Traffic"), //introducin traffic to implement traffic properties of it
  new Car(road.getLaneWidth(0), -300, 30, 50, "Traffic"),
  new Car(road.getLaneWidth(2), -300, 30, 50, "Traffic"),
  new Car(road.getLaneWidth(1), -500, 30, 50, "Traffic"),
  new Car(road.getLaneWidth(2), -500, 30, 50, "Traffic"),
  new Car(road.getLaneWidth(0), -700, 30, 50, "Traffic"),
  new Car(road.getLaneWidth(2), -700, 30, 50, "Traffic"),
];
// const car = new Car(100,100,30,50); //object of class car
// car.draw(ctx) //a methd in the car class // dont draw the car outside first update the car to acquire the positions and then draw the cars

animate();

function animate(time) {
  // car.update(road.border, traffic); //another funtion which runs when the arrowkeys are triggered ,  traffic is also passed in here so that we can detect the collision of the car with the traffic
  //now we have multiple cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.border, traffic);
  }
  //after updating every car we can have the best car which has the maximum y value
  //this is a fitness function
  // A fitness function is a specific objective or cost function that evaluates how well a potential solution or system aligns with a desired set of goals or criteria, assigning a numerical "fitness" score to represent its quality
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  for (let i = 0; i < traffic.length; i++) {
    //this will iterate through each car and udate its position first
    //but this will overright the update function and we wont be able to actually control our original car
    traffic[i].update(road.border, []); // here only an empty array is passed so that the traffic dont check the collision with themself and get destroyed
  }

  // Spawn new traffic cars
  // Spawn new traffic cars
  const lastTraffic = Math.min(...traffic.map((t) => t.y));
  if (lastTraffic > bestCar.y - 1200) {
    // Spawn 2-3 cars with spacing
    for (let i = 0; i < 3; i++) {
      const lane = Math.floor(Math.random() * road.lanecount);
      const spacing = 200 + Math.random() * 300; // Random spacing between cars
      traffic.push(
        new Car(
          road.getLaneWidth(lane),
          bestCar.y - 1200 - i * spacing,
          30,
          50,
          "Traffic"
        )
      );
    }
  }

  // Remove old traffic cars
  for (let i = traffic.length - 1; i >= 0; i--) {
    if (traffic[i].y > bestCar.y + 1000) {
      traffic.splice(i, 1);
    }
  }

  carCanvas.height = window.innerHeight; //putting this here to handle the trail effect (wipes the canvas in every frame);
  networkCanvas.height = window.innerHeight;
  carCtx.save();
  //for case of multiple cars we are going to observe our main car that is first one
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.8); //shifts the origin to these points
  // You’re shifting the entire coordinate system upward by car.y.
  // So instead of redrawing the car far down the canvas, you bring the world up so the car looks like it stayed in view.
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    //this will iterate through each car in the traffic and draw each car
    traffic[i].draw(carCtx);
  }
  //this globalAlpha controls the transprancy of the context
  carCtx.globalAlpha = 0.2;
  // car.draw(carCtx); //function in the car.js
  //now we have multiple cars
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx);
  }
  //globalAlpha of 1 means completly visible
  carCtx.globalAlpha = 1;
  //making the 0th car the most visible one
  bestCar.draw(carCtx, true);

  carCtx.restore();
  networkCtx.lineDashOffset = -time / 50;
  //in case of multiple cars we are going to have the braing of the first car we have
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate); //browser-provided function that you use to create smooth animations in JavaScript. Instead of using setInterval or setTimeout to run your animation loop (which can cause stuttering), you use requestAnimationFrame(). The browser then calls your function just before the next repaint, giving you the smoothest and most efficient update.
}

//NOTES
// inside the animation loop (before drawing), you are resetting the entire canvas each frame.
// That does two things:
// Clears the canvas completely (like wiping a whiteboard before drawing again).
// Resets it to the full browser window height (so you always see the full drawing area, no shrinking).
// So now, on each frame:
// Old drawings are erased.
// Only the new position of the car is drawn.
// This creates the illusion of smooth movement.
//  Instead of re-setting height every frame (which is a bit heavy-handed), some people use:
// ctx.clearRect(0, 0, canvas.width, canvas.height);
// That just clears the canvas without resizing it
