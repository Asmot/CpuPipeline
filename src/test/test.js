console.log(solveQuadratic(1, -2, 1) + " solveQuadratic x2 - 2x + 1 = 0 ===> " + "true 1 1")
console.log(solveQuadratic(1, -8, 15) + " solveQuadratic x2 - 8x + 15 = 0 ===> " + "true 3 5")

log_mesh_area()

canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
var defaultColor = '#FFFFFF';
var fillColor = '#FF0000'
ctx.fillStyle = fillColor

function setColor(c) {
    ctx.fillStyle = c
}

function drawPoint(x, y, w = 1, h = 1) {
   ctx.fillRect(x, y, w, h);
}
function clearColor() {
    ctx.fillStyle = defaultColor
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = fillColor;
}

var controls = new function() {
    this.fresnel_ior = 0.5;
    this.reflect_light_x = 100;
    this.reflect_light_y = 100;
    this.refract_light_x = 100;
    this.refract_light_y = 100;
    this.refract_ior = 1.3;
    this.pdf_sample_count = 100;
    this.pdf_mesh_sample_count = 100;
    this.random_sephere_count = 100;
};

function createGUI() {
    const gui = new dat.gui.GUI();
    var fresnelFolder = gui.addFolder('Fresnel');
    fresnelFolder.add(controls, "fresnel_ior",0, 1).onChange(draw_fresnel);

    var reflectFolder = gui.addFolder('Reflect');
    reflectFolder.add(controls, "reflect_light_x",-width / 2, width /2).onChange(draw_reflect);
    reflectFolder.add(controls, "reflect_light_y",-height / 2, height /2).onChange(draw_reflect);

    var refractFolder = gui.addFolder('Refract');
    refractFolder.add(controls, "refract_light_x",-width / 2, width /2).onChange(draw_refract);
    refractFolder.add(controls, "refract_light_y",-height / 2, height /2).onChange(draw_refract);
    refractFolder.add(controls, "refract_ior",0, 2).onChange(draw_refract);

    var refractFolder = gui.addFolder('Path');
    refractFolder.add(controls, "pdf_sample_count",1, 1000).onChange(draw_pdf);
    refractFolder.add(controls, "pdf_mesh_sample_count",1, 1000).onChange(drawMeshPdfSample);
    refractFolder.add(controls, "random_sephere_count",1, 1000).onChange(drwa_random_sephere);

    gui.open();
  
}
createGUI();





draw_reflect()