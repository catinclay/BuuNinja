function Game(){}

Game.prototype.init = function(canvasWidth, canvasHeight, imageManager, soundManager){
	this.canvasWidth = canvasWidth;
	this.canvasHeight = canvasHeight;
	this.drawables = [];
	this.particles = [];
	this.drawables.push(this.particles);
	this.imageManager = imageManager;
	this.soundManager = soundManager;

	this.enemies = [];
	this.drawables.push(this.enemies);
	
	this.ninja = new Ninja(canvasWidth/2, canvasHeight*2/3, this.particles, {w: canvasWidth, h:canvasHeight}, this.enemies);
	this.particles.push(this.ninja);

	
	this.enemies.push(new Samurai(100, 100, this.ninja));
	

	this.clickDownXY = {};
	this.isDragging = false;
}

Game.prototype.update = function() {
	this.ninja.update();
	this.enemies.map((enemy) => enemy.update());
}

Game.prototype.getDrawables = function() {
	return this.drawables;
}

Game.prototype.inputDownListener = function(touchX, touchY) {
	this.clickDownXY.x = touchX;
	this.clickDownXY.y = touchY;
	this.isDragging = true;
}

Game.prototype.inputMoveListener = function(touchX, touchY) {
	let dx = touchX - this.clickDownXY.x;
	let dy = touchY - this.clickDownXY.y;
	if (this.isDragging && dx * dx + dy * dy > 100) { 
		this.ninja.showSlashLine({x:this.clickDownXY.x, y:this.clickDownXY.y}, {x:touchX,y:touchY});
	}
}

Game.prototype.inputUpListener = function(touchX, touchY) {
	let dx = touchX - this.clickDownXY.x;
	let dy = touchY - this.clickDownXY.y;
	this.isDragging = false;
	if (dx * dx + dy * dy <= 100) { 
		this.ninja.swing(touchX, touchY);
	} else {
		this.ninja.slash({x:this.clickDownXY.x, y:this.clickDownXY.y}, {x:touchX,y:touchY});
	}
	this.ninja.hideSlashLine();
}