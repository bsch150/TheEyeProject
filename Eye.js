var Eye = (function(x,y,r){
	var doneFlag = false;
	var radii = [];
	var cX = (x == undefined ? getRandBetween(0, c.width) : x);
	var cY = (y == undefined ? getRandBetween(0, c.height): y);
	var minR = 10;
	var maxR = 100;
	var minDots = 50;
	var maxDots = 100;
	var size = cX;
	var numConnections = 2;
	var ringData = [];
	var centerSelected = false;
	var selectedRadius = -1;
	var selectedX = -1;
	var pupilR = -1;
	var pupilRing = [];
	var thumbnail = undefined;

	randomize();
	generateAnew();

	function pMoveTo(r,theta){
		theta = theta * Math.PI/180;
		var x = r * Math.cos(theta) + cX;
		var y = r * Math.sin(theta) + cY;
		g.moveTo(x, y);
		g.stroke();
	}
	function pLineTo(r,theta){
		theta = theta * Math.PI/180;
		var x = r * Math.cos(theta) + cX;
		var y = r * Math.sin(theta) + cY;
		g.lineTo(x, y);
		g.stroke();
	}

	function findClosestDots(theta,oldRing){
		var minInd = 0;
		for(var i = 0; i < oldRing.length; i++){
			if(Math.abs(theta - oldRing[i]) < Math.abs(theta - oldRing[minInd])){
				minInd = i;
			}
		}
		var ret = [minInd];
		var change = 1;
		var currInd = minInd;
		for(var i = 1; i < numConnections; i++){
			currInd += change;
			if(currInd < 0){
				currInd += oldRing.length;
			}else if(currInd > oldRing.length - 1){
				currInd -= oldRing.length;
			}
			ret[i] = currInd;
			if(change < 0){
				change -= 1
			}else{
				change += 1;
			}
			change *= -1;
		}
		return ret;
	}
	function getDecimal(hexNum){
		var temp = parseInt(hexNum,16);
		//console.log("decimal returned is "+temp)
		return temp;
	}
	function randomize(){
		oldRing = [0];
		newRing = [0];
		startRed = getRandBetween(5,255);
		endRed =  getRandBetween(20,255);
		startGreen =  getRandBetween(5,255);
		endGreen =  getRandBetween(20,255);
		startBlue =  getRandBetween(5,255);
		endBlue = getRandBetween(20,255);
		minDots = getRandBetween(2,60);
		maxDots = getRandBetween(0,1000);
		minR = getRandBetween(4,100);
		maxR = minR + getRandBetween(0,500);
		oldR = 1;
		newR = 1;
	}
	function setColor(percent){
		hex = '#' + hex;
		var blue = getHex((((endBlue - startBlue) * percent) + startBlue));
		var red = getHex((((endRed - startRed) * percent) + startRed));
		var green = getHex((((endGreen - startGreen) * percent) + startGreen));
		var hex = "#" + red + green + blue;
		g.fillStyle = hex;
		return hex;
	}
	function getNewRing(inc,counter,offset){
		var ret = [];
		while(counter > 0) {
			var thisTheta = ((inc * counter) + offset) % 360;
			ret[counter - 1] = thisTheta;
			counter--;
		}
		return ret;
	}
	function generateAnew(){
		pupilR = getRandBetween(Math.round(cX*.1),Math.round(cX*.5));
		var currR = pupilR;
		var sRed = getRandBetween(20,255);
		var eRed = getRandBetween(20,255);
		var sGreen = getRandBetween(20,255);
		var eGreen = getRandBetween(20,255);
		var sBlue = getRandBetween(20,255);
		var eBlue = getRandBetween(20,255);
		var numDots = getRandBetween(minDots,maxDots);
		var inc = 360 / numDots;
		var offset = getRandBetween(0,359);
		var counter = numDots;
		var smallRing = getNewRing(inc,counter,offset);
		pupilRing = smallRing;
		var newRing = [];
		var addedColor = -1;
		var otherLines = [];
		var toAdd = getRandBetween(minR,maxR);
		var oldR = 0;
		while(currR + toAdd < size){
			oldR = currR;
			currR += toAdd;
			radii.push(currR);
			numDots = getRandBetween(minDots,maxDots);
			inc = 360 / numDots;
			offset = getRandBetween(0,359);
			counter = numDots;
			newRing = getNewRing(inc,counter,offset);
			pMoveTo(currR,offset);
			for(var i = numDots -1; i >=0; i--){
				pMoveTo(currR,newRing[i]);
				otherLines[i] = findClosestDots(newRing[i],smallRing);
				var otherLinesPrime = otherLines[i];
				for(var k = 0; k < otherLinesPrime.length - 1; k++) {
					addedColor = calculateColor(currR / size,sRed,eRed,sGreen,eGreen,sBlue,eBlue);
					g.lineWidth = 0;
					g.beginPath();
					pLineTo(oldR, smallRing[otherLinesPrime[k]]);
					pLineTo(oldR, smallRing[otherLinesPrime[k + 1]]);
					pLineTo(currR, newRing[i]);
					g.strokeStyle = 'black';
					g.lineWidth = 0;
					g.fill();
				}
			}
			ringData.push({
				newR: currR,
				oldR: currR - toAdd,
				numDots: numDots,
				offset: offset,
				oldRing: smallRing,
				color: addedColor,
				assignedColor: false,
				otherLines: otherLines
			});
			toAdd = getRandBetween(minR,maxR);
			smallRing = newRing;
			otherLines = [];
		}
		if(ringData.length > 0){
			ringData[0].assignedColor = true;
			ringData[ringData.length - 1].assignedColor = true;
			doneFlag = true;
		}
		thumbnail = Thumbnail(pupilR,ringData,size);
	}
	function redrawAll(){
		g.fillStyle = 'black';
		g.fillRect(0,0,10000,10000);
		for(var i=0; i<eyes.length; i++){
			eyes[i].draw();
		}
		help.writeHelp();
	}
	function getOtherLines(newRing,oldRing){
		var ret = [];
		for(var i = 0; i < newRing.length; i++){
			ret[i] = findClosestDots(newRing[i],oldRing);
		}
		return ret;
	}
	function draw(){
		if(ringData.length == 0){
			generateAnew();
		}
		for(var i=0; i<ringData.length; i++){
			var r = ringData[i];
			var numDots = r.numDots;
			var newR = r.newR;
			var oldR = r.oldR;
			var oldRing = r.oldRing;
			var offset = r.offset;
			var inc = 360/numDots;
			g.strokeStyle = 'black';
			pMoveTo(newR,offset);
			var counter = numDots;
			var newRing = getNewRing(inc,counter,offset);
			pMoveTo(newR,offset);
			for(var j = numDots-1; j >= 0; j--){
				pMoveTo(newR,newRing[j]);
				r.otherLines = (r.otherLines == undefined ? getOtherLines(newRing,oldRing) : r.otherLines);
				var otherLinesPrime = r.otherLines[j];
				for(var k = 0; k < otherLinesPrime.length - 1; k++) {
					g.fillStyle = r.color;
					g.lineWidth = 0;
					g.beginPath();
					pLineTo(oldR, oldRing[otherLinesPrime[k]]);
					pLineTo(oldR, oldRing[otherLinesPrime[k + 1]]);
					pLineTo(newR, newRing[j]);
					g.strokeStyle = 'black';
					g.lineWidth = 0;
					g.fill();
				}
			}
		}
	}
	function distanceTo(otherX,otherY){
		var diffX = otherX - cX;
		var diffY = otherY - cY;
		//console.log("otherY = "+otherY);
		var dist = Math.sqrt(((diffX)*(diffX)) + ((diffY)*(diffY)));
		return dist;
	}
	function calculateColor(percent,startRed,endRed,startGreen,endGreen,startBlue,endBlue){
		var blue = getHex((((endBlue - startBlue) * percent) + startBlue));
		var red = getHex((((endRed - startRed) * percent) + startRed));
		var green = getHex((((endGreen - startGreen) * percent) + startGreen));
		var hex = "#" + red + green + blue;
		return hex;
	}
	function setRingColorsFrom(ind){
		var sRed = -1;
		var eRed = -1;
		var sGreen = -1;
		var eGreen = -1;
		var sBlue = -1;
		var eBlue = -1;
		var stopTop = -1;
		var stopBottom = -1;
		for(var i=ind+1; i < ringData.length;i++){
			if(ringData[i].assignedColor){
				var startColor = ringData[ind].color;
				var endColor = ringData[i].color;
				sRed = getDecimal(startColor.slice(1,3));
				eRed = getDecimal(endColor.slice(1,3));
				sGreen = getDecimal(startColor.slice(3,5));
				eGreen = getDecimal(endColor.slice(3,5));
				sBlue = getDecimal(startColor.slice(5,7));
				eBlue = getDecimal(endColor.slice(5,7));
				stopTop = i;
				i = ringData.length;
			}else{
				//console.log("not assignedColor at "+i)
			}
		}
		for(var i=ind+1; i<stopTop; i++){
			var percent = (i-ind)/(stopTop - ind);
			console.log("at "+i+", with ind "+ind+", and stopTop "+stopTop+", calculated percent is "+percent);
			var temp = calculateColor(percent,sRed,eRed,sGreen,eGreen,sBlue,eBlue);
			//console.log(temp);
			ringData[i].color = temp;
		}
		for(var i=ind-1; i >= 0;i--){
			if(ringData[i].assignedColor){
				var endColor = ringData[ind].color;
				var startColor = ringData[i].color;
				sRed = getDecimal(startColor.slice(1,3));
				eRed = getDecimal(endColor.slice(1,3));
				sGreen = getDecimal(startColor.slice(3,5));
				eGreen = getDecimal(endColor.slice(3,5));
				sBlue = getDecimal(startColor.slice(5,7));
				eBlue = getDecimal(endColor.slice(5,7));
				console.log("found stopBottom at "+i);
				stopBottom = i;
				i = -1;
			}
		}
		for(var i=ind-1; i > stopBottom;i--){
			var percent = 1-(ind - i)/(ind - stopBottom);
			console.log("at "+i+", with ind "+ind+", and stopBottom" +stopBottom+", calculated percent is "+percent);
			var temp = calculateColor(percent,sRed,eRed,sGreen,eGreen,sBlue,eBlue);
			ringData[i].color = temp;
		}
	}
	function growPupilR(){
		if(pupilR * 1.2 < radii[0] - 20){
			pupilR *= 1.2;
			ringData[0].oldR *= 1.2;
		}else{
			pupilR = radii[0] - 20;
			ringData[0].oldR = radii[0] - 20;
		}
	}
	function shrinkPupilR(){
		if(pupilR / 1.2 > 20){
			pupilR /= 1.2;
			ringData[0].oldR /= 1.2;
		}else{
			pupilR = 20;
			ringData[0].oldR = 20;
		}
	}
	function growNumDots(ind){
		var r = ringData[ind];
		r.numDots = Math.round(r.numDots*1.2);
		var counter = r.numDots;
		var newRing = getNewRing(360/r.numDots,counter,r.offset);
		r.otherLines = undefined;
		if(ind + 1 < ringData.length){
			ringData[ind+1].oldRing = newRing;
			ringData[ind+1].otherLines = undefined;
		}
	}
	function shrinkNumDots(ind){
		var r = ringData[ind];
		r.numDots = Math.round(r.numDots/1.2);
		var counter = r.numDots;
		var newRing = getNewRing(360/r.numDots,counter,r.offset);
		r.otherLines = undefined;
		if(ind + 1 < ringData.length){
			ringData[ind+1].oldRing = newRing;
			ringData[ind+1].otherLines = undefined;
		}
	}
	return{
		drawRing: function(){
			if(!doneFlag){
				generateAnew();
				doneFlag = true;
			}else{
				doneFlag = true
				//drawAll();
			}
		},
		draw: function(){
			draw();
		},
		testMouse: function(x,y){
			return !(distanceTo(x,y) > radii[radii.length-1]);
		//tests if click is inside this Eye.
		},
		handleMouseDown: function(x,y){
			var dist = distanceTo(x,y) < pupilR;
			selectedX = x;
			selectedY = y;
			//console.log("dist = "+distanceTo(x,y));
			if(dist){
				centerSelected = true;
				help.setGroupThree(true);
				help.writeHelp();
				//console.log("selected an Eye of size: "+size+", and "+radii.length+" rings.");
			}else{
				help.setGroupFour(true);
				help.writeHelp();
				//console.log("selcted a radius");
				for(var i=0; i<radii.length; i++){
					if(distanceTo(x,y) < radii[i]){
						selectedRadius = i;
						i = radii.length;
					}
				}
			}
		},
		handleMouseMove: function(x,y){
			if(centerSelected){
				//console.log("moving to "+x+", "+y);
				cX += x - selectedX;
				cY += y - selectedY;
				selectedX = x;
				selectedY = y;
			}else if(selectedRadius != -1) {
				var diffX = (x - selectedX)/2;
				var diffY = (y - selectedY)/2;
				selectedX = x;
				selectedY = y;
				if (ringData[selectedRadius].newR + diffX > ringData[selectedRadius].oldR + 20) {
					ringData[selectedRadius].newR += diffX;
					radii[selectedRadius] += diffX;
					for (var i = selectedRadius + 1; i < ringData.length; i++) {
						var ring = ringData[i];
						ring.oldR += diffX;
						ring.newR += diffX;
						ring.otherLines = undefined;
						radii[i] += diffX;
					}
					size += diffX;
				}
				if(ringData[selectedRadius].oldR - diffY < ringData[selectedRadius].newR - 20){
					if(selectedRadius > 0){
						if(ringData[selectedRadius].oldR - diffY > ringData[selectedRadius-1].newR){
							ringData[selectedRadius].oldR -= diffY;
						}else{
							ringData[selectedRadius].oldR = ringData[selectedRadius-1].newR;
						}
					}
				}					
			}
			drawAll();
		},
		handleQ: function(){
			if(selectedRadius != -1){
				growNumDots(selectedRadius);
			}else if(centerSelected){
				pupilR *= 1.2;
				size *= 1.2;
				for(var i=0; i<ringData.length; i++){
					var ring = ringData[i];
					ring.oldR = ring.oldR * 1.2;
					ring.newR = ring.newR * 1.2;
					ring.otherLines = undefined;
				}
				for(var i=0; i<radii.length; i++){
					radii[i] *= 1.2;
					ringData[i].otherLines = undefined;
				}
			}
			drawAll();
		},
		handleW: function(){
			if(selectedRadius != -1) {
				shrinkNumDots(selectedRadius);
			}else if(centerSelected){
				pupilR /= 1.2;
				size /= 1.2;
				for(var i=0; i<ringData.length; i++){
					var ring = ringData[i];
					ring.oldR = ring.oldR / 1.2;
					ring.newR = ring.newR / 1.2;
					ring.otherLines = undefined;
				}
				for(var i=0; i<radii.length; i++){
					radii[i] /= 1.2;
				}
			}
			drawAll();
		},
		unselect: function(){
			selectedX = -1;
			selectedY = -1;
			centerSelected = false;
			selectedRadius = -1;
			help.setGroupThree(false);
			help.setGroupFour(false);
			help.writeHelp();
		},
		handleA: function() {
			if (centerSelected) {
				growPupilR();
			}else if(selectedRadius != -1){
				ringData[selectedRadius].color = colorPainter.getColor();
				ringData[selectedRadius].assignedColor = true;
				setRingColorsFrom(selectedRadius);
			}
			drawAll();
		},
		handleS: function(){
			if (centerSelected) {
				shrinkPupilR();
			}else if(selectedRadius != -1){
				colorPainter.updateColor(ringData[selectedRadius].color);
			}
			drawAll();
		},
		handleZ: function(){
			if(centerSelected) {
				var newLength = Math.round(pupilRing.length * 1.2);
				pupilRing = getNewRing(360/newLength,newLength,1);
				ringData[0].oldRing = pupilRing;
				ringData[0].otherLines = undefined;
			}
			drawAll();
		},
		handleX: function(){
			if(centerSelected) {
				var newLength = Math.round(pupilRing.length / 1.2);
				pupilRing = getNewRing(360/newLength,newLength,1);
				ringData[0].oldRing = pupilRing;
				ringData[0].otherLines = undefined;
			}
			drawAll();
		},
		handleE: function(){
			if(centerSelected){
				var oldR2 = ringData[ringData.length-1].newR;
				var newR2 = oldR2 + getRandBetween(minR,maxR/2);
				var numDots2 = getRandBetween(minDots,maxDots);
				var prevNumDots = ringData[ringData.length-1].numDots;
				var counter = prevNumDots;
				var oldRing2 = getNewRing(360/prevNumDots,counter,ringData[ringData.length-1].offset);
				radii.push(newR2);
				ringData.push({newR:newR2,oldR:oldR2,numDots:numDots2,offset:getRandBetween(0,359),oldRing:oldRing2,color:"white",assignedColor:false,otherLines:undefined})
			}
			drawAll();
		},
		handleD: function(){
			if(centerSelected){
				ringData.splice(ringData.length-1,1);
				radii.splice(radii.length-1,1);
			}else if(selectedRadius != -1){
				var diffX = ringData[selectedRadius].newR - ringData[selectedRadius].oldR;
				ringData.splice(selectedRadius,1);
				radii.splice(selectedRadius,1);
				for (var i = selectedRadius; i < ringData.length; i++) {
					var ring = ringData[i];
					ring.oldR -= diffX;
					ring.newR -= diffX;
					ring.otherLines = undefined;
					radii[i] -= diffX;
				}
				size -= diffX;
			}drawAll();
		},
		handleR: function(){
			ringData[0].assignedColor = true;
			ringData[ringData.length-1].assignedColor = true;
			for(var i=1;i<ringData.length-1;i++){
				ringData[i].assignedColor = false;
			}
			drawAll();
		},
		getThumbnail: function(){
			thumbnail = Thumbnail(pupilR,ringData,ringData[ringData.length-1].newR);
			return thumbnail;
		},
		redrawAll: function(){
			redrawAll();
		},
		cX: function(){
			return cX;
		},
		cY: function(){
			return cY;
		},
		size: function(){
			return size;
		},
		pupilR: function(){
			return pupilR;
		},
		pupilRing: function(){
			return pupilRing;
		},
		makeCopyOf: function(otherEye){
			cX = otherEye.cX();
			cY = otherEye.cY();
			size = otherEye.size();
			pupilR = otherEye.pupilR();
			pupilRing = otherEye.pupilRing();
		}
	}
});
