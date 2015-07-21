var HelpData = (function(tName,tDescription){
    var name = tName;
    var description = tDescription;
    var active = false;
    return{
        name: function(){
            return name;
        },
        description: function(){
            return description;
        },
        setActive: function(flag){
            active = flag;
        },
        active: function(){
            return active;
        }

    }
});

function getHelpDataArray(){
    return [
        HelpData("Toggle Help","Press H to toggle tutorial"),
        HelpData("Toggle Color Chooser","Press C to toggle the Color Painter, located on the bottom right."),
				HelpData("Toggle Thumbnail Manager","Press T to toggle the Thumbnail Manager."),

        HelpData("Create an Eye","Click a blank area to create a random new Eye there."),
        HelpData("Select an Eye","Click and hold an Eye's pupil or one of its rings to interact with it."),
        HelpData("Change Color","Click in the circle in the bottom right to change the Color Painter's color."),
        HelpData("Delete Latest Eye","Press backspace to delete the most recently created Eye."),

        HelpData("Move","Move your mouse to move the Eye."),
        HelpData("Scale","Press Q or W to scale this Eye up or down."),
        HelpData("Scale Pupil","Press A or S to scale the pupil up or down."),
        HelpData("Add New Ring","Press E to add a new Ring to this Eye."),
        HelpData("Delete Last Ring","Press D to delete the biggest Ring from this Eye."),
        HelpData("Change Inner Vertices","Press Z or X to increase or decrease the number of vertices of the inner edge of the first ring."),
        HelpData("Delete This Eye","Press backspace to delete this Eye."),
				HelpData("Reset Color Painter","Press R to reset the Color Painter's points."),

        HelpData("Scale Ring","Move your mouse left or right to grow or shrink the size of this ring."),
				HelpData("Increase Gap","Move your mouse up or down to increase or decrease the amount of space between this ring and the previous."),
        HelpData("Delete This Ring","Press D to delete this Ring."),
        HelpData("Change Number of Vertices","Press Q or W to increase or decrease the number of vertices of the outer edge of the selected ring."),
        HelpData("Apply Color","Press A to apply the Color Painter's color to this Ring, shown on the bottom right."),
        HelpData("Sample Color","Press S to sample this Ring's color."),
				
				HelpData("Rearrange Ordering of Eyes","Click and drag a thumbnail up or down to rearrange the order of the Eyes."),

        HelpData("Change Font Size","You can press O or P to increase or decrease the tutorial's font size."),
        HelpData("Save","Usually, you can save your image by right-clicking it."),
				HelpData("More Info","Press M for more info!")
    ];
}

 $(".left-side-panel").toggleClass("expanded");
var Help = (function(){
    var helpData = getHelpDataArray();
    helpData[0].setActive(true);
    helpData[1].setActive(true);
    helpData[2].setActive(true);
    var active = true;
    var fontSize = 15;
		var width = 300;
		function writeHelpToSidePanel(){
			var str = "";
			if(active){
				str += "<h1>Help</h1>";
				for (var i = 0; i < helpData.length; i++) {
					if (helpData[i].active()) {
						str += "<p><b>"+helpData[i].name()+"</b>: "+helpData[i].description()+"</p>";
					}
				}
			}
			$(".left-side-panel").html(str);
			$(".left-side-panel").css("background-color",colorPainter.getColor());
			$(".left-side-panel p").css("font-size",fontSize);
		}
    function writeHelp(){
				if(true){
					writeHelpToSidePanel();
				}
    }
    function setHelpData(name,state){
        if (active) {
            for (var i = 0; i < helpData.length; i++) {
                if (helpData[i].name() == name) {
                    helpData[i].setActive(state);
                }else{

                }
            }
        }
        writeHelp();
    }
    return {
        setHelpData: function(name,state) {
            setHelpData(name,state);
        },
        enable: function(){
            active = true;
        },
        disable: function(){
            active = false;
        },
        toggle: function(){
            active = !active && !showingMoreInfo;
						if(!active){
							$(".left-side-panel").html("");
						}else{
							writeHelp();
						}
	  					$(".left-side-panel").toggleClass("expanded",active);
						
        },
        writeHelp: function(){
            writeHelp();
        },
        increaseFont: function(){
            fontSize *= 1.2;
        },
        decreaseFont: function(){
            fontSize /= 1.2;
            fontSize = Math.round(fontSize);
        },
        setGroupOne: function(flag){
            setHelpData("Toggle Help",flag);
            setHelpData("Toggle Color Chooser",flag);
						setHelpData("Toggle Thumbnail Manager",flag);
        },
        setGroupTwo: function(flag){
            setHelpData("Create an Eye",flag);
            setHelpData("Select an Eye",flag);
            setHelpData("Change Color",flag);
            setHelpData("Delete Latest Eye",flag);
        },
        setGroupThree: function(flag){
            setHelpData("Move",flag);
            setHelpData("Scale",flag);
            setHelpData("Scale Pupil",flag);
            setHelpData("Add New Ring",flag);
            setHelpData("Delete Last Ring",flag);
            setHelpData("Change Inner Vertices",flag);
            setHelpData("Delete This Eye",flag);
            setHelpData("Reset Color Painter",flag);
        },
        setGroupFour: function(flag){
            setHelpData("Scale Ring",flag);
            setHelpData("Delete This Ring",flag),
            setHelpData("Change Number of Vertices",flag);
            setHelpData("Apply Color",flag);
            setHelpData("Sample Color",flag);
            setHelpData("Increase Gap",flag);
				},
				setThumbnailGroup(flag){
					setHelpData("Rearrange Ordering of Eyes",flag);
				},
        setGroupFive: function(flag){
            setHelpData("Change Font Size",flag);
            setHelpData("Save",flag);
            setHelpData("More Info",flag);
        }
    }

});

