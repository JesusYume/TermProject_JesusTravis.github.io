// Setting up the Canvas as the size of Window
// const canvas = document.getElementById('canvas1');
// const context = canvas.getContext('2d');
// width = canvas.width = window.innerWidth;
// height = canvas.height = window.innerHeight;

// // Gettung the spring Sheet 
// const spring = {};
// spring.character = new Image();
// spring.character.src = 'Sprites/Travis_Sprite.png';

// // Setting Up values of height and width
// const springWidth = 60;
// const springHeight = 155;

// // These are the frames for the motion animation
// // 0,0: Left
// // 0,1: Right
// // 0,2: Forward
// let springframeX = 0;
// let springframeY = 0;

// // This will deal with the speed of the frame
// let springgameFrame = 0;
// const springstaggerFrame = 9;
// let springSpeed = 10;

// // Sprigtrap starts from the top right, so width,0
// let springPositionX = width;
// let springPositoinY = 0;

// // Animate frames of spring
// function springhandlePlayerFrame(){
//   // 3 in this case is the column of the last frame of the animation
//   if (springgameFrame % springstaggerFrame == 0){
//     if(springframeX < 1) springframeX++;
//     else springframeX = 0;
//   }
//   springgameFrame++;
// }

// // Code to control the animation framerate regardless of machine being used
// let springfps, springfpsInterval, springstartTime, springnow, springthen, springelapsed;

// function springstartAnimating(fps) {
//   springfpsInterval = 1000/fps;
//   springthen = Date.now();
//   springstartTime = springthen;
//   springanimate();
// }

// Function that will animate spring character
// function springanimate() {
//   // Tells the browser you wish to perform an animation. It requests the browser to call a user-supplied callback function before the next repaint
//   requestAnimationFrame(springanimate);
//   springnow = Date.now();
//   springelapsed = springnow - springthen;

//   if (springelapsed > springfpsInterval){
//     springthen = springnow - (springelapsed % springfpsInterval);

//     // Clear the canvas so the images do not pile up on the canvas
//     context.clearRect(0,0,width,height);

//     // Draws the png image onto the canvas and specifies the dimensions
//     context.drawImage(spring.character, (springframeX * springWidth), (springframeY * springHeight), springWidth, springHeight, springPositionX, springPositoinY, springWidth, springHeight);

//     // Moving function
//     // Animate movement. I must update to do more turns and stops
//     springleft();

//     // Frame handling function
//     springhandlePlayerFrame();
//   }
// };

// window.addEventListener('resize', function(){
//   height = canvas.height = window.innerHeight;
//   width = canvas.width = window.width;
// })

// function springleft() {
//   if(springPositionX > (width/2)+springWidth) springPositionX -= springSpeed;
// };

// springstartAnimating(30);