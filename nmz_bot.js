// Importing necessary libraries and modules
const robot = require("robotjs");
const fsp = require('fs').promises; // Using promise-based FS module
const delay = require('delay');
const random = require('random');

// GLOBAL START VARIABLES
let run = true;
const NUMBER_OF_OVERLOADS = 11; // Number of Overloads in the first inventory slots

// Delays for various actions
const MIN_PRAYER_TIME = 33456;
const MAX_PRAYER_TIME = 51145;
const MIN_OVERLOAD_TIME = 304675;
const MAX_OVERLOAD_TIME = 306654;
const MIN_ABSORPTION_TIME = 203000;
const MAX_ABSORPTION_TIME = 232021;

// SETUP INVENTORY POTION LOCATIONS
var inventory = [];

async function loadInventory() {
    try {
        let rawdata = await fsp.readFile('nmz.json');
        inventory = JSON.parse(rawdata);
        console.log("--- Inventory Loaded ---");
    } catch (err) {
        console.error("Failed to load inventory:", err);
    }
}

async function saveInventory() {
    try {
        await fsp.writeFile('nmz.json', JSON.stringify(inventory));
        console.log("--- Inventory Saved ---");
    } catch (err) {
        console.error("Failed to save inventory:", err);
    }
}

// Function to handle moving and clicking mouse at specified coordinates
function moveAndClick(x, y) {
    console.log("Moving mouse to:", x, y);
    robot.moveMouse(x, y);
    console.log("Clicking mouse");
    robot.mouseClick();
};

// Helper functions to simulate in-game actions
async function clickPrayer() {
    console.log("--- Started Prayer Loop ---");
    clickOverload(); // Run the async overload process
    while (run) {
        moveAndClick(inventory[inventory.length - 1].x, inventory[inventory.length - 1].y);
        await delay(random.int(511, 678));
        moveAndClick(inventory[inventory.length - 1].x, inventory[inventory.length - 1].y);
        let randomTime = random.int(MIN_PRAYER_TIME, MAX_PRAYER_TIME);
        console.log(`--- ${randomTime / 1000} seconds left before new Rapid Heal click! ---`);
        await delay(randomTime);
    }
}

async function clickAbsorption() {
    await delay(1500);
    console.log("--- Started Absorption Loop ---");
    for (let i = 0; i < 4; i++) {
        moveAndClick(inventory[NUMBER_OF_OVERLOADS].x, inventory[NUMBER_OF_OVERLOADS].y);
        await delay(1000);
    }
    let clickTimer = 0;
    let position = NUMBER_OF_OVERLOADS + 1;
    const max = 27;
    while (run) {
        moveAndClick(inventory[position].x, inventory[position].y);
        clickTimer++;
        console.log(`--- Clicked on Absorption Pot at position: ${position}, Click #${clickTimer} ---`);
        if (clickTimer === 4) {
            position++;
            clickTimer = 0;
        }
        if (position === max) {
            console.log("--- Done with script ---");
            run = false;
        }
        let randomTime = random.int(MIN_ABSORPTION_TIME, MAX_ABSORPTION_TIME);
        console.log(`--- ${randomTime / 1000} seconds left before new Absorption click! ---`);
        await delay(randomTime);
    }
}

async function clickOverload() {
    await delay(1500);
    clickAbsorption();
    console.log("--- Started Overload Loop ---");
    let clickTimer = 0;
    let position = 0;
    const max = NUMBER_OF_OVERLOADS;
    while (run) {
        moveAndClick(inventory[position].x, inventory[position].y);
        clickTimer++;
        if (clickTimer === 4) {
            position++;
            clickTimer = 0;
            console.log(`--- Position: ${position}, Timer Reset ---`);
        }
        if (position === max) {
            console.log("--- Done with script ---");
            run = false;
        }
        let randomTime = random.int(MIN_OVERLOAD_TIME, MAX_OVERLOAD_TIME);
        console.log(`--- ${randomTime / 1000} seconds left before new Overload click! ---`);
        await delay(randomTime);
    }
}

async function runCode() {
    clickPrayer();
}

runCode().then(() => console.log('Finished running script.'));
