const canvas = document.getElementById("gameCanvas")  //refrencing the canvas we defined in the html 
canvas.height = window.innerHeight;
canvas.width = 200;
//  <canvas> element used for drawing graphics on a web page, the context refers to the specific rendering API or environment that provides the methods and properties for performing drawing operations.
// Essentially, the <canvas> element itself acts as the drawing surface, while the context is the "toolset" you use to actually draw on that surface.
const ctx = canvas.getContext("2d");
// canvas.getContext('2d'), you are requesting an object that provides a set of methods and properties specifically designed for drawing 2D shapes, text, and images. This object, typically assigned to a variable like ctx, then becomes your interface for all your 2D drawing operations on that particular canvas.
const car = new Car(100,100,30,50); //object of class car
car.draw(ctx) //a methd in the car class 

