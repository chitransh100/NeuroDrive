const canvas = document.getElementById("gameCanvas")  //refrencing the canvas we defined in the html 
// canvas.height = window.innerHeight;
canvas.width = 200;
//  <canvas> element used for drawing graphics on a web page, the context refers to the specific rendering API or environment that provides the methods and properties for performing drawing operations.
// Essentially, the <canvas> element itself acts as the drawing surface, while the context is the "toolset" you use to actually draw on that surface.
const ctx = canvas.getContext("2d");
// canvas.getContext('2d'), you are requesting an object that provides a set of methods and properties specifically designed for drawing 2D shapes, text, and images. This object, typically assigned to a variable like ctx, then becomes your interface for all your 2D drawing operations on that particular canvas.
const car = new Car(100,100,30,50); //object of class car
car.draw(ctx) //a methd in the car class 

animate();

function animate(){
    car.update(); //another funtion which runs when the arrowkeys are triggered 
    canvas.height = window.innerHeight; //putting this here to handle the trail effect (wipes the canvas in every frame);
    car.draw(ctx); //function in the car.js
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