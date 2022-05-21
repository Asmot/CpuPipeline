canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
imgData = ctx.getImageData(0,0,width,height);
data = imgData.data;


const meshData = testData_alix();
// const meshData = testData0();

var camera = new Camera(width, height);
camera.position(0, 0, -10);
camera.update();


function main() {
    var frameBuffer = new FrameBuffer(imgData, width, height);

    let uniforms = {
        viewMatrix : camera.getViewMatrix(),
        projectionMatrix : camera.getProjectionMatrix()
    }
    
    draw(frameBuffer, testData_alix(), uniforms)
    draw(frameBuffer, testData_zbuffer(), uniforms)
    // draw(frameBuffer, testData0(), uniforms)

    array_to_frame(ctx, frameBuffer)
}

main();