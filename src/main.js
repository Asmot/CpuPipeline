canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
imgData = ctx.getImageData(0,0,width,height);
data = imgData.data;


const vert = [
    -1, -1, 0,
    0, 1, 0,
    1, 1, 0,
    1, 0, 0
];
const vertStride = 3;
const indeices = [0, 1, 2, 0, 2, 3];
const color = new Color(1,0,0,1);

var camera = new Camera(width, height);
camera.update();


// ndc -1 1
function ndcToScreen(p, width, height) {
    return vec2.fromValues(
        (((p[0] + 1) / 2.0 ) * width),
        (((-p[1] + 1) / 2.0 ) * height)
    );
}

function main() {
    var frameBuffer = new FrameBuffer(imgData, width, height, new Color(1, 1, 1, 1));

    let uniforms = {
        viewMatrix : camera.getViewMatrix(),
        projectionMatrix : camera.getProjectionMatrix()
    }
    
    // step 1 primitive setup
    let triangles = primitiveSetup(vert, vertStride, FieldTypeVec3, indeices, PrimitiveTypeTriangles)

    // step 2 culling and clipping
    // triangles = culling(triangles, uniforms)

    triangles.forEach(triangle => {
        // fill triangle by triangle three points
        var v0 = ndcToScreen(triangle.v0, width, height);
        var v1 = ndcToScreen(triangle.v1, width, height);
        var v2 = ndcToScreen(triangle.v2, width, height);

        let trianglePoints = fillTriangle(v0, v1, v2);
        for (let i = 0; i < trianglePoints.length; i ++) {
            let p = trianglePoints[i];
            frameBuffer.changePosValue(p[0], p[1], color)
        }
    });
   
    

    array_to_frame(ctx, frameBuffer)
}

main();