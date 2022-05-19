
var width = 400;
var height = 400;

var vert = [
    vec2(0,0),
    vec2(0,1),
    vec2(1,0)
];
var color = new Color(1,0,0,1);


// ndc -1 1
function ndcToScreen(p, width, height) {
    return vec2(
        (((p.x + 1) / 2.0 ) * width),
        (((-p.y + 1) / 2.0 ) * height)
    );
}

function main() {
    var frameBuffer = new FrameBuffer(width, height, new Color(1, 1, 1, 1));
    
    // fill triangle by triangle three points
    var v0 = ndcToScreen(vert[0], width, height);
    var v1 = ndcToScreen(vert[1], width, height);
    var v2 = ndcToScreen(vert[2], width, height);

    let trianglePoints = fillTriangle(v0, v1, v2);
    for (let i = 0; i < trianglePoints.length; i ++) {
        let p = trianglePoints[i];
        frameBuffer.changePosValue(p.x, p.y, color)
    }
    

    array_to_frame(frameBuffer)
}

main();