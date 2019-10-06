function Samurai(posX, posY, ninja) {
		this.x = posX;
		this.y = posY;
		this.velX = 0;
		this.velY = 0;
		this.accelX = 0;
		this.accelY = 0;
		this.color = "#FF0000";
		this.radius = 15;
		this.ninja = ninja;
		this.baseSpeed = 1.5;

		// Alive = 0, small stun = 1, big stun = 2, terminated = 3
		this.status = 0;

		this.maxStamina = 3;
		this.stamina = this.maxStamina;

		this.stunCounter = 0;
		this.smallStunDuration = 10;

		this.bigStunCounter = 0;
		this.bigStunDuration = 180;
}

Samurai.prototype.swingHit = function(power, vec) {
	if (this.status == 0 || this.status == 1) {
		let dis = Math.sqrt(vec.x*vec.x + vec.y*vec.y); 
		this.velX = power * vec.x / dis;
		this.velY = power * vec.y / dis;

		if (this.stamina > 1) {
			this.stamina--;
			this.stunCounter = this.smallStunDuration;
			this.status = 1;
			this.bigStunCounter = this.bigStunDuration;
		} else if (this.stamina == 1) {
			this.stamina--;
			this.stunCounter = this.smallStunDuration;
			this.status = 2;
		}
		return;
	}
}

Samurai.prototype.terminate = function() {
	if (this.status == 2) {
		this.status = 3;
	}
}

Samurai.prototype.update = function() {
	let mul = this.ninja.globalSpeedMultiplier;
	let speed = this.baseSpeed * mul;
	if (this.status == 2) {
		this.x += mul * this.velX;
		this.y += mul * this.velY;
		this.stunCounter -= 1 * mul;
		if (this.stunCounter <= 0) {
			this.stunCounter = 0;
			this.velX = 0;
			this.velY = 0;
			this.bigStunCounter -= 1 * mul;
			this.stamina =  (this.bigStunDuration - this.bigStunCounter) / this.bigStunDuration * this.maxStamina;
			if (this.bigStunCounter <= 0) {
				this.bigStunCounter = 0;
				this.status = 0;
				this.stamina = this.maxStamina;
			}
		}
		return;
	}

	if (this.status == 1) {
		this.x += mul * this.velX;
		this.y += mul * this.velY;
		this.stunCounter -= 1 * mul;
		if (this.stunCounter <= 0) {
			this.stunCounter = 0;
			this.status = 0;
			this.velX = 0;
			this.velY = 0;
		}
		return;
	}

	if (this.status == 0) {
		let dx = this.ninja.x - this.x;
		let dy = this.ninja.y - this.y;
		let dd = Math.sqrt(dx * dx + dy * dy);
		this.x += this.baseSpeed * dx / dd;
		this.y += this.baseSpeed * dy / dd;
		return;
	}

}

//A function for drawing the particle.
Samurai.prototype.drawToContext = function(theContext) {
	if (this.status == 2) theContext.globalAlpha = 0.4;
	theContext.beginPath();
	theContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI * this.stamina / this.maxStamina);
	theContext.fillStyle = this.color;
	theContext.fill();
	theContext.globalAlpha = 1;
	theContext.stroke();

	theContext.beginPath();
	theContext.lineWidth = 2; 
	theContext.strokeStyle = "#000000";
	theContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI );
	theContext.stroke();
}

Samurai.prototype.shouldDestroy = function(theContext) {
	return this.status == 3;
}