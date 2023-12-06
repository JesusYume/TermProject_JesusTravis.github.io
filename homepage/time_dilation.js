// Setting up variables to hold values of drawings
var shipcanvas, clockcanvas;
var ship_context, clock_context;

// Width and Height of Canvas's
var ship_canvas_width = 1000;
var ship_canvas_height = 200;

var clock_canvas_width = 400;
var clock_canvas_height = 200;

// Controlling Animation
var play = false; // When true animation should continue
var animateID;

// Now lets set some data for Jesus and Travis positions, length, and speed
var jesus_x = 500;
var travis_x = 500;

var jesus_len = 100;
var travis_len = 100;

var jesus_speed = 0;
var travis_speed = 0;

var reset_bool = false;
var lorentz = 0;
var proper_time = 0;
var frame = "jesus"; // Defualt reference frame

var jesus_time = [0,0,0]; // This will hold the time in ns
var travis_time = [0,0,0];

// Setting up Canvas and Context variables
function init() {
  shipcanvas = document.getElementById("shipcanvas");
  ship_context = shipcanvas.getContext('2d');

  clockcanvas = document.getElementById("clockcanvas");
  clock_context = clockcanvas.getContext('2d');

  draw();
}

//Check if data entered is within the appropriate bounds
function isInputValid(){
  // Checking Speed of Travis and Jesus Ships
	var js = Math.abs(parseFloat(document.getElementById("jesus_speed").value));
	var ts = Math.abs(parseFloat(document.getElementById("travis_speed").value));
  // Checking Length of Travis and Jesus Ships
	var jl = parseFloat(document.getElementById("jesus_len").value);
	var tl = parseFloat(document.getElementById("travis_len").value);
	
	if(js > 0.99 || ts > 0.99 || jl < 1 || tl < 1){
		alert("Speeds must be between -0.99 and 0.99, lengths must be greater than 1");
		return false;
	}
	return true;
}

// Enable Input
// For Example when user clicks Jesus as a reference frame, only travis's speed should be allowed to change.
function enableInput() {
  // Enable All
  document.getElementById("jesus_speed").removeAttribute("disabled");
  document.getElementById("travis_speed").removeAttribute("disabled");
  document.getElementById("jesus_len").removeAttribute("disabled");
  document.getElementById("travis_len").removeAttribute("disabled");
  // Disable the current frame
  document.getElementById(frame + "_speed").setAttribute("disabled", "disable");
}

// Diable all input boxes
function disableInput() {
  document.getElementById("jesus_speed").setAttribute("disabled","disabled");
  document.getElementById("travis_speed").setAttribute("disabled","disabled");
  document.getElementById("jesus_len").setAttribute("disabled","disabled");
  document.getElementById("travis_len").setAttribute("disabled","disabled");
}

// Defining a function to pause animation and un-pause or play animation
function togglePlay(button) {
  if(play){ //Currently playing, user wants to pause animation
		button.innerHTML = "Play";
		window.clearInterval(animateID);
		play = !play;
	} else { //Currently paused, user wants to play animation
		if(!isInputValid()) return;
		disableInput();
		document.getElementById("reset").removeAttribute("disabled");

		button.innerHTML = "Pause";
		calcLength();
		calcTime();
		animateID = window.setInterval(animate, 50);
		play = !play;
	}
}

// Function to deal if frame is changed
function changeFrame(radio) { // radio acts as the id
  // Grabbing IDS and anmes
  var selected_id = radio.id.slice(0, -2); // Slicing will give us the name 
  var not_selected_id = ""; // This will hold the not selected frame
  if (selected_id == "jesus")
  {
    not_selected_id = "travis";
  }
  else
  {
    not_selected_id = "jesus";
  }

  frame = selected_id; // Frame becomes what frame we want

  // Adding _speed to the name
  var selected_speed_id = selected_id + "_speed";
  var not_selected_speed_id = not_selected_id + "_speed";

  var selected_name = String.fromCharCode(selected_id.charCodeAt(0) - 32) + selected_id.substring(1); //Make uppercase

  //Enable and set the other speed input box
	document.getElementById(not_selected_speed_id).removeAttribute("disabled");
	document.getElementById(not_selected_speed_id).value = -1*parseFloat(document.getElementById(selected_speed_id).value);
	
	//Force speed to equal 0 in selected frame
	document.getElementById(selected_speed_id).value = "0";
	document.getElementById(selected_speed_id).setAttribute("disabled", "disabled");
	
  // This updates the html page sentence to either jesus or travis
	document.getElementById("speed_text").innerHTML = "Set velocities relative to " + selected_name + " (in terms of c)";
	
	//Update values
	if(isInputValid()) reset();
}

