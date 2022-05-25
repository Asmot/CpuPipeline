canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
imgData = ctx.getImageData(0,0,width,height);
data = imgData.data;


const meshData = testData_alix();
// const meshData = testData0();

var camera = new Camera(width, height);
camera.position(0, 0, 100);
camera.update();

var textureManager = new TextureManager();
var texture = new Texture("assets/marry/MC003_Kozakura_Mari.png");
textureManager.addTexture(texture);



// main render
function main() {
    var frameBuffer = new FrameBuffer(imgData, width, height);
    let uniforms = {
        viewMatrix : camera.getViewMatrix(),
        projectionMatrix : camera.getProjectionMatrix(),
        uTexture : texture
    }

    var shader = new BasicShader(uniforms);
    var textureShader = new TextureShader(uniforms);
    
    draw(frameBuffer, testData_alix(), shader)
    // draw(frameBuffer, testData_zbuffer(), shader)
    // draw(frameBuffer, testData0(), shader)
    draw(frameBuffer, testTextureData(), textureShader)

    array_to_frame(ctx, frameBuffer)
    // draw_depth_buffer(ctx, frameBuffer)
}

// after load resource , start main
var assetsManager = new AssetsManager();
assetsManager.addMtlPath("assets/marry/","Marry")
assetsManager.loadAllAssets();

var onload = main
textureManager.loadTextures(onload)