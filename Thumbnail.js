var Thumbnail = (function(pupilR,ringData,rSize){
	var rings = [];
	var size = 50;
	var selInd = -1;
	var ratio = size/rSize;
	var pR = pupilR * ratio;
	var mouseX = -1;
	var mouseY = -1;
	var cX = -1;
	var cY = -1;
	for(var i=0; i<ringData.length;i++){
		var r = ringData[i];
		rings[i] = {oldR:r.oldR*ratio,newR:r.newR*ratio,color:r.color};
	}
	return {
		draw: function(x,y,canvas){
			cX = x;
			cY = y;
			for(var i = rings.length-1; i >= 0; i--){
				canvas.beginPath();
				canvas.fillStyle = rings[i].color;
				canvas.arc(x,y,rings[i].newR,0,2*Math.PI,false);
				canvas.fill();
				canvas.fillStyle = "black";
				canvas.beginPath();
				canvas.arc(x,y,rings[i].oldR,0,2*Math.PI,false);
				canvas.fill();
			}
		},
		x: function(){
			return cX;
		},
		y: function(){
			return cY;
		},
		copy: function(){
			return Thumbnail(pR,rings,size/ratio);	
		}
	}
});

var ThumbnailManager = (function(){
	var panel = $(".right-side-panel");
	var tCanvas = document.getElementById("thumbCanvas");
	tCanvas.width = ($(window).width());
	tCanvas.height = ($(window).height());
	var ctx = tCanvas.getContext("2d");
	//ctx.scale(.1,.1);
	panel.css("height",window.innerHeight);
	var active = false;
	var thumbnails = [];
	var selInd = -1;
	function distanceTo(ind,otherX,otherY){
		var diffX = otherX - thumbnails[ind].x();
		var diffY = otherY - thumbnails[ind].y();
		//console.log("otherY = "+otherY);
		var dist = Math.sqrt(((diffX)*(diffX)) + ((diffY)*(diffY)));
		console.log("dist: "+dist);
		return dist;
	}

	return {
		toggle: function(){
			active = !active && !showingMoreInfo;
			panel.toggleClass("expanded",active);
			help.setThumbnailGroup(active);
			if(active){
				colorPainter.resize(c.width - 100, c.height);
			}else{
				colorPainter.resize(c.width,c.height);
			}
			drawAll();
		},
		active: function(){
			return active;
		},
		addThumbnail: function(tn){
			thumbnails.push(tn);
		},
		clear: function(){
			thumbnails = [];
		},
		update: function(ind,t){
			thumbnails[ind] = t;
		},
		draw: function(){
			if(active){
				ctx.fillStyle = "black";
				ctx.fillRect(0,0,120,30000);
				for(var i = 0; i < thumbnails.length; i++){
					console.log("selInd: "+selInd);
					if(i == selInd){
						thumbnails[i].draw(60,mouseY,ctx);
						console.log("wut");
					}else{
						thumbnails[i].draw(60,120*i+80,ctx);
					}
				}
			}
		},		
		testMouse: function(x,y){
			return active && x > c.width - 120;
		},
		handleMouseDown: function(x,y){
			mouseX = x - c.width + 120;
			mouseY = y;
			startY = y;
			for(var i = 0; i<thumbnails.length;i++){
				if(distanceTo(i,mouseX,mouseY) < 50){
					selInd = i;
					console.log("selected "+i);
				}
			}
		},
		handleMouseMove: function(x,y){
			mouseX = x - c.width + 120;
			mouseY = y;
			if(mouseY - startY > 120){
				if(selInd +1 < thumbnails.length){
					var temp = thumbnails[selInd + 1].copy();
					thumbnails[selInd + 1] = thumbnails[selInd].copy();
					thumbnails[selInd] = temp;
					selInd++;
					startY = y;
					swapEyes(selInd-1,selInd);
				}
			}else if(startY - mouseY > 120){
				if(selInd -1 >= 0){
					var temp = thumbnails[selInd - 1];
					thumbnails[selInd - 1] = thumbnails[selInd];
					thumbnails[selInd] = temp;
					startY = y;
					swapEyes(selInd-1,selInd);
					selInd--;
				}
			}
		},
		handleMouseUp: function(x,y){
			selInd = -1;
			drawAll();
		}
	}
});
