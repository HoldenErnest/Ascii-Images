// Holden Ernest

var fSize = 6; // size of the text
var threshhold = 10; // there is a slider for this in preview
var neighborCheck = 0;

var shading = "~~~.:-=+*#%@"
var shadeArr = [];
var theImg;
var video;

var theDiv;

var slider1 = document.getElementById("range1");

var doLiveVideo = false; // togggle between live feed and static image

function preload() {
    // get image to convert
    if (!doLiveVideo)
      theImg = loadImage("doge.png");
    
    theDiv = document.getElementById("canvas");
    
}

function setup() {
    setStyles();
    stringToArray(shading);
    noCanvas();
  
    video = createCapture(VIDEO);
    video.size(150,100);
    video.hide();
  
    // get image to convert
  if (!doLiveVideo) {
    theImg.resize(300,300);
    run();
    printToAscii(theImg);
  }
}
function draw() {
    // get video to convert
    if (doLiveVideo)
    outlines(video);
}

function run() {
  // get image to convert
  if (!doLiveVideo)
    outlines(theImg);
}


function printToAscii(input) {
    input.loadPixels();
    theDiv.innerHTML = "";
    for (var i = 0; i < input.height; i++) {
        var row = "";
        for (var j = 0; j < input.width; j++) {
            const index = (j + i * input.width) * 4;
            row += shadeArr[round((getAvgPixel(input, index)/255)*(shadeArr.length - 1))];
        }
        theDiv.innerHTML += row + "<br>";
    }
}

function outlines(input) {
    input.loadPixels();
    theDiv.innerHTML = "";
    for (var i = 0; i < input.height; i++) {
        var row = "";
        for (var j = 0; j < input.width; j++) {
            const index = (j + (i * input.width)) * 4;
            if (similarNeighbors(input, index)) {
                //row += "·";
              row += shadeArr[round((getAvgPixel(input, index)/255)*(shadeArr.length - 1))];
            } else {
              row += "&nbsp;";
            }
        }
        theDiv.innerHTML += row + "<br>";
    }
}

function getAvgPixel (input, index) {
    const r = input.pixels[index];
    const g = input.pixels[index+1];
    const b = input.pixels[index+2];
    return (r+g+b)/3;
}

function similarNeighbors (input, index) {
    var checks = 0;
    var totalNeighbors = 0;
    for(var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            if (x != 0 && y != 0) {
              //check boundries
                if ((index+x)%(input.width*4) > 0 && (index+x)%(input.width*4) < (input.width-1)*4) {
                //difference between current greyscale vs neighbors greyscale
                if (Math.abs(getAvgPixel(input, index + (x + (y*input.width)) * 4) - getAvgPixel(input, index)) >= threshhold ) {
                    checks++;
                }
                totalNeighbors++;
            }
            }
        }
    }
    return round(checks/(totalNeighbors-2)) == 1;//(-2 tested best)
}

slider1.oninput = function() {
    threshhold = this.value;
  console.log(threshhold);
    run();
}

//default styles of the DOM
function setStyles (){
    document.body.style.fontSize = fSize + "pt";
    document.body.style.lineHeight = (fSize-round(fSize/4)) + "pt";
}

//returns a given string to an array, in this case so we can access each character easily
function stringToArray(text) {
    for(var i = 0; i < text.length; i++) {
        shadeArr[i] = text.substring(i,i + 1);
        if (text.substring(i,i+1) == "~") {
            shadeArr[i] = "&nbsp;";
        }
    }
}

//legacy -- prints an array by each element
function printArray(ar) {
    for (var i = 0; i < ar.length; i++) {
        console.log(ar[i]);
    }
}
