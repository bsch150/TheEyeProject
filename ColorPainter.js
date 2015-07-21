var ColorPainter = (function(tX,tY,c){
    var x = tX;
    var y = tY;
    var color = c;
    var radius = 20;
    var active = true;
    function distanceTo(otherX,otherY){
        var diffX = otherX - x;
        var diffY = otherY - y;
        var dist = Math.sqrt(((diffX)*(diffX)) + ((diffY)*(diffY)));
        return dist;
    }
    return{
        updateColor: function(newColor){
           $("#colorButton").val(newColor);
            color = newColor;
        },
        getColor: function(){
            return color;
        },
        draw:function(){
          if(active){
              g.beginPath();
              g.arc(x, y, radius, 0, 2 * Math.PI, false);
              g.fillStyle = color;
              g.fill();
              g.strokeStyle = 'white';
              g.stroke();
          }
        },
        testMouse: function(tx,ty){
      		return !(distanceTo(tx,ty) > radius);
        },
        toggle: function(){
          active = !active;
        },
				resize: function(w,h){
					x = w - 60;
					y = h - 60;
					console.log("new (x,y) is ("+x+","+y+")");
			
				}
    }
});
