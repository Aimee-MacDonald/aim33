var el_POI = document.getElementById("POI");

el_POI.addEventListener("submit", function(e){
  e.preventDefault();

  var domain = document.getElementById("checkDomain").value;

  domain = domain.replace(/https:/, '');
  domain = domain.replace(/http:/, '');
  domain = domain.replace(/www./, '');
  if(domain.indexOf(".") !== -1) domain = domain.substring(0, domain.indexOf("."));
  domain = domain.match(/([a-z])|([0-9])|(-)/g).join("");
  while(domain[0] === "-") domain = domain.substring(1, domain.length);
  while(domain[domain.length - 1] === "-") domain = domain.substring(0, domain.length - 1);

  var request = new XMLHttpRequest();
  request.open("POST", "/checkDomain");
  request.setRequestHeader("CSRF-Token", document.getElementById("csrf").value);
  request.setRequestHeader("Content-Type", "application/json");
  request.withCredentials = true;

  request.onload = function(){
    if(request.readyState === 4){
      if(request.status === 200){
        el_POI.innerHTML = "<h1>" + domain + "</h1>";
      } else {
        // Other Response
      }
    }
  }

  request.onerror = function(){
    // Error
  }

  request.send(JSON.stringify({'domain': domain}));
});

var canvas = document.querySelector("canvas");

var screenWidth = canvas.width = window.innerWidth;
var screenHeight = canvas.height = window.innerHeight;

var c = canvas.getContext("2d");

var nodes = [];
var nodeCount = (screenWidth + screenHeight) / 15;

while(nodes.length < nodeCount)
  nodes.push(new Node());

nodes[0].influence = 100;
nodes[0].r = 10;

var prevTime = new Date().getTime();
function update(){
  requestAnimationFrame(update);

  var deltaTime = new Date().getTime() - prevTime;
  prevTime = new Date().getTime();

  for(var i = 1; i < nodes.length; i++){
    nodes[i].update(deltaTime);
  }

  render();
}

function render(){
  // Background Gradient
  var grad = c.createRadialGradient(screenWidth/2, screenHeight/2, (screenWidth+screenHeight)/4, screenWidth/2, screenHeight/2, 10);
  grad.addColorStop(0, "#4b2a49");
  grad.addColorStop(1, "#b541d3");
  c.fillStyle = grad;
  c.beginPath();
  c.fillRect(0, 0, screenWidth, screenHeight);

  c.fillStyle = "#4b2a49";
  c.strokeStyle = "#4b2a49";
  for(var i = 1; i < nodes.length; i++){
    nodes[i].render();
  }

  c.fillStyle = "#7ae4b1";
  nodes[0].render();
}

function Node(){
  this.x = Math.floor(Math.random() * screenWidth) + 1;
  this.y = Math.floor(Math.random() * screenHeight) + 1;
  this.r = 5;
  this.vx = (Math.random() - 0.5)/20;
  this.vy = (Math.random() - 0.5)/20;
  this.influence = 50;

  this.update = function(dt){
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if(this.x > screenWidth)
      this.x = 0;
    if(this.x < 0)
      this.x = screenWidth;
    if(this.y > screenHeight)
      this.y = 0;
    if(this.y < 0)
      this.y = screenHeight;
  }

  this.render = function(){
    for(var i = 0; i < nodes.length; i++){
      var dx = this.x - nodes[i].x;
      var dy = this.y - nodes[i].y;
      if(dx < 0)
        dx = dx * -1;
      if(dy < 0)
        dy = dy * -1;

      if(dx < this.influence && dy < this.influence){
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(nodes[i].x, nodes[i].y);
        c.stroke();
      }
    }

    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fill();
  }
}

window.onresize = function(e){
  screenWidth = canvas.width = window.innerWidth;
  screenHeight = canvas.height = window.innerHeight;
}

document.onmousemove = function(e){
  nodes[0].x = e.pageX;
  nodes[0].y = e.pageY;
}

update();
