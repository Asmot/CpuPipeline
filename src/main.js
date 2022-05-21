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

    // step 2.0  triangle_processing
    let triangles = triangle_processing(points_processing,indeices, PrimitiveTypeTriangles);
    
    // step 3.0  rasterizer
    let triangles_interpolating = rasterizer_processing(triangles, width, height);

    // culling 3.1
    let triangles_culling = culling(triangles_interpolating);

    triangles_culling.forEach(point => {
        // step 4 shading
        var color = frag_main(point);

        var p = point.gl_Position;
        var v = ndcToScreen(p, width, height);
        frameBuffer.changePosValue(v[0], v[1], color)
    });

    array_to_frame(ctx, frameBuffer)
}

main();