// function to calculate the Lorentz factor that is used in multiple relativity problems
function calcLorentz(v) {
  lorentzFactor = 1/(Math.sqrt(1-(v*v))); // speed of light cancels out
  return lorentzFactor;
}

// Functoin for clculating the length contraction of objects moving at relatevistic speeds
function calcLength() {
  // Must determine whos frame we are in first
  // If the box is checked we are using that checked box reference frame
  if(document.getElementById("jesusRB").checked) 
  {
    jesus_speed = 0; // Stationary frame aka reference frame
    travis_speed = parseFloat(document.getElementById("travis_speed").value); // Proper Length aka the moving frame

    lorentz = calcLorentz(travis_speed);

    jesus_len = parseFloat(document.getElementById("jesus_len").value); // Length should remain the same
    travis_len = parseFloat(document.getElementById("travis_len").value)/lorentz; // Changes due to lorentz factor, hence length contraction
  }
  else // this means travis reference frame is checked 
  {
    // We will grab speed and length values
    jesus_speed = parseFloat(document.getElementById("jesus_speed").value); // Moving Frame
    travis_speed = 0; // stationary frame aka reference frame

    lorentz = calcLorentz(jesus_speed);

    jesus_len = parseFloat(document.getElementById("jesus_len").value)/lorentz; // Changes due to lorentz factor, hence length contraction
    travis_len = parseFloat(document.getElementById("travis_len").value);  // Length should remain the same
  }
}

// Function for calculating the time dialation
function calcTime() {
  // Must determine whos frame we are in first
  // If the box is checked we are using that checked box reference frame
  scale_factor = 10/3;  //Speed already in terms of c, so we divide by 3e8 and multiply by 1e9 for nanoseconds
  if(document.getElementById("jesusRB").checked) 
  {
    // Jesus as stationary frame
    proper_time += 1; // 1 ns
    jesus_speed =  parseFloat(document.getElementById("jesus_speed").value);
    jesus_time[0] = calcLorentz(travis_speed) * proper_time;
    travis_time[0] = proper_time;
  }
  else // this means travis reference frame is checked 
  {
    // Travis as stationary frame
    proper_time += 1; // 1ns
    travis_speed =  parseFloat(document.getElementById("travis_speed").value);
    travis_time[0] = calcLorentz(jesus_speed) * proper_time;
    jesus_time[0] = proper_time;
  }

  if (reset_bool == true) {
    jesus_time[0] = 0;
    travis_time[0] = 0;
    reset_bool = false;
  }
}

//Force values to be recalculated and displayed
function update(){
	if(!isInputValid()) return;
	calcLength();
	calcTime();
	draw();
}

// Function if reset button is clicked, to reset animation
function reset() {
  window.clearInterval(animateID); // clears the animation
  document.getElementById("pause").innerHTML = "Play";
  play = false;

  // Default x-values
  jesus_x = 500;
  travis_x = 500; 
  reset_bool = true;

  proper_time = 0;
  update(); // forces values to be resetted.
  enableInput(); // allows you to change input of velocity and length

  document.getElementById("reset").setAttribute("disabled", "disabled"); // lets you click reset to enable reset
}

// Animate function to animate movement of ships
function animate() {
  if (travis_speed > 0 || jesus_speed > 0) {
    if (travis_x < ship_canvas_width) travis_x  += 15*travis_speed; // 1 ns in real world
    else travis_x = 0 - travis_len;
    
    if (jesus_x < ship_canvas_width) jesus_x  += 15*jesus_speed;
    else jesus_x = 0 - jesus_len;
  }
  else {
    if (travis_x > 0 - travis_len) travis_x  += 15*travis_speed; // 1 ns in real world
    else travis_x = ship_canvas_width + travis_len;
    
    if (jesus_x > 0 - jesus_len) jesus_x  += 15*jesus_speed;
    else jesus_x = ship_canvas_width + jesus_len;
  }

  calcTime();
  draw();
}

