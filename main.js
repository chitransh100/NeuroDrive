const canvas = document.getElementById("gameCanvas")  //refrencing the canvas we defined in the html 
// canvas.height = window.innerHeight;
canvas.width = 300;
//  <canvas> element used for drawing graphics on a web page, the context refers to the specific rendering API or environment that provides the methods and properties for performing drawing operations.
// Essentially, the <canvas> element itself acts as the drawing surface, while the context is the "toolset" you use to actually draw on that surface.
const ctx = canvas.getContext("2d");
// canvas.getContext('2d'), you are requesting an object that provides a set of methods and properties specifically designed for drawing 2D shapes, text, and images. This object, typically assigned to a variable like ctx, then becomes your interface for all your 2D drawing operations on that particular canvas.



const road = new Road(canvas.width/2, canvas.width * 0.96) //(center, width * so that the lines of the road has some margin )
const car = new Car(road.getLaneWidth(1), 100, 30, 50, "KEYS"); //introducing "KEYS" to impement the key functions of our car
const traffic = [
    new Car(road.getLaneWidth(1), -100 ,30 ,50, "Traffic") //introducin traffic to implement traffic properties of it 
]
// const car = new Car(100,100,30,50); //object of class car
// car.draw(ctx) //a methd in the car class // dont draw the car outside first update the car to acquire the positions and then draw the cars 

animate();

function animate(){
    car.update(road.border, traffic); //another funtion which runs when the arrowkeys are triggered ,  traffic is also passed in here so that we can detect the collision of the car with the traffic 
    for(let i=0; i<traffic.length; i++){ //this will iterate through each car and udate its position first
        //but this will overright the update function and we wont be able to actually control our original car 
        traffic[i].update(road.border, []); // here only an empty array is passed so that the traffic dont check the collision with themself and get destroyed
    }
    canvas.height = window.innerHeight; //putting this here to handle the trail effect (wipes the canvas in every frame);
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.8)//shifts the origin to these points 
    // You’re shifting the entire coordinate system upward by car.y.
    // So instead of redrawing the car far down the canvas, you bring the world up so the car looks like it stayed in view.
    road.draw(ctx);
    for(let i=0; i<traffic.length; i++){ //this will iterate through each car in the traffic and draw each car 
        traffic[i].draw(ctx);
    }
    car.draw(ctx); //function in the car.js

    ctx.restore();
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