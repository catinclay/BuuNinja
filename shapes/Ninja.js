function Ninja(posX, posY, particles, cv, enemies) {
	this.x = posX;
	this.y = posY;
	this.velX = 0;
	this.velY = 0;
	this.accelX = 0;
	this.accelY = 0;
	this.color = "#AA00AA";
	this.radius = 15;
	this.particles = particles;
	this.cv = cv;
	this.enemies = enemies;

	this.swingDuration = 15;
	this.swingCount = 0;
	this.swingRange = 30;
	this.swingArea = 40;
	this.swingPower = 10;

	this.preparingSlash = false;
	this.slashVec = {};
	this.slashingCounter = 0;
	this.slashingDuration = 30;

	this.globalSpeedMultiplier = 1;
	this.globalSpeedMultiplierDuration = 10;
	this.globalSpeedMultiplierCounter = 0;
}

Ninja.prototype.swing = function(x, y) {
	if (this.swingCount == 0) {
		let sr = this.XYtoR(x - this.x, y - this.y);
		this.particles.push(new Swing(this.x, this.y, sr, 20, this.swingRange, this.swingArea));
		this.swingCount = this.swingDuration;
		this.enemies.map((enemy) => {
			let dx = enemy.x - this.x;
			let dy = enemy.y - this.y;
			let dis = Math.sqrt(dx*dx + dy*dy); 
			let r = this.XYtoR(dx, dy);
			let dr = r - sr;
			if (dr > 2 * Math.PI) dr -= 2 * Math.PI;
			dr =  Math.abs(dr);
			if (dis <= this.swingRange + this.swingArea + enemy.radius && (dr <= 0.25 * Math.PI || dr >= 1.75 * Math.PI)) {
				enemy.swingHit(this.swingPower, {x:dx, y:dy});
			}
		}); 
	}
}

Ninja.prototype.update = function() {
	if (this.swingCount > 0) {
		this.swingCount--;
	}

	if (this.slashingCounter > 0) {
		this.slashingCounter--;
	}

	if (this.globalSpeedMultiplierCounter > 0) {
		this.globalSpeedMultiplierCounter--;
	}
}

Ninja.prototype.showSlashLine = function(from, to) {
	this.preparingSlash = true;
	this.slashVec = {x: to.x - from.x, y: to.y - from.y};

}

Ninja.prototype.doSlash = function(from, to) {
	this.enemies.map((enemy) => {
		if(this.isItersectWithCircle(from, to, enemy, enemy.radius)) {
			enemy.terminate();
		}
	});
}

Ninja.prototype.slash = function(from, to) {
	if (this.slashingCounter > 0) return;
	let dx = to.x - from.x;
	let dy = to.y - from.y;
	let slash = new Slash({x:this.x, y:this.y}, {x:this.x+dx , y:this.y+dy}, this.cv);
	this.particles.push(slash);
	this.slashingCounter = this.slashingDuration;
	let splitSlashes = slash.splitPath({x:this.x, y:this.y}, {x:this.x+dx, y:this.y+dy}, this.cv);
	let curFrom = {x:this.x, y:this.y};
	for (let i = 0 ; i < splitSlashes.length; ++i) {
		this.doSlash(curFrom, splitSlashes[i]);
		curFrom = splitSlashes[i];
	}
	this.x = splitSlashes[splitSlashes.length-1].x;
	this.y = splitSlashes[splitSlashes.length-1].y;
}

Ninja.prototype.hideSlashLine = function() {
	this.preparingSlash = false;
}

//A function for drawing the particle.
Ninja.prototype.drawToContext = function(theContext) {
	// Preparing for slash
	if (this.preparingSlash && this.slashingCounter == 0) {
		theContext.globalAlpha = 0.8;
	    theContext.lineWidth = 3;
	    theContext.strokeStyle = this.color;
	    theContext.beginPath();

	    theContext.moveTo(this.x, this.y);
	    theContext.lineTo(this.x + this.slashVec.x, this.y + this.slashVec.y);
	    theContext.stroke();
	    theContext.globalAlpha = 1;
	}

	theContext.fillStyle = this.color;
	theContext.fillRect(this.x - this.radius, this.y - this.radius, 2*this.radius * (this.slashingDuration - this.slashingCounter) / this.slashingDuration, 2*this.radius);
	theContext.beginPath();
    theContext.rect(this.x - this.radius, this.y - this.radius, 2*this.radius, 2*this.radius);
  	theContext.lineWidth = 2;
  	theContext.strokeStyle = "#330000";
  	theContext.stroke();
}

Ninja.prototype.getDistance = function(x1, y1, x2, y2) {
  return Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  );
}

Ninja.prototype.isItersectWithCircle = function(from, to, tar, r) {
  const a = this.getDistance(from.x, from.y, tar.x, tar.y);
  const b = this.getDistance(to.x, to.y, tar.x, tar.y);
  const c = this.getDistance(from.x, from.y, to.x, to.y);
  const as = Math.pow(a, 2);
  const bs = Math.pow(b, 2);
  const cs = Math.pow(c, 2);
  const d = Math.sqrt(2 * as + 2 * bs - cs - Math.pow(as - bs, 2) / cs) / 2;
  
  return r >= d;
}

Ninja.prototype.shouldDestroy = function(theContext) {
	return false;
}

Ninja.prototype.XYtoR = function(dx, dy) {
    return Math.atan2(dx, -dy) - 0.5 * Math.PI;
}