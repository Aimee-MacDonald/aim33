// Canvas Section
var el_canvas = document.querySelector("canvas");

var screenWidth = el_canvas.width = window.innerWidth;
var screenHeight = el_canvas.height = window.innerHeight;

window.onresize = function(e){
  screenWidth = el_canvas.width = window.innerWidth;
  screenHeight = el_canvas.height = window.innerHeight;
}

var c = el_canvas.getContext("2d");
function render(){
  requestAnimationFrame(render);
  c.fillStyle = "#3482f1";
  c.beginPath();
  c.fillRect(0, 0, screenWidth, screenHeight);
}

render();

// Menu Section
function menuToggle(){
  console.log("Menu Toggle");
}

document.querySelector("body").classList = "layout_main";
