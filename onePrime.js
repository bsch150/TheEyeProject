/*
	This program written by Bryan Schrock in March 2015
*/
var backgroundColor = 'black';
var config = document.getElementById("config");
$("#config").toggle();
var c = document.getElementById("wholePage");
var colorWheel = document.getElementById("colorButton");
var g = c.getContext('2d');
c.width  = window.innerWidth;
c.height = window.innerHeight;
var tempC = getRandomColorHex();
var colorPainter = ColorPainter(c.width - 60, c.height - 60,tempC);
colorPainter.updateColor(tempC);
$('#colorButton').on('input', colorOkFunction);
$(".left-side-panel").height(c.height);
var help = Help();
var thumbnailManager = ThumbnailManager();
var thumbSelect = false;
var showingMoreInfo = false;
help.setGroupFive(true);
help.setGroupTwo(true);

function colorOkFunction(){
    colorPainter.updateColor($("#colorButton").val());
    drawAll();
}
function getHex(num){
    num = Math.floor(num)
    if(num < 0){
        return "00";
    }else if(num > 255){
        return "FF";
    }else{
        var ret = num.toString(16);
        if(ret.length < 2){
            ret = "0" + ret;
        }
        return ret;
    }
}
function getRandBetween(low,high){
    return Math.floor(Math.random() * (high - low + 1)) + low;
}
function getRandomColorHex(){
    var blue = getHex(getRandBetween(10,255));
    var red = getHex(getRandBetween(10,255));
    var green = getHex(getRandBetween(10,255));
    return "#" + red + green + blue;
}

var eyes = [];
var selected = undefined;
function fillEyes(num){
	for(var i=0;i<num;i++){
		eyes[i] = Eye();
	}
	
}
drawAll();
var selectedIndex = -1;
var Main = function(){
	for(var i=0;i<eyes.length;i++){
		eyes[i].drawRing();
	}
	requestAnimationFrame(Main);
}
Main();

function drawAll(){
		thumbnailManager.clear();
    g.fillStyle = 'black';
    g.fillRect(0,0, c.width, c.height);
		for(var i =0;i<eyes.length;i++){
			eyes[i].draw();
			thumbnailManager.update(i,eyes[i].getThumbnail());
		}
    help.writeHelp();
    colorPainter.draw();
		thumbnailManager.draw();
}

function redraw(){
    c.width = Math.floor($("#width").val());
    c.height = Math.floor($("#height").val());
    eyes = [];
    g.fillStyle = 'black';
    g.fillRect(0,0, c.width, c.height);

}
function swapEyes(one,two){
	var temp1 = eyes[one];
	var temp2 = eyes[two];
	eyes[two] = temp1;
	eyes[one] = temp2;
}
document.addEventListener("keydown", function(e) {
	if(e.keyCode == 72){
		help.toggle();
        drawAll();
		//console.log("h");
	}else if(e.keyCode == 84){
		thumbnailManager.toggle();
	}else if(e.keyCode == 81){
		if(selected != undefined){
			selected.handleQ();
		}
	}else if(e.keyCode == 87){
		if(selected != undefined){
			selected.handleW();
		}
	}else if(e.keyCode == 8){
		e.preventDefault();
		eyes.splice(selectedIndex,1);
        drawAll();
			
	}else if(e.keyCode == 65){
        if(selected != undefined){
            selected.handleA();
        }
    }else if(e.keyCode == 83){
        if(selected != undefined){
            selected.handleS();
        }
    }else if(e.keyCode == 90){
        if(selected != undefined){
            selected.handleZ();
        }
    }else if(e.keyCode == 88){
        if(selected != undefined){
            selected.handleX();
        }
    }else if(e.keyCode == 79) {
        help.increaseFont();
        drawAll();

    }else if(e.keyCode == 80) {
        help.decreaseFont();
        drawAll();
    }else if(e.keyCode == 67) {
        colorPainter.toggle();
        drawAll();
    }else if(e.keyCode == 69) {
        if(selected != undefined){
            selected.handleE();
        }
    } else if(e.keyCode == 68) {
        if(selected != undefined){
            selected.handleD();
        }
    }else if(e.keyCode == 82){
        if(selected != undefined){
            selected.handleR();
        }
    }else if(e.keyCode == 77) {
        $("#config").toggle();
        $("#wholePage").toggle();
				showingMoreInfo = !showingMoreInfo;
				thumbnailManager.toggle();
				help.toggle();
    }else{
		//console.log(e.keyCode);
	}
});
document.addEventListener("mousedown", function(e){
    if(e.which != 3) {
				if(thumbnailManager.testMouse(e.pageX,e.pageY)){
					console.log("selecetd Thumb");
					thumbnailManager.handleMouseDown(e.pageX,e.pageY);
					thumbSelect = true;
				}else if(colorPainter.testMouse(e.pageX, e.pageY)){
            $("#colorButton").trigger("click");
        }else {
            for (var i = 0; i < eyes.length; i++) {
                var ret = eyes[i].testMouse(e.pageX, e.pageY);
                if (ret) {
                    selected = eyes[i];
                    help.setGroupTwo(false);
                    selectedIndex = i;
                }
            }
            if (selected != undefined) {
                selected.handleMouseDown(e.pageX, e.pageY);
            } else {
                console.log("should be pushing a new Eye");
                eyes.push(Eye(e.pageX, e.pageY));
            }
            drawAll();
        }
    }
},false);
document.addEventListener("mousemove", function(e){
	e.preventDefault();
	if(selected != undefined){
		selected.handleMouseMove(e.pageX,e.pageY);
        pictureChanged = true;
        drawAll();
	}else if(thumbSelect){
		thumbnailManager.handleMouseMove(e.pageX,e.pageY);	
		drawAll();
	}
},false);
document.addEventListener("mouseup", function(e){
	if(selected != undefined){
		selected.unselect();
		selected = undefined;
		help.setGroupTwo(true);
		drawAll();
		selectedIndex = -1;
	}
	if(thumbSelect){
		thumbSelect = false;
		thumbnailManager.handleMouseUp();
	}
},false);
 window.addEventListener('resize', resizeCanvas, false);
        
        function resizeCanvas() {
                c.width = window.innerWidth;
                c.height = window.innerHeight;
								colorPainter.resize(c.width,c.height);
								$(".left-side-panel").height(c.height);
								$(".right-side-panel").height(c.height);
								drawAll();
        }
