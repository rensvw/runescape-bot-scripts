// Get pixel color under the mouse.
const robot = require("robotjs");
const fs = require('fs');
const readline = require('readline');
const delay = require('delay');
const random = require('random')
const ioHook = require('iohook');

// START KEY LISTENER
ioHook.start();

// GLOBAL START VARIABLES
let pause = false;
let run = true;

/////////////////////////////////////////////////////////////////////////////////////////////////////
/// IMPORTANT GLOBAL VARIABLES
/// FIRST XX SPOTS NEED TO BE FILLED WITH OVERLOADS
/// REST WITH ABSORPTION POTIONS AND THE LAST INVENTORY SPOT WITH THE DWARVEN ROCK CAKE

// HOW MANY OVERLOADS IN THE FIRST X INVENTORY SLOTS?
const NUMBER_OF_OVERLOADS = 13;

// DELAY BETWEEN CLICKS FOR PRAYER RESET
const MIN_PRAYER_TIME = 33456;
const MAX_PRAYER_TIME = 51145;

// DELAY BETWEEN CLICKS FOR OVERLOAD POTION
const MIN_OVERLOAD_TIME = 304675;
const MAX_OVERLOAD_TIME = 306654;

// DELAY BETWEEN CLICKS FOR ABSORPTION POTION 
const MIN_ABSORPTION_TIME = 340123;
const MAX_ABSORPTION_TIME = 365345;

//////////////////////////////////////////////////////////////////////////////////////////////////////

// SETUP INVENTORY POTION LOCATIONS

var inventory = [];
let rawdata = fs.readFileSync('nmz.json');  
inventory = JSON.parse(rawdata);  

//MOVE AND CLICK LOGIC
function moveAndClick(x,y){
    console.log("    MOVING MOUSE TO: "+ x,y)
    robot.moveMouse(x,y)
    console.log("    CLICKING MOUSE")
    robot.mouseClick()
};

ioHook.on("keyup", event => {

    //EXIT PROGRAMME WITH CTRL + C
    if (event.ctrlKey && event.keycode === 46) {
      console.log("--- EXITING THE PROGRAMME ---")
      process.exit();
  
    // ADD COORDINATE WITH CTRL + G
    } else if (event.ctrlKey && event.keycode === 34){
      var mouse = robot.getMousePos();
      inventory.push(mouse)
      let length = inventory.length
      console.log("--- SAVED: " + mouse.x, mouse.y + " AS A NEW COORDINATE ON INVENTORY LOCATION: " + length + " ---")

    // RESET INVENTORY WITH ALT + G
    } else if (event.altKey && event.keycode === 34){
      inventory = []
      console.log("--- INVENTORY IS RESET ---")
    }

    // SAVE INVENTORY TO THE JSON FILE WITH CTRL + S
    else if (event.ctrlKey && event.keycode === 31){
    console.log("--- SAVED NEW COORDINATES TO THE JSON FILE ---")
    fs.writeFileSync('nmz.json', JSON.stringify(inventory));
    }

    // LOAD INVENTORY COORDINATES WITH CTRL + R
    else if (event.ctrlKey && event.keycode === 19){
    let rawdata = fs.readFileSync('nmz.json');  
    inventory = JSON.parse(rawdata);  
    console.log("--- NEW COORDINATES LOADED INTO PROGRAMME FROM JSON FILE ---");
  }
  // START THE PROGRAMME WITH CTRL + B
  else if (event.ctrlKey && event.keycode === 48){
    console.log("--- STARTED THE PROGRAMME ---\n")
      runCode();
  }

});

console.log('// EXIT PROGRAMME WITH CTRL + C\n// ADD COORDINATE WITH CTRL + G \n// RESET INVENTORY WITH ALT + G \n// SAVE INVENTORY TO THE JSON FILE WITH CTRL + S\n// LOAD INVENTORY COORDINATES FROM JSON FILE WITH CTRL + R\n// START THE PROGRAMME WITH CTRL + B\n');

// CLICK AT LEAST ONCE EVERY MINUTE ON RAPID HEAL PRAYER
async function clickPrayer(){
    console.log("--- STARTED PRAYER LOOP ---\n")
    clickOverload(); // RUN THE ASYNC OVERLOAD PROCESS
        while(run){

            // CLICKED ON AND OFF AT THE QUICK PRAYER ICON
            moveAndClick(inventory[inventory.length-1].x,inventory[inventory.length-1].y)
            await delay(random.int(511, 678));
            moveAndClick(inventory[inventory.length-1].x,inventory[inventory.length-1].y)
            console.log("    CLICKED RAPID HEAL \n")

            // WAIT X SECONDS TO CLICK AGAIN
            let randomTime = random.int(MIN_PRAYER_TIME, MAX_PRAYER_TIME);
            console.log("    " +randomTime/1000 + " SECONDS LEFT BEFORE NEW RAPID HEAL CLICK! \n")
            await delay(randomTime);
            
        }
}

async function clickAbsorption(){
    await delay(1500)
    console.log("--- STARTED ABSORPTION LOOP ---\n")
    let clickTimer = 0;
    let position = NUMBER_OF_OVERLOADS;
    let max = 27;
    while(run){
        moveAndClick(inventory[position].x,inventory[position].y)
        clickTimer++;
        console.log("    CLICKED ON ABSORPTION POT")
        console.log("    POSITION: " + position)
        console.log("    CLICKNR: " + clickTimer +"\n")
        if(clickTimer == 4){
            position++;
            clickTimer=0;
        }
        if(position == max){
            console.log("--- DONE WITH SCRIPT ---")
            run = false
        }
        let randomTime = random.int(MIN_ABSORPTION_TIME, MAX_ABSORPTION_TIME);
        console.log("    " +randomTime/1000 + " SECONDS LEFT BEFORE NEW ABSORPTION CLICK!\n")

        await delay(randomTime);
    }
    
}

async function clickOverload(){
    await delay(1500)
    clickAbsorption()
    console.log("--- STARTED OVERLOAD LOOP --- \n")
    let clickTimer = 0;
    let position = 0;
    let max = 12;
    while(run){
        moveAndClick(inventory[position].x,inventory[position].y)
        clickTimer++;
        console.log("    CLICKED ABSORPTION POT")
        if(clickTimer == 4){
            position++;
            clickTimer=0;
            console.log(position)
            console.log(clickTimer)
        }
        if(position == max){
            console.log("--- DONE WITH SCRIPT --- \n")
            run = false
        }
        let randomTime = random.int(MIN_OVERLOAD_TIME, MAX_OVERLOAD_TIME);
        console.log("    " + randomTime/1000 + " SECONDS LEFT BEFORE NEW OVERLOAD click!\n")
        await delay(randomTime);
    }
    
}

async function runCode(){
    clickPrayer();
}

