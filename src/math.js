// vector and matrix

// const { vec2 } = require("gl-matrix");

function minus(a, b) {
    return vec2.fromValues(a[0] - b[0], a[1] - b[1]);
}

// V1(x1, y1) X V2(x2, y2) = x1y2 – y1x2
function coross_product(a, b) {
    return a[0] * b[1] - a[1] * b[0];
}

//V1( x1, y1)   V2(x2, y2) = x1*x2 + y1*y2
function dot_product(a, b) {
    return a[0] * b[0] + a[1] * b[1];
}

function transformMat4Triangle(p, mvpMat) {
    const output = vec4.create();
    const input = vec4.fromValues(p[0], p[1], p[2], p[3]);
    vec4.transformMat4(output, input, mvpMat);
    vec4.scale(output, output, 1 / output[3]);
    return output;
}


const PrimitiveTypeTriangles = 0
const FieldTypeVec3 = 0