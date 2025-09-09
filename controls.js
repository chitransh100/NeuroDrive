class Controls {
    constructor(contolTypes){

        this.forward = false;
        this.reverse = false;
        this.left = false;
        this.right = false;

        // Call the private method (#addKeyboardListeners)
        // This will attach the event listeners so the class
        if(contolTypes == "KEYS"){
            this.#addKeyboardListeners();
        }else{
            this.forward = true; // making this true only means that other cars will have the constant speed equal to the original car and we cant chase it;
        }
    }

    // Private method (#) - cannot be called outside the class.
    #addKeyboardListeners(){        //listen to keyboards

        // 'keydown' means a key is being pressed (held down).
        // We use an arrow function so that 'this' still refers to
        // our Controls object (and not the document).
        document.onkeydown = (event) => { 
            // event.key tells us which key was pressed
            switch(event.key){
                case "ArrowUp" :     // ⬆️ pressed
                    this.forward = true;
                    break;
                case "ArrowDown" :   // ⬇️ pressed
                    this.reverse = true;
                    break;
                case "ArrowLeft" :   // ⬅️ pressed
                    this.left = true;
                    break;
                case "ArrowRight" :  // ➡️ pressed
                    this.right = true;
                    break;
            }
            
        };

        // (Alternative approach)
        // We could also assign a normal function:
        // document.onkeydown = function (event) { ... }
        // But then 'this' would refer to 'document' instead of 'Controls',
        // which usually isn't what we want in this case.

        // 'keyup' means a key was released (stopped being pressed).
        document.onkeyup = (event) => {
            switch(event.key){
                case "ArrowUp" :
                    this.forward = false;
                    break;
                case "ArrowDown" :
                    this.reverse = false;
                    break;
                case "ArrowLeft" :
                    this.left = false;
                    break;
                case "ArrowRight" : 
                    this.right = false;
                    break;
            }
        };

    }
}
