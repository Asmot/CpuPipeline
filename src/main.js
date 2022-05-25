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

// init assets
var marryAssetDesc = new AssetKey("assets/marry/","Marry");
var assetsManager = new AssetsManager();
assetsManager.addMtlPath(marryAssetDesc)

var shader = new BasicShader();
var textureShader = new TextureShader();
var phongShader = new PhongShader();


// draw mtl obj
function drawMtl(frameBuffer, assetDesc) {
    var modelMat = mat4.create();
    const scale = 100;
    mat4.translate(modelMat, modelMat, [0, -100, 0]);
    mat4.scale(modelMat, modelMat, [scale,scale,scale]);


    var bufferData = assetsManager.getMtlBuffer(assetDesc);
    phongShader.uniforms.uTexture = bufferData.texture;
    phongShader.uniforms.uModelMatrix = modelMat;
    draw(frameBuffer, bufferData, phongShader);
}

// main render
function main() {
    var frameBuffer = new FrameBuffer(imgData, width, height, new Color(201/255, 201/255, 201/255));
    let uniforms = {
        viewMatrix : camera.getViewMatrix(),
        projectionMatrix : camera.getProjectionMatrix(),
        uTexture : texture
    }
    shader.uniforms = uniforms;
    textureShader.uniforms = uniforms;
    phongShader.uniforms = uniforms;

    // draw(frameBuffer, testData_alix(), shader)
    // draw(frameBuffer, testData_zbuffer(), shader)
    // draw(frameBuffer, testData0(), shader)
    // draw(frameBuffer, testTextureData(), textureShader)
    drawMtl(frameBuffer, marryAssetDesc)

    array_to_frame(ctx, frameBuffer)
    // draw_depth_buffer(ctx, frameBuffer)
}

var onloadAllAssets = main
// after load resource , start main
assetsManager.loadAllAssets(onloadAllAssets);

textureManager.loadTextures()