
p5.disableFriendlyErrors = true; // disables FES

let width = 500;
let height = 500;
let walls;
let character;

let maxrotation = 2;

let rotating = 0;
let acceleratingrotation = 0;

let decceleratingrotation = 0;

let walking = 0;
let strafing = 0;

let fov = 90;
let sliderFOV;

let detail = 50;
let sliderDetail;

let mouseLock = false;


function setup() {
    createCanvas(width, height * 2);
    walls = [];
    walls.push(new Wall(0, 0, 0, height, color(255)));
    walls.push(new Wall(0, 0, width, 0, color(255)));
    walls.push(new Wall(width, height, 0, height, color(255)));
    walls.push(new Wall(width, height, width, 0, color(255)));

    for (let wall = 0; wall < 5; wall++) {
        walls.push(new Wall(random(width), random(height), random(width), random(height), color(random(100) + 125, random(100) + 125, random(100) + 125)));
        console.log(walls[walls.length - 1]);
    }
    createP("FOV");
    sliderFOV = createSlider(1, 360, fov);

    sliderFOV.input(changeFOV);

    createP("Detail");
    sliderDetail = createSlider(10, width, detail);

    sliderDetail.input(changeDetail);

    createP("Light power");
    sliderLight = createSlider(1, 20, 10, .5);

    sliderLight.input(changeLight);


    character = new Character(10, 10, fov);
    frameRate(30);
}

function changeLight() {
    const light = sliderLight.value();
    character.lightPower = light;
}

function changeFOV() {
    const fov = sliderFOV.value();
    character.fov = fov;
    character.rays = character.calculateVision(detail);
}

function changeDetail() {
    detail = sliderDetail.value();
    character.rays = character.calculateVision(detail);
}

function draw() {
    if (mouseLock) {
        character.angle += movedX / 10;
    } else {
        strafing = 0;
        character.angle += (rotating)
    }
    character.move(walking, strafing);
    background(0);
    for (let wall of walls) {
        wall.show();
    }
    if (rotating > -maxrotation && rotating < maxrotation) {
        rotating += acceleratingrotation;
        character.rays = character.calculateVision(detail);
    }
    if (rotating > 0.25 || rotating < -0.25) {
        rotating += decceleratingrotation;
        character.rays = character.calculateVision(detail);
    } else if (acceleratingrotation == 0) {
        rotating = 0;
        character.rays = character.calculateVision(detail);
    };

    cursor




    character.show(detail, walls);
}

function keyTyped() {

    if (key === "w") {
        walking = 1;
    }
    if (key === "s") {
        walking = -1;
    }
}
function mouseDragged() {
    if (mouseX < width && mouseX > 0) {
        if (mouseY < height && mouseY > 0) {
            character.pos = createVector(mouseX, mouseY)
        }

    }
}
function mouseClicked() {
    if (mouseX < width && mouseX > 0) {
        if (mouseY < height && mouseY > 0) {
            character.pos = createVector(mouseX, mouseY);
        }
        else if (mouseY < height * 2 && mouseY > 0) {
            if (!mouseLock){
            requestPointerLock();
            mouseLock = true;}else{
                exitPointerLock();
                mouseLock=false;
            }
        }
    }

}

function keyPressed() {
    if (mouseLock) {
        if (key === "a") {
            strafing = -1;
        }
        if (key === "d") {
            strafing = 1;
        }
       
    }
    else {
        if (key === "a") {
            acceleratingrotation = -.1;
            decceleratingrotation = 0;
        }
        if (key === "d") {
            acceleratingrotation = .1;
            decceleratingrotation = 0;
        }
    }

}

function keyReleased() {

    if (key === "w") {
        walking = 0;
    }
    if (key === "s") {
        walking = 0;
    }
    if (mouseLock) {
        if (key === "a") {
            strafing = 0;
        }
        if (key === "d") {
            strafing = 0;
        }
    }
    else {


        if (key === "a") {

            acceleratingrotation = 0;
            decceleratingrotation = .2;
        }
        if (key === "d") {
            acceleratingrotation = 0;
            decceleratingrotation = -.2;
        }
    }

}