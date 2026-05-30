/**
 * @author https://github.com/timmmGZ
 * This project is an Synthesizer who has 60 keys (but not piano who has 88 keys)
 * Instruction is written in GUI, run the program to read it
 */
var keyboard = [];
//black keys
var flats = [1, 3, 6, 8, 10]
var firstKey = 36;
var centerC = 60;
var lastKey = 96;
//number of bars that will be showed on GUI
var numBar = 3;
var keyboardX = 0;
var keyboardY = 200;
//hot-keys to play the keyboard
keyNames = "Q 2 W 3 E R 5 T 6 Y 7 U C F V G B N J M K , L . /".split(" ")
//keyCodes of the hot-keys
keyCodes = [81, 50, 87, 51, 69, 82, 53, 84, 54, 89, 55, 85, 67, 70, 86, 71, 66, 78, 74, 77, 75, 188, 76, 190, 191];
//array to put keys that are being pressed
var pressing = [];
//sound effect(reverb) of each key
var reverb = 1;
//slider for reverb
var sliderR;
var volume = 0.5;
//slider for volume
var sliderV;

function setup() {
    canvas = createCanvas(windowWidth - 10, 530)
    numBar = int(prompt("Enter the number of bars you want for the keyboard"));
    while (![1, 2, 3].includes(numBar)) {
        numBar = int(prompt("Please enter 1,2 or 3."));
    }
    background("rgba(255,255,255,0)");
    buildKeyboard(keyboardX, keyboardY);
    sliderR = createSlider(10, 300, 100);
    sliderR.input(updateReverberation);
    sliderV = createSlider(0, 100, 50);
    sliderV.input(updateVolume);
    text("      Reverberation                  Volume", 0, sliderR.position().y - 15)
    textSize(23);
}

function updateReverberation() {
    reverb = sliderR.value() / 100;
}

function updateVolume() {
    volume = sliderV.value() / 100;
}


//build and draw the keyboard mini map that will be shown on top side
function buildDrawKeyboardMiniMap() {
    for (let i = 0, j = 0; i < 61; i++) {
        //current index of key is flat key
        if (flats.includes(i % 12)) {
            fill("white");
            rect(j * 20.4, 0, 20.4, 150);
            j++;
            fill("black")
            rect(i * 11.9, 0, 11.9, 100);
        } else if (!flats.includes((i - 1) % 12)) {
            fill("white");
            rect(j * 20.4, 0, 20.4, 150);
            j++;
        }
    }
}

//build the keyboard backend
function buildKeyboard(x, y) {
    for (let i = 0, j = 0; i < 12 * numBar + 1; i++) {
        //current index of key is flat key
        if (flats.includes(i % 12)) {
            keyboard.push(new Rectangle(x + j * 51, y + 0, 51, 300, false, centerC + i + 1, keyCodes[i + 1]));
            j++;
            keyboard.push(new Rectangle(x + i * 30, y + 0, 30, 200, true, centerC + i, keyCodes[i]));
            if (i - 1 >= 0) {
                if (i % 12 == 1 || i % 12 == 6) {
                    keyboard[i - 1].addSibilingFlat(keyboard[i + 1]);
                } else {
                    keyboard[i - 2].addSibilingFlat(keyboard[i + 1]);
                }
            }
            keyboard[i].addSibilingFlat(keyboard[i + 1]);
            //current index of key is not flat key, nor its previous key.
        } else if (!flats.includes((i - 1) % 12)) {
            keyboard.push(new Rectangle(x + j * 51, y + 0, 51, 300, false, centerC + i, keyCodes[i]));
            j++;
        }
    }
}

//draw the keyboard that will be shown on down side after its backend is established
function drawKeyboard() {
    for (key of keyboard) {
        if (key.isAbove()) {
            key.changeColor();
            if (key.isClicked() && volume > 0) {
                key.play();
            }
        } else {
            key.draw()
        }
        if (key.isPressed()) {
            key.changeColor();
            if (volume > 0) {
                key.play();
            }
        }
        key.checkRelease();
        key.checkUnpressed();
    }
}

//shown the hot-keys on each key of the keyboard
function drawHotKeyNames(x, y) {
    fill(255, 0, 0)
    for (let i = 0, j = 0; i < 12 * numBar + 1; i++) {
        if (flats.includes(i % 12)) {
            text(keyNames[i + 1], x + j * 51 + 18, y + 270)
            j++;
            text(keyNames[i], x + i * 30 + 9, y + 150)
        } else if (!flats.includes((i - 1) % 12)) {
            text(keyNames[i], x + j * 51 + 18, y + 270)
            j++;
        }
    }
}

//draw a red frame indicating the location of the current keyboard on the minimap
function drawCurrentKeyboardLocationFrame(x) {
    push()
    strokeWeight(5)
    stroke(255, 0, 0)
    fill(255, 255, 255, 0)
    rect(int((x - firstKey) / 12) * 7 * 20.4, 0, 20.4 * (7 * numBar + 1) - 2, 148)
    pop()
}

function draw() {
    buildDrawKeyboardMiniMap();
    drawCurrentKeyboardLocationFrame(centerC);
    fill(0)
    text("Press \"←\"or\"→\" to adjust keyboard position", keyboardX, keyboardY - 20)
    drawKeyboard();
    drawHotKeyNames(keyboardX, keyboardY);
}

/*
detect and put the "key"s to the pressing array for playing them
bind left arrow and right arrow keys to adjusting keyboard location
*/
function keyPressed() {
    if (keyCodes.includes(keyCode) && !pressing.includes(keyCode)) {
        pressing.push(this.keyCode);
    }
    if (keyCode == 37 && keyboard[0].midiValue > firstKey) {
        centerC -= 12;
        for (key of keyboard) {
            key.downOctave()
        }
    } else if (keyCode == 39 && keyboard[keyboard.length - 1].midiValue < lastKey) {
        centerC += 12;
        for (key of keyboard) {
            key.upOctave()
        }
    }
}

//detect and remove the "key"s from the pressing array
function keyReleased() {
    for (let i = 0; i < pressing.length; i++) {
        if (keyCode == pressing[i]) {
            pressing.splice(i, 1)
            return;
        }
    }

}