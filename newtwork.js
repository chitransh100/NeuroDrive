class NeuralNetwork {
    constructor(neuronCounts){ //constructor will get the number of neurons in each of the layer
        this.levels = []; //an array of levels in which we have objects of the level class
        for(let i=0; i<neuronCounts.length-1; i++){//On the last iteration, i = neuronCounts.length - 1, you’ll try to access neuronCounts[i+1] which is undefined.
            //when we define an array as this.level = [] then teh array is not initialised with some indexes and If you directly assign at an index that doesn’t exist yet, JavaScript fills the “gap” with undefined.
            this.levels.push(new Level(
                //for each neuron layer we define 2 layers with count of neurons as the one and the next one 
                neuronCounts[i],
                neuronCounts[i+1],
            ));
        }
    }

    //this static function gives me the output of the whole network 
    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(givenInputs, network.levels[0]); //the first output will be the feedforward of the given inputs 
        for(let i=1; i<network.levels.length; i++){ //looping through every level in the neural network other thatn the first one because we have the outputs form it 
            //the output from the first level/ layer is input of the other level/layer
            outputs = Level.feedForward(outputs, network.levels[i]);
            //after looping through each level/layer we will be getting the output from of the whole network
        }
        return outputs
    }
}


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
        this.inputs = new Array(inputCount); //input layer neurons
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
                level.weights[i][j] = Math.random()*2-1; //making the weights random at first for each connection 
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
            for(let j=0; j<level.inputs.length; j++){ //looping through each input 
                //setting the value of each output in the output layer 
                sum += level.weights[j][i] * level.inputs[j]; //j,i because we are mapping inputs(j) to output 
            }

            //a binary activation funciton so that we know which control to on and which to off 
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

