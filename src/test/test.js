// console.log(solveQuadratic(1, -2, 1) + " solveQuadratic x2 - 2x + 1 = 0 ===> " + "true 1 1")
// console.log(solveQuadratic(1, -8, 15) + " solveQuadratic x2 - 8x + 15 = 0 ===> " + "true 3 5")



canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
var defaultColor = '#FFFFFF';
var fillColor = '#FF0000'
ctx.fillStyle = fillColor


function drawPoint(x, y, w = 1, h = 1) {
   ctx.fillRect(x, y, w, h);
}
function clearColor() {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            ctx.fillStyle = defaultColor
            ctx.fillRect(x, y, 1, 1);
        }
    }
    ctx.fillStyle = fillColor;
}


var controls = new function() {
    this.fresnel_ior = 0.5;
};

function createGUI() {
    const gui = new dat.gui.GUI();
    var fresnelFolder = gui.addFolder('Fresnel');
    fresnelFolder.add(controls, "fresnel_ior",0, 1).onChange(draw_fresnel);
    
    gui.open();
  
}
createGUI();


function draw_fresnel() {
    clearColor()
    for (let index = 0; index < 180; index++) {
        var rad = degreeToRadian(index);
        var dir = [Math.cos(rad), 0, Math.sin(rad)];
        var N = [0,0,1];
        var ior = 0.4;
        var res = fresnel(dir, N, controls.fresnel_ior);
        // console.log("fresnel cal " + index + " " + N + " " + ior + " => " + res);

        var x = width * index / 180;
        var y = height - height * res;
        // console.log("fresnel cal " + x + " " + y);

        drawPoint(x, y, 2, 2)
    }
}


draw_fresnel()