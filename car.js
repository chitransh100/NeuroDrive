class Car{
    //no need to declare the variables in class 
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        //till now there are no controls of the car so create a new object defining the controls 
        this.controls = new Controls(); 
        //controls will be the object defining the movement of the car 
    }

    update(){
        if(this.controls.forward){
            this.y -= 2; //the y increases downwards 
        }
        if(this.controls.reverse){
            this.y += 1; //have to use "this" keyword
        }
    }

    draw(ctx){
        //takes ctx as a input which issues us the drawing commands
        ctx.beginPath();  //starting new shape (forget previous shapes )
        ctx.rect(          //creates rectangle path on the given spaces 
            this.x-this.width/2,
            this.y-this.height/2,
            this.width,
            this.height,
        );
        ctx.fillStyle = "blue";   //sets (fills) the car's color
        ctx.fill(); //fills the rectangle with the current fillStyle (color).
    }
}