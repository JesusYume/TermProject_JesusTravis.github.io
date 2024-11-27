// Setting up the Canvas as the size of Window
const canvas = document.getElementById('canvas1');
const context = canvas.getContext('2d');
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;

// Gettung the Sprite Sheet 
const sprite = {};
sprite.character = new Image();
sprite.character.src = 'Sprites/Jesus_Sprite.png';

// Setting Up values of height and width
const spriteWidth = 2048;
const spriteHeight = 2048;

const spriteNewWidth = 250;
const spriteNewHeight = 250;

// This will allow us to move to next frame
let frameX = 0;
let frameY = 2;

// This will deal with the speed of the frame
let gameFrame = 0;
const staggerFrame = 4;
let spriteSpeed = 10;

// 0,0 starts at the top left
let spritePositionX = 0;
let spritePositoinY = 0;

// Spring
////////////////////////////////////////////////////////////////////////////////
// Gettung the spring Sheet 
const spring = {};
spring.character = new Image();
spring.character.src = 'Sprites/Travis_Sprite.png';

// Setting Up values of height and width
const springWidth = 60;
const springHeight = 155;

// These are the frames for the motion animation
// 0,0: Left
// 0,1: Right
// 0,2: Forward
let springframeX = 0;
let springframeY = 0;

// This will deal with the speed of the frame
let springgameFrame = 0;
const springstaggerFrame = 9;
let springSpeed = 7;

// Sprigtrap starts from the top right, so width,0
let springPositionX = width;
let springPositionY = 0;
////////////////////////////////////////////////////////////////////////////////

// Animate frames of sprite
function handlePlayerFrame(){
  // 3 in this case is the column of the last frame of the animation
  if (gameFrame % staggerFrame == 0){
    if(frameX < 3) frameX++;
    else frameX = 0;
  }
  // Spring
  ////////////////////////////////////////////////
  if (springgameFrame % springstaggerFrame == 0){
    if(springframeX < 1) springframeX++;
    else springframeX = 0;
  }
  /////////////////////////////////////////////////
  gameFrame++;
  springgameFrame++;
  }

// Code to control the animation framerate regardless of machine being used
let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
  fpsInterval = 1000/fps;
  then = Date.now();
  startTime = then;
  animate();
}


// Resources:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
// Hippo image showing the arguments for drawImage

// Function that will animate sprite character
 function animate() {
  // Tells the browser you wish to perform an animation. It requests the browser to call a user-supplied callback function before the next repaint
  requestAnimationFrame(animate);
  now = Date.now();
  elapsed = now - then;

  if (elapsed > fpsInterval){
    then = now - (elapsed % fpsInterval);

    // Clear the canvas so the images do not pile up on the canvas
    context.clearRect(0,0,width,height);

    // Draws the png image onto the canvas and specifies the dimensions
    context.drawImage(sprite.character, (frameX * spriteWidth), (frameY * spriteHeight), spriteWidth, spriteHeight, spritePositionX, spritePositoinY, spriteNewWidth, spriteNewWidth);

    // Spring
    ////////////////////////////////////////////////////////////////////////////
    // Draws the png image onto the canvas and specifies the dimensions
    context.drawImage(spring.character, (springframeX * springWidth), (springframeY * springHeight), springWidth, springHeight, springPositionX, springPositionY, springWidth, springHeight);
    ////////////////////////////////////////////////////////////////////////////

    // Moving function
    // Animate movement. I must update to do more turns and stops
    right();

    // Spring
    ////////////////////////////////////////////////////////////////////////////
    springleft();
    ////////////////////////////////////////////////////////////////////////////

    // Frame handling function
    handlePlayerFrame();
  }
};

window.addEventListener('resize', function(){
  height = canvas.height = window.innerHeight;
  width = canvas.width = window.width;
})

function springleft() {
  if(springPositionX > (width/2)+springWidth) springPositionX -= springSpeed;
  else if (springPositionY < height - springHeight) {
    springframeY = 2;
    springPositionY += springSpeed;
  } 
};

function forward() {
  if(spritePositoinY < height) spritePositoinY += 5;
  else spritePositoinY = 0 - 500;
};

function left() {
  if(spritePositionX > 0 - 500) spritePositionX -= 5;
  else spritePositionX = 600 + 500;
};

function start_out_left() {
  if(spritePositionX != 0 ) spritePositionX -= 5;
}

function right() {
  if(spritePositionX < (width/2) - spriteNewWidth) spritePositionX += spriteSpeed;
  else if(spritePositoinY < height - 160) {
    frameY = 0;
    spritePositoinY += spriteSpeed;
  }
  else if (spritePositoinY == height -159) frameY = 3;
  // else spritePositionX = 0 - 100;
}

startAnimating(30);