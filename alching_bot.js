const robot = require("robotjs");
const fs = require('fs');
const readline = require('readline');
const delay = require('delay');
const random = require('random')
const ioHook = require('iohook');

//GLOBAL START VARIABLES
let pause = false;
let run = true;

// NUMBER OF ALCHS
const NUMBER_OF_ALCHS = 1000;

//RANDOM DELAY
//DELAY BETWEEN CLICKS
const MIN_TIME = 1300; // In ms
const MAX_TIME = 1370;

// START KEY LISTENER
ioHook.start();

// GET MOUSE LOCATION FOR ALCHS FROM JSON FILE
var inventory = [];
let rawdata = fs.readFileSync('alchlocation.json');  
inventory = JSON.parse(rawdata);  

// ALCH CLICK EVENT
function moveAndClick(x,y){
    robot.moveMouse(x,y)
    console.log("    CLICKING MOUSE AT: "+ x,y)
    robot.mouseClick()
};

ioHook.on("keyup", event => {

  // EXIT PROGRAMME WITH CTRL + C
  if (event.ctrlKey && event.keycode === 46) {
    console.log("--- EXITING THE PROGRAMME ---")
    process.exit();

  // CHANGE COORDINATE OF CLICK LOCATION WITH CTRL + G
  } else if (event.ctrlKey && event.keycode === 34){
    var mouse = robot.getMousePos();
    inventory = [];
    inventory.push(mouse)
    console.log("--- SAVED: " + mouse.x, mouse.y + " AS THE NEW COORDINATE ---")
  }

  // SAVE THE NEW COORDINATE TO THE JSON FILE WITH CTRL + S
  else if (event.ctrlKey && event.keycode === 31){
    console.log("--- SAVED NEW COORDINATE TO THE JSON FILE ---")
    fs.writeFileSync('alchlocation.json', JSON.stringify(inventory));
  }

  // LOAD INVENTORY ALCH COORDINATE WITH CTRL + R
  else if (event.ctrlKey && event.keycode === 19){
    let rawdata = fs.readFileSync('alchlocation.json');  
    inventory = JSON.parse(rawdata);  
    console.log("--- NEW COORDINATE LOADED INTO PROGRAMME FROM JSON FILE ---");
  }
 
  // START THE PROGRAMME WITH CTRL + B
  else if (event.ctrlKey && event.keycode === 48){
    console.log("--- STARTED THE PROGRAMME ---")
    alch();
  }

 //PAUSE AND RESUME THE PROGRAMME WITH CTRL + P
  else if (event.ctrlKey && event.keycode === 25){
    if(run){
      run = false;
      console.log("--- PAUSED THE PROGRAMME ---")
    }
    else{
      run = true;
      console.log("--- RESUMED THE PROGRAMME ---")
    }
    alch();
  }
});
console.log('// EXIT PROGRAMME WITH CTRL + C\n// ADD COORDINATE WITH CTRL + G \n// RESET INVENTORY WITH ALT + G \n// SAVE INVENTORY TO THE JSON FILE WITH CTRL + S\n// LOAD INVENTORY COORDINATES FROM JSON FILE WITH CTRL + R\n// START THE PROGRAMME WITH CTRL + B\n// PAUSE AND RESUME THE PROGRAMME WITH CTRL + P\n');

async function alch(){
  let click = 0;
  let max = NUMBER_OF_ALCHS * 2;
  while(run){
    await delay(random.int(MIN_TIME, MAX_TIME));
    moveAndClick(inventory[0].x,inventory[0].y)
    click++;
    console.log("--- ALCHS LEFT: " + Math.floor((max-click)/2)+ " ---")
    if(click == max){
      console.log("--- DONE WITH ALCHING ---")
      run = false
    }
  }
}