//Draw grid, ships, clocks
function draw(){	
	//Reset canvases
	ship_context.clearRect(0, 0, ship_canvas_width, ship_canvas_height);
	clock_context.clearRect(0, 0, clock_canvas_width, clock_canvas_width);
	
	ship_context.fillStyle = 'rgb(200, 200, 200)';
	ship_context.fillRect(0, 0, ship_canvas_width, ship_canvas_width);
	
	clock_context.fillStyle = 'rgb(200, 200, 200)';
	clock_context.fillRect(0, 0, clock_canvas_width, clock_canvas_height);
	
	//Set up fonts
	ship_context.font = '10px sans-serif';
	ship_context.textBaseline = 'top';
	
	clock_context.font = "20px sans-serif";
	clock_context.textAlign = 'center';
	clock_context.textBaseline = 'middle';
	
	//Draw ship grid and clock labels
	grid(ship_context, ship_canvas_width, ship_canvas_height, 50);
	clock_context.fillStyle = 'rgb(0, 0, 0)';
	clock_context.fillText("Clocks", 200, 100);
	
	//Draw ships
	//Jesus
	ship_context.fillStyle = 'rgba(200, 0, 0, 0.4)';
	ship_context.strokeStyle = 'rgb(200, 0, 0)';
	spaceship(ship_context, jesus_x, 50, 40, jesus_len);
	
	//Travis
	ship_context.fillStyle = 'rgba(0, 0, 200, 0.4)';
	ship_context.strokeStyle = 'rgb(0, 0, 200)';
	spaceship(ship_context, travis_x, 150, 40, travis_len);
	
	//Draw clocks
	//Jesus
	clock_context.fillStyle = 'rgb(240, 240, 240)';
	clock_context.strokeStyle = 'rgb(200, 0, 0)';
	clock(clock_context, 200, 50, parseInt(jesus_time[0]));

	//Travis
	clock_context.fillStyle = 'rgb(240, 240, 240)';
	clock_context.strokeStyle = 'rgb(0, 0, 200)';
	clock(clock_context, 200, 150, parseInt(travis_time[0]));
}

//Draw a spaceship centered at x, y
function spaceship(ctx, x, y, height, length){	
	ctx.beginPath();
	ctx.moveTo(x - (length*0.5), y - (height*0.5));
	ctx.lineTo(x + (length*0.25), y - (height*0.5));
	ctx.lineTo(x + (length*0.5), y);
	ctx.lineTo(x + (length*0.25), y + (height*0.5));
	ctx.lineTo(x - (length*0.5), y + (height*0.5));
	ctx.closePath();
	
	ctx.fill();
	ctx.lineWidth = 4;
	ctx.stroke();
	ctx.lineWidth = 1;
}

//Draw a clock centered at x,y that reads display param
//Default dimensions are 100x50 for digital and radius 40 for analog
function clock(ctx, x, y, display){
		//Draw boxes
		ctx.fillRect(x-50, y-25, 100, 50);
		ctx.lineWidth = 4;
		ctx.strokeRect(x-50, y-25, 100, 50);
		ctx.lineWidth = 1;
		
		//Draw text
		origfill = ctx.fillStyle;
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fillText(display, x, y)
		ctx.fillStyle = origfill;
}

//Draw bg grid with labels
function grid(ctx, width, height, step){	
	ctx.strokeStyle = 'rgb(0, 0, 0)';
	ctx.fillStyle = 'rgb(0, 0, 0)';
	
	ctx.beginPath();
	
	//Draw vertical lines
	
	for(x = 0; x < width; x += step){
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
	}
	
	//Draw horizontal lines
	for(y = 0; y < height; y += step){
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
	}
	
	ctx.stroke();
	
	//Add numbers	
	for(x = 0; x < width; x += step){
		ctx.fillText(x + " m", x+1, 0);
	}
	
	for(y = step; y < height; y += step){
		ctx.fillText(y + " m", 0, y+1);
	}
}
