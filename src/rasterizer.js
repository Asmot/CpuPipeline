
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


// find the all point form triangle three point
// y toward down
// return an array
function fillTriangle(v0, v1, v2) {
    var minX = Math.floor(Math.min(v0[0], v1[0], v2[0]));
    var maxX = Math.ceil(Math.max(v0[0], v1[0], v2[0]));
    var minY = Math.floor(Math.min(v0[1], v1[1], v2[1]));
    var maxY = Math.ceil(Math.max(v0[1], v1[1], v2[1]));
    var output = new Array();
    var p = {};  
    
    for (var y = minY; y < maxY; y++) {
        for (var x = minX; x < maxX; x++) {
            p[0] = x + 0.5; 
            p[1] = y + 0.5;

            // if any point in the left of line, point is outside of triangle
            // if (cross(v1, v2, p) < 0 || cross(v2, v0, p) < 0 || cross(v0, v1, p) < 0) {
            // if (!IsPointInTriangle2(v0, v1, v2, p)) {
            if (!IsPointInTriangle4(v0, v1, v2, p)) {
                continue; 
            }
            // console.log(x,y)
            output.push(vec2.fromValues(x, y));
        }
    }
    return output;
}