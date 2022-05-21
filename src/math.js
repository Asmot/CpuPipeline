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
    // const input = vec4.fromValues(p[0], p[1], p[2], p[3]);
    vec4.transformMat4(output, p, mvpMat);
    vec4.scale(output, output, 1 / output[3]);
    return output;
}

const DEGREES_PER_RADIAN = 180 / Math.PI; // 57.29577951308232
const RADIANS_PER_DEGREE = Math.PI / 180; // 0.017453292519943295;

function degreeToRadian(degree){
    return degree * RADIANS_PER_DEGREE;
}

function normalize(vec4Value) {
    return vec4.fromValues(
        vec4Value[0]/ vec4Value[3],
        vec4Value[1]/ vec4Value[3],
        vec4Value[2]/ vec4Value[3],
        1
    );
}

// ndc -1 1
function ndcToScreen(ndcP, width, height) {
    let p = normalize(ndcP);
    return vec4.fromValues(
        Math.floor((((p[0] + 1) / 2.0 ) * width) + 0.5),
        Math.floor((((-p[1] + 1) / 2.0 ) * height) + 0.5),
        p[2],
        p[3]
    );
}

function screenToNdc(x, y, width, height) {
    return vec2.fromValues(
        (2 * x - width) / width,
        - (2 * y - height) / height
    );
}

const PrimitiveTypeTriangles = 0
const FieldTypeVec3 = 0