// Defining Width and Height of Canvas
var circle_canvas_width = 1000;
var circle_canvas_height = 200;

var speed_canvas_width = 400;
var speed_canvas_height = 200;

// Defining positions of both circles
var circleX_1 = 500;
var circleX_2 = 500;

var play = false; // When true animation should continue
var animateID;
var reset_bool = false;


// Defining speed of circles
var speed = 0;

// Setting up Canvas and Context
function init() {
    circleCanvas = document.getElementById("circlecanvas");
    circleContext =  circleCanvas.getContext('2d');

    speedCanvas = document.getElementById("speedcanvas");
    speedContext = speedCanvas.getContext('2d');
 
    draw('#E1FF00','#E1FF00');
}

// Defining a function to pause and play animation
function togglePlay(button) {
    if(play){
        button.innerHTML = "Play";
        window.clearInterval(animateID);
        play = !play;
    }
    else {
        document.getElementById("reset").removeAttribute("disabled");

        button.innerHTML = "Pause";
        calcDoppler();
        animateID = window.setInterval(animate, 80);
        play = !play;
    }
}

// Function for calculating the frequency doppler effect at relatevistic speeds
function calcDoppler() {
  speed += 1; 
  beta = speed/100; // Assuming the speed is a precentage of the speed of light, the speed of light will cancel and leave beta = precentage 
  if (beta < 1) {
    // Towards us the velocity will be positive
    var recipWavelengthToward  = (1/580) * Math.sqrt((1-beta)/(1+beta));

    // Away from us the velocity will be negative
    var recipWavelengthAway = (1/580) * Math.sqrt((1-(-1*beta))/(1+(-1*beta)));
    
    // Return the recipracole of the answers to use to get the RGB values and Hexadecimal values
    return [1/recipWavelengthToward, 1/recipWavelengthAway];
  }
  else {
    reset();
  }
}

function nmToRGB(wavelength){
  // console.log(wavelength);
  var Gamma = 0.80,
  IntensityMax = 255,
  factor, red, green, blue;
  if((wavelength >= 380) && (wavelength<440)){
    red = -(wavelength - 440) / (440 - 380);
    green = 0.0;
    blue = 1.0;
  }else if((wavelength >= 440) && (wavelength<490)){
    red = 0.0;
    green = (wavelength - 440) / (490 - 440);
    blue = 1.0;
  }else if((wavelength >= 490) && (wavelength<510)){
    red = 0.0;
    green = 1.0;
    blue = -(wavelength - 510) / (510 - 490);
  }else if((wavelength >= 510) && (wavelength<580)){
    red = (wavelength - 510) / (580 - 510);
    green = 1.0;
    blue = 0.0;
  }else if((wavelength >= 580) && (wavelength<645)){
    red = 1.0;
    green = -(wavelength - 645) / (645 - 580);
    blue = 0.0;
  }else if((wavelength >= 645) && (wavelength<781)){
    red = 1.0;
    green = 0.0;
    blue = 0.0;
  }else{
    red = 0.0;
    green = 0.0;
    blue = 0.0;
  };

  // Let the intensity fall off near the vision limits
  if((wavelength >= 380) && (wavelength<420)){
    factor = 0.3 + 0.7*(wavelength - 380) / (420 - 380);
  }else if((wavelength >= 420) && (wavelength<701)){
    factor = 1.0;
  }else if((wavelength >= 701) && (wavelength<781)){
    factor = 0.3 + 0.7*(780 - wavelength) / (780 - 700);
  }else{
    factor = 0.0;
  };
  if (red !== 0){
    red = Math.round(IntensityMax * Math.pow(red * factor, Gamma));
  }
  if (green !== 0){
    green = Math.round(IntensityMax * Math.pow(green * factor, Gamma));
  }
  if (blue !== 0){
    blue = Math.round(IntensityMax * Math.pow(blue * factor, Gamma));
  }
  //console.log(red,green,blue);
  return [red,green,blue];
}

// Rgb to Hex
function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

//Force values to be recalculated and displayed
function update(){
	draw('#E1FF00','#E1FF00');
}

// Function if reset button is clicked, to reset animation
function reset() {
  window.clearInterval(animateID); // clears the animation
  document.getElementById("pause").innerHTML = "Play";
  play = false;

  // Default x-values
  circleX_1 = 500;
  circleX_2 = 500;
  speed = 0; 
  reset_bool = true;

  update(); // forces values to be resetted.

  document.getElementById("reset").setAttribute("disabled", "disabled"); // lets you click reset to enable reset
}
// Defining a function to update the RGB values
function animate() {
    var wavelength = calcDoppler();
    var towardDoppler = wavelength[0];
    var awayDoppler = wavelength[1];

    var towardRGB = nmToRGB(towardDoppler);
    var awayRGB = nmToRGB(awayDoppler);
    
    var toward_red = towardRGB[0];
    var toward_green = towardRGB[1];
    var toward_blue = towardRGB[2];

    var away_red = awayRGB[0];
    var away_green = awayRGB[1];
    var away_blue = awayRGB[2];

    towardHex = rgbToHex(toward_red, toward_green, toward_blue);
    awayHex = rgbToHex(away_red, away_green, away_blue);
    draw(towardHex, awayHex);
}

// Draw circles, and box for info on speed
function draw(tH, aH) {
    // Reset Canvas
    circleContext.clearRect(0,0,circle_canvas_width,circle_canvas_height);
    speedContext.clearRect(0,0,speed_canvas_width,speed_canvas_width);

    circleContext.fillStyle = 'rgb(200, 200, 200)';
	circleContext.fillRect(0, 0, circle_canvas_width, circle_canvas_width);
	
	speedContext.fillStyle = 'rgb(200, 200, 200)';
	speedContext.fillRect(0, 0, speed_canvas_width, speed_canvas_height);

    //Set up fonts
	circleContext.font = '10px sans-serif';
	circleContext.textBaseline = 'top';
	
	speedContext.font = "20px sans-serif";
	speedContext.textAlign = 'center';
	speedContext.textBaseline = 'middle';
    
    // Draw Circles
    circleContext.fillStyle = tH;
    circleContext.beginPath();
    circleContext.arc(300, 100, 95, 0, Math.PI * 2);
    circleContext.closePath();
    circleContext.fill();

    circleContext.fillStyle = aH;
    circleContext.beginPath();
    circleContext.arc(700, 100, 95, 0, Math.PI * 2);
    circleContext.closePath();
    circleContext.fill();

    speedContext.fillStyle = 'rgb(240, 240, 240)';
	speedContext.strokeStyle = 'rgb(200, 0, 0)';

    //Draw boxes
    speedContext.fillRect(200-50, 50-25, 100, 50);
    speedContext.lineWidth = 4;
    speedContext.strokeRect(200-50, 50-25, 100, 50);
    speedContext.lineWidth = 1;
    
    //Draw text
    origfill = speedContext.fillStyle;
    speedContext.fillStyle = 'rgb(0, 0, 0)';
    speedContext.fillText(speed, 200, 50)
    speedContext.fillStyle = origfill;
}