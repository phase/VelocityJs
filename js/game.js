//A Game!
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

movingUp = false;

var screenState = 0; 
var debug = false;

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "http://a6dfd94f194598e19935fd5fe7ca5a491c3bb92d.googledrive.com/host/0B-GTJ8rL0OS2ZF9laENwak1kN1E/js/images/background.png";

var heroReadyDown = false;
var heroImageDown = new Image();
heroImageDown.onload = function () {
	heroReadyDown = true;
};
heroImageDown.src = "http://a6dfd94f194598e19935fd5fe7ca5a491c3bb92d.googledrive.com/host/0B-GTJ8rL0OS2ZF9laENwak1kN1E/js/images/heroDown.png";

var heroReadyUp= false;
var heroImageUp = new Image();
heroImageUp.onload = function () {
	heroReadyUp = true;
};
heroImageUp.src = "http://a6dfd94f194598e19935fd5fe7ca5a491c3bb92d.googledrive.com/host/0B-GTJ8rL0OS2ZF9laENwak1kN1E/js/images/heroUp.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = 'http://a6dfd94f194598e19935fd5fe7ca5a491c3bb92d.googledrive.com/host/0B-GTJ8rL0OS2ZF9laENwak1kN1E/js/images/monster.png';

ground = canvas.height - (35*2) - heroImageUp.height;
baseSpeed = 256;
var hero = {
	speed: baseSpeed 
};
var monster = {};
var score = 0;
var keysDown = {};

addEventListener("keydown", function (e){
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e){
	delete keysDown[e.keyCode];
}, false);

//Reset Game
var reset = function (e){
	if(e){
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	gravity = .3;
    velocity = 1;
	movingUp = false;
	}
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (ground - 64));
};
var tpTimer = Date.now();
// Update game objects
var update = function (modifier){
	if (38 in keysDown) { 
		if(hero.y >= 5){
			hero.y -= hero.speed * modifier;
		}
		movingUp = true;
	}
	if (40 in keysDown) {
		if(hero.y < ground){
		hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { 
		if(hero.x >= 0){
		hero.x -= hero.speed * modifier;
		}
	}
	if (39 in keysDown) { 
		if(hero.x <= canvas.width - heroImageUp.width){
		hero.x += hero.speed * modifier;
		}
	}
	
	if(Date.now() - tpTimer >= 20){
		if(monster.x != hero.x){
			if(monster.x >= hero.x){
				if(hero.x >= 0){
					hero.x -= hero.speed * modifier;
					tpTimer = Date.now()
				}	
			}else if(monster.x <= hero.x){
				if(hero.x <= canvas.width - heroImageUp.width){
					hero.x += hero.speed * modifier;
					tpTimer = Date.now();
				}
			}
		}
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++score;
		reset(false);
	}
};

// Draw everything
var render = function (){
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if(bgReady == true){
		ctx.drawImage(bgImage, 0, 0);
	}
	
	if(screenState == 0){
		ctx.font = "32px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
		ctx.fillText("Velocity", canvas.height/2, canvas.width/2);
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		if(debug){
			ctx.font = "7px Helvetica";
			ctx.fillText((bgReady == true) + " : " + bgImage.src, 1, 33);
			ctx.fillText(monsterReady + " : " + monsterImage.src, 1, 65);
			ctx.font = "24px Helvetica";
		}
		document.getElementById("start").style.visibility = "visible";
		return;
	}else if(screenState == 2){
		ctx.font = "32px Helvetica";
		ctx.textAlign = "center";
		ctx.textBaseline = "top";
	if(score > localStorage.getItem("highscore")){
		localStorage.setItem("highscore", score);
		ctx.fillText("New HighScore!", canvas.width/2, canvas.height/2 - 32);
	}
	ctx.fillText("Score: " + score, canvas.width/2, canvas.height/2);
	document.getElementById("start").style.visibility = "visible";
	
	
	}else{
		document.getElementById("start").style.visibility = "hidden";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if(movingUp){
		if(heroReadyUp){
			ctx.drawImage(heroImageUp, hero.x, hero.y);
		}
	}else{
		if(heroReadyDown){
			ctx.drawImage(heroImageDown, hero.x, hero.y);
		}
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Info
	
	ctx.fillText("Score: " + score, 32, 32);
	ctx.fillText("Highscore: " + localStorage.getItem("highscore"), 300, 32);
	ctx.fillText("Velocity: " + parseInt(velocity), 32, 64);
	var time = (Date.now() - beginning)/1000;
	ctx.fillText("Time: " + parseInt(time) + " sec.", 32, 96);
}
};

var gravity = .3;
var velocity = 1;

// The main game loop
var main = function (){
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	
	then = now;
	
	if(hero.y < ground && !movingUp){
		hero.y = hero.y+(gravity * velocity);
		velocity = velocity + 0.095703125;
	}
	if(hero.y >= ground){
		stop();
	}
	requestAnimationFrame(main);
	render();
	movingUp = false;
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var start = function(){
	screenState = 1;
	score = 0;
	document.getElementById("start").style.visibility = "hidden";
	reset(true);
	beginning = Date.now();
}

var stop = function(){
	screenState = 2;
	velocity = 0;
}

// Run game
screenState=0;
var beginning = Date.now();
var then = Date.now();
main();