
function cross(a, b, c) {
    return (b[0] - a[0]) * -(c[1] - a[1]) - -(b[1] - a[1]) * (c[0] - a[0]);
}

function IsPointInTriangle4(a, b, c, p){
    var PA = minus(a, p);
    var PB = minus(b, p);
    var PC = minus(c, p);
    let t1 = coross_product(PA, PB);
    let t2 = coross_product(PB, PC);
    let t3 = coross_product(PC, PA);
    return t1*t2 >= 0 && t1*t3 >= 0;
}

function IsPointAtSameSideOfLine(m, n, a, b) {
    let AB = minus(b, a);
    let AM = minus(m, a);
    let AN = minus(n, a);
    return coross_product(AB, AM) * coross_product(AB, AN) >= 0;
}

function IsPointInTriangle2(a, b, c, p){
    return IsPointAtSameSideOfLine(p, a, b, c) &&
        IsPointAtSameSideOfLine(p, b, a, c) &&
        IsPointAtSameSideOfLine(p, c, a, b);
}


// function screenToNdc(p, width, height) {
//     return vec4.fromValues(
//         (((p[0] + 1) / 2.0 ) * width),
//         (((-p[1] + 1) / 2.0 ) * height),
//         p[2],
//         p[3]
//     );
// }

// (x,y) = α * A + β* B + γ * C
// ABC is the area of triangle
// reutrn [α ,β, γ]
function computeBarycentric2D(x, y, v0, v1, v2){
    var c1 = (x*(v1[1] - v2[1]) + (v2[0] - v1[0])*y + v1[0]*v2[1] - v2[0]*v1[1]) / (v0[0]*(v1[1] - v2[1]) + (v2[0] - v1[0])*v0[1] + v1[0]*v2[1] - v2[0]*v1[1]);
    var c2 = (x*(v2[1] - v0[1]) + (v0[0] - v2[0])*y + v2[0]*v0[1] - v0[0]*v2[1]) / (v1[0]*(v2[1] - v0[1]) + (v0[0] - v2[0])*v1[1] + v2[0]*v0[1] - v0[0]*v2[1]);
    var c3 = (x*(v0[1] - v1[1]) + (v1[0] - v0[0])*y + v0[0]*v1[1] - v1[0]*v0[1]) / (v2[0]*(v0[1] - v1[1]) + (v1[0] - v0[0])*v2[1] + v0[0]*v1[1] - v1[0]*v0[1]);
    return [c1, c2, c3];
}

// (x,y) = α * A + β* B + γ * C
function interpolate(value0, value1, value2,  abc) {
    let alpha = abc[0];
    let beta = abc[1];
    let gamma = abc[2];
    if (value0.constructor === Float32Array) {
        var res = [];
        for (let index = 0; index < value0.length; index++) {
            const element0 = value0[index];
            const element1 = value1[index];
            const element2 = value2[index];
            res[index] = alpha * element0 + beta * element1 + gamma * element2;
        }
        return res;
    }
    
    return alpha * value0 + beta * value1 + gamma * value2;
}

function normalize(vec4Value) {
    return vec4.fromValues(
        vec4Value[0]/ vec4Value[3],
        vec4Value[1]/ vec4Value[3],
        vec4Value[2]/ vec4Value[3],
        1
    );
}

// find the all point form triangle three point
// y toward down
// return an array
function fillTriangle(triangle, width, height) {
    
    var v0 = triangle.v0.gl_Position;
    var v1 = triangle.v1.gl_Position;
    var v2 = triangle.v2.gl_Position

    v0 = normalize(v0);
    v1 = normalize(v1);
    v2 = normalize(v2);
 
    var minX = Math.min(v0[0], v1[0], v2[0]);
    var maxX = Math.max(v0[0], v1[0], v2[0]);
    var minY = Math.min(v0[1], v1[1], v2[1]);
    var maxY = Math.max(v0[1], v1[1], v2[1]);
    var output = new Array();
    var p = {};  
    
    var x_step = 1 / width;
    var y_step = 1 / height;

    for (var y = minY; y < maxY; y += y_step) {
        for (var x = minX; x < maxX; x += x_step) {
            p[0] = x + 0.5 * x_step; 
            p[1] = y + 0.5 * y_step;

            // if any point in the left of line, point is outside of triangle
            // if (cross(v1, v2, p) < 0 || cross(v2, v0, p) < 0 || cross(v0, v1, p) < 0) {
            // if (!IsPointInTriangle2(v0, v1, v2, p)) {
            if (!IsPointInTriangle4(v0, v1, v2, p)) {
                continue; 
            }
            
            var abc = computeBarycentric2D(x, y, v0, v1, v2);

            let z = interpolate(v0[3], v1[3], v2[3], abc);
            // let w = interpolate(v0.w, v1.w, v2.w, abc);
            let w = 1;
            var position = vec4.fromValues(x, y, z, w)

            var varyingsValues = {};
            for (const key in triangle.v0.varyings) {
                const varyingValue0 = triangle.v0.varyings[key];
                const varyingValue1 = triangle.v1.varyings[key];
                const varyingValue2 = triangle.v2.varyings[key];

                const varyingValue = interpolate(varyingValue0, varyingValue1, varyingValue2, abc);
            
                varyingsValues[key] = varyingValue;
            }

            output.push({
                gl_Position : position,
                varyings : varyingsValues
            });
        }
    }
    return output;
}

/**
 * fill the triangles inner point
 * interpolate all value in triangle
 * @param {*} triangles 
 * @param {*} width 
 * @param {*} height 
 */
function rasterizer_processing(triangles, width, height) {
    triangles_interpolating = []
    counter = 0;
    triangles.forEach(triangle => {
        // fill triangle by triangle three points
        let trianglePoints = fillTriangle(triangle, width, height);
        trianglePoints.forEach(item =>{
            triangles_interpolating[counter++] = item;
        });
    });
    return triangles_interpolating;
}

