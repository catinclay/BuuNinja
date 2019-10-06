function Slash(from, to, cv) {
	this.color = "#FFFF00";
	this.from = {x:from.x, y:from.y};
	this.to = {x:to.x, y:to.y};
	this.cv = cv;
	this.duration = 20;
	this.counter = this.duration;
}

Slash.prototype.drawToContext = function(theContext) {
	if (this.counter > 0) {
		theContext.globalAlpha = this.counter / this.duration;
	    theContext.beginPath();
	    let from = {x:this.from.x, y:this.from.y};
	    let to = {x:this.to.x, y:this.to.y};
	    theContext.moveTo(this.from.x, this.from.y);
        let path = this.splitPath(from, to, this.cv);
        for (let i in path) {
            theContext.lineTo(path[i].x, path[i].y);
        }

		theContext.lineWidth = 10;
		theContext.strokeStyle = this.color;
		theContext.stroke();
		theContext.globalAlpha = 1;
	}
	this.counter--;
}

Slash.prototype.splitPath = function(from, to, cv) {
    let path = [];
     while (to.x < 0 || to.x > cv.w || to.y < 0 || to.y > cv.h) {
     let tmpVec = {x:to.x - from.x, y:to.y - from.y};
     let tmpFrom = {x:from.x, y:from.y};

     let lb = to.x < 0;
     let rb = to.x > cv.w;
     let tb = to.y < 0;
     let bb = to.y > cv.h;

     if (lb && tb) {
         // tmpVec.x / tmpFrom.x : tmpVec.y / tmpFrom.y
         if (Math.abs(tmpVec.x) * tmpFrom.y > Math.abs(tmpVec.y) * tmpFrom.x) {
             tb = false;
                bx = 0;
             by = tmpFrom.y - tmpVec.y * tmpFrom.x / tmpVec.x;
         } else {
             lb = false;
             bx = tmpFrom.x - tmpVec.x * tmpFrom.y / tmpVec.y;
                by = 0;
         }
     } else if (lb && bb) {
         // tmpVec.x / tmpFrom.x : tmpVec.y / (cv.h - tmpFrom.y)
         if (Math.abs(tmpVec.x) * (cv.h - tmpFrom.y) > Math.abs(tmpVec.y) * tmpFrom.x) {
             bb = false;
                bx = 0;
             by = tmpFrom.y + tmpVec.y * tmpFrom.x / tmpVec.x;
         } else {
             lb = false;
             bx = tmpFrom.x + tmpVec.x * (cv.h - tmpFrom.y) / tmpVec.y;
            by = cv.h;
         }
     } else if (rb && tb) {
         // tmpVec.x / (cv.w - tmpFrom.x) : tmpVec.y / tmpFrom.y
         if (Math.abs(tmpVec.x) * tmpFrom.y > Math.abs(tmpVec.y) * (cv.w - tmpFrom.x)) {
             tb = false;
                bx = cv.w;
             by = tmpFrom.y + tmpVec.y * (cv.w - tmpFrom.x) / tmpVec.x;
         } else {
             rb = false;
             bx = tmpFrom.x - tmpVec.x * tmpFrom.y / tmpVec.y;
                by = 0;
         }
     } else if (rb && bb) {
         // tmpVec.x / (cv.w - tmpFrom.x) :  tmpVec.y / (cv.h - tmpFrom.y)
         if (Math.abs(tmpVec.x) * (cv.h - tmpFrom.y) > Math.abs(tmpVec.y) * (cv.w - tmpFrom.x)) {
             bb = false;
                bx = cv.w;
             by = tmpFrom.y + tmpVec.y * (cv.w - tmpFrom.x) / tmpVec.x;
         } else {
             rb = false;
             bx = tmpFrom.x + tmpVec.x * (cv.h - tmpFrom.y) / tmpVec.y;
                by = cv.h;
         }
     } else if (lb) {
         bx = 0;
         by = tmpFrom.y - tmpVec.y * tmpFrom.x / tmpVec.x;
     } else if (rb) {
            bx = cv.w;
            by = tmpFrom.y + tmpVec.y * (cv.w - tmpFrom.x) / tmpVec.x;
        } else if (tb) {
            bx = tmpFrom.x - tmpVec.x * tmpFrom.y / tmpVec.y;
            by = 0;
        } else if (bb) {
            bx = tmpFrom.x + tmpVec.x * (cv.h - tmpFrom.y) / tmpVec.y;
            by = cv.h;
        }

     if (lb) {
         to.x *= -1;
     } else if (rb) {
         to.x = 2 * cv.w - to.x; 
     } else if (tb) {
         to.y *= -1;
     } else if (bb) {
         to.y = 2 * cv.h - to.y; 
     }
        from.x = bx;
        from.y = by;
        path.push({x:from.x, y:from.y});
    }
    path.push({x:to.x, y:to.y});

    return path;
}

Slash.prototype.shouldDestroy = function(theContext) {
	return this.duration <= 0;
}