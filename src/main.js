canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
imgData = ctx.getImageData(0,0,width,height);
data = imgData.data;


const vert = [
    -100, -100, 0, 1, 0, 0, 1,
     0,    100, 0, 0, 1, 0, 1,
     500,  500, 0, 1, 1, 0, 1,
     100,  0,   0, 0, 0, 1, 1,
];
const vertStride = 7;
const indeices = [0, 1, 3, 0, 2, 3];
const color = new Color(1,0,0,1);
const color1 = new Color(1,0,0,1);

var camera = new Camera(width, height);
camera.position(0, 0, -10);
camera.update();


// ndc -1 1
function ndcToScreen(p, width, height) {
    return vec4.fromValues(
        Math.floor((((p[0] + 1) / 2.0 ) * width) + 0.5),
        Math.floor((((-p[1] + 1) / 2.0 ) * height) + 0.5),
        p[2],
        p[3]
    );
}

function main() {
    var frameBuffer = new FrameBuffer(imgData, width, height, new Color(1, 1, 1, 1));

    let uniforms = {
        viewMatrix : camera.getViewMatrix(),
        projectionMatrix : camera.getProjectionMatrix()
    }
    
    // step 1.0 vertex_processing
    let points_processing = vert_processing(vert, vertStride, uniforms);

    // step 1.1  triangle_processing
    let triangles = triangle_processing(points_processing,indeices, PrimitiveTypeTriangles);
    
    // step 2.0  rasterizer
    let triangles_interpolating = rasterizer_processing(triangles, width, height);

    // step 1 primitive setup
    // let triangles = primitiveSetup(points_processing, FieldTypeVec3, indeices, PrimitiveTypeTriangles)

    // // step 2 culling and clipping
    // triangles = culling(triangles, uniforms)

    // 
    triangles_interpolating.forEach(point => {
        var color = frag_main(point);

        var p = point.gl_Position;
        var v = ndcToScreen(p, width, height);
        frameBuffer.changePosValue(v[0], v[1], color)
    });
    // triangles.forEach(triangle => {
    //     // fill triangle by triangle three points
    //     var v0 = ndcToScreen(triangle.v0, width, height);
    //     var v1 = ndcToScreen(triangle.v1, width, height);
    //     var v2 = ndcToScreen(triangle.v2, width, height);

    //     let trianglePoints = fillTriangle(v0, v1, v2);
    //     for (let i = 0; i < trianglePoints.length; i ++) {
    //         let p = trianglePoints[i];
    //         frameBuffer.changePosValue(p[0], p[1], color)
    //     }
    // });
   
    

    array_to_frame(ctx, frameBuffer)
}

main();