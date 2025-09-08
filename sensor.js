class Sensor{
    constructor(car){
        this.car = car; //the sensor must know where the car is 
        this.rayCount = 3;
        this.raySpread = Math.PI/4; // a 45degree angle 
        this.raylength = 100; // this is the length of the ray or the range of the sensors 

        this.rays=[];  // storing all the rays inside this ray array;
        this.readings=[]; //to store the minimum distance of the multiple intersection of the rays and the objects
    }
    update(roadborder){
        this.#rayCast(); //return starting and the end point of the rays (each)
        this.readings = []; //initialise the array here 
        for(let i= 0; i<this.rayCount; i++){ //iterate through all rays and find the intersection points
            this.readings.push(
                this.#getReading(this.rays[i],roadborder) //will get all minimum touch distance for all the rays and the borders 
            );
        } 
    } 

    #getReading(ray,roadborder){
        this.touches = [];
        for(let i=0; i<roadborder.length; i++){
            const touch = getIntersection( //utility function returning (x,y,offset) (the coordinates and the distance between teh intersection and the ray[0] i.e. the starting point of ray)
                ray[0],
                ray[1],
                roadborder[i][0],
                roadborder[i][1],
            ) 
            if(touch){
                this.touches.push(touch)
            }
            
        }

        if(this.touches.length === 0){
            return null;
        }else{
            //we need the offsets of a all the intersection points in the touches array
            const offsets = this.touches.map(e=>e.offset); //we map every element of the array in touches to the offsets
            const minOffset = Math.min(...offsets) // we find the minimum offset of all the offsets;
            return this.touches.find(e => e.offset === minOffset);  //then we find the element with array touches and return it 
        }
    }

    #rayCast(){
        this.rays=[];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                // this.rayCount === 1 ? 1 : i/(this.rayCount-1) //cant do 1 we have to go for the middle 
                this.rayCount === 1 ? 0.5 : i/(this.rayCount-1) 
            )+this.car.angle; //all the angles must be incremented in direction of car just add the car angle to the ray angle and they will follow car 
 
            const start = {
                x: this.car.x, 
                y: this.car.y,
            };
            const end = {
                x: this.car.x-Math.sin(rayAngle)*this.raylength,
                y: this.car.y-Math.cos(rayAngle)*this.raylength,
            };
            this.rays.push([start,end]);
            
        }
    }

    draw(ctx){

        for(let i=0; i<this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }
            //drawing from teh start to the end we defined 
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y,
            )
            ctx.lineTo(
                // this.rays[i][1].x,
                // this.rays[i][1].y,     // now we will draw the line to the end
                end.x,
                end.y
            )
            // ctx.rotate(this.car); meanining less
            ctx.stroke();

            //drawing the line from the very end i.e. rays[i][1] to the end point if they are same then nothing matters 

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black"; //changed color to black

            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y,
            )
            ctx.lineTo(
                // this.rays[i][1].x,
                // this.rays[i][1].y,     // now we will draw the line to the end
                end.x,
                end.y
            )
            // ctx.rotate(this.car); meanining less
            ctx.stroke();
        }
    }
}