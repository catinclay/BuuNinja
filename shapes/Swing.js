function Swing(posX, posY, r, duration, sr, sa) {
	this.x = posX;
	this.y = posY;
	this.r = r;

	this.swingRangeColor = '#0000FF';
	this.swingRange = sr;
	this.swingArea = sa;
	this.swingDuration = duration;
	this.swingCount = duration;
}


//A function for drawing the particle.
Swing.prototype.drawToContext = function(theContext) {
	if (this.swingCount > 0) {
		theContext.globalAlpha = 0.75 * this.swingCount / this.swingDuration;
		theContext.lineWidth = 2;
		theContext.strokeStyle = this.swingRangeColor;
	    theContext.beginPath();
		theContext.arc(
		  this.x,
		  this.y,
		  this.swingRange,
		  this.r - 0.25 * Math.PI,
		  this.r + 0.25 * Math.PI,
		  false
		);
		theContext.stroke();

		theContext.beginPath();
		theContext.arc(
		  this.x,
		  this.y,
		  this.swingRange + this.swingArea,
		  this.r - 0.25 * Math.PI,
		  this.r + 0.25 * Math.PI,
		  false
		);
		theContext.stroke();
		theContext.globalAlpha = 1;
	}
	this.swingCount--;
}

Swing.prototype.shouldDestroy = function(theContext) {
	return this.duration <= 0;
}

Swing.prototype.XYtoR = function(dx, dy) {
    return Math.atan2(dx, -dy) - 0.5 * Math.PI;
}