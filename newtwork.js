//intputs are the reading of the sensors 
//outputs are the reading of teh controls 
//A neuron “fires” when its weighted inputs plus bias, after passing through the activation function, produce a strong enough output to actively influence the next layer.
class Level{
    // A Level represents a fully connected layer of neurons:
    // One "input layer" (inputs)
    // One "output layer" (outputs)
    // Every input neuron connects to every output neuron with a weight
    // Each output neuron also has its own bias
    constructor(inputCount, outputCount){
        //we define each layer of neurons as an array of elements 
        this.inputs = new Array(inputCount); //input layer
        this.outputs = new Array(outputCount); //output neurons

        //Bias is like a neuron’s built-in nudge or default power that lets it fire even when all inputs are zero, giving the network flexibility to shift outputs and learn patterns more effectively.
        this.biases = new Array(outputCount); //each output neuron has a bias 
        

        //now each neurons in the lower layer is connected to each other neuron in the upper layer (densly conneced);
        // Weights represent the strength of the connection from each input to each output
        // Structure: weights[inputIndex][outputIndex]
        this.weights = []; //empty array of weights so that there is no weight initially 

        for(let i =0; i< inputCount; i++){ //traverse each and every node in the input layer
            this.weights[i] = new Array(outputCount) // Initialize a 2D array for weights
            // For every input neuron, create an array of weights connecting it to each output neuron
        }

        // a static function is called like this ClassName.method()
        //this is like passing the particular instance of the class 
        Level.#randomize(this);  //starting with a random brain first
        //we have to make this static because if we had made this to initialise the weights with normal funciton 
        //then we have to create a new function for randomizing beacuse we can access teh constructor after we initialise a object 
        //now with this static function we can access it anytime (if we have to randomize any layer in then we call this funciton ) , stops code duplication 

    }

    //#randomize is static → it belongs to the Level class, not a specific Level object.
    //Randomization logic is the same for all Level objects, so we don’t need a separate copy for each object.
    //We pass the instance (this) to the static method so it can modify that object’s weights and biases.
    static #randomize(level){ //level is the instance we passed from the 
        for(let i=0; i<level.inputs.length; i++){
            for(let j=0; j<level.outputs.length; j++){
                //treaversing through every connection between the neurons 
                level.weight[i][j] = Math.random()*2-1; //making the weights random at first for each connection 
                //we are having negative weights to determine which way not to go 
            }
        }
        for(let i=0; i<level.outputs.length; i++){
            //Negative biases are used in initialization so that neurons don’t all start “overly active.”
            // If all biases were positive, many neurons would fire strongly at the start, potentially saturating activation functions (especially sigmoid or tanh), which slows down learning.
            // Negative biases allow some neurons to start inactive or less active, giving the network flexibility to learn a wider range of patterns, including outputs that should be negative or zero.
            level.biases[i] = Math.random()*2-1;

        }
    }

    //givenInputs are the reading from the sensors
    static feedForward(givenInputs, level){ //feed forward method to generate outputs 
        for(let i=0; i<level.inputs.length; i++){
            //initialising the inputs neurons to value of the sensors 
            level.inputs[i] = givenInputs[i];
        }
        
        //calculating the outputs
        for(let i=0; i<level.outputs.length; i++){ //looping through each output
            let sum = 0;
            for(let j=0; j<level.outputs.length; j++){ //looping through each input 
                //setting the value of each output in the output layer 
                sum += level.weights[j][i] * level.inputs[j]; //j,i because we are mapping inputs(j) to output 
            }

            //a binary activation funciton 
            //this activation function introduces non linearity in the the prediction curve otherwise its a linear curve and we can go for other possibilities 
            //this is the hyperplane equation  == ws + b =0; w = slope and b = intercept 
            if(sum > level.biases[i]){
                level.outputs[i] = 1;
            }else{
                level.outputs[i] = 0;
            }
            // level.outputs[i] = sum;
        }

        return level.outputs

    }
    
}

