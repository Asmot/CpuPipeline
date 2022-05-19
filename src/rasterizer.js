
function cross(a, b, c) {
    return (b.x - a.x) * -(c.y - a.y) - -(b.y - a.y) * (c.x - a.x);
}

function IsPointInTriangle4(a, b, c, p){
    var PA = minus(a, p);
    var PB = minus(b, p);
    var PC = minus(c, p);
    let t1 = dot_product(PA, PB);
    let t2 = dot_product(PB, PC);
    let t3 = dot_product(PC, PA);
    return t1*t2 >= 0 && t1*t3 >= 0;
}

function IsPointAtSameSideOfLine(m, n, a, b) {
    let AB = minus(b,a);
    let AM = minus(m, a);
    let AN = minus(n, a);
    return dot_product(AB, AM) * dot_product(AB, AN) >= 0;
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
    var minX = Math.floor(Math.min(v0.x, v1.x, v2.x));
    var maxX = Math.ceil(Math.max(v0.x, v1.x, v2.x));
    var minY = Math.floor(Math.min(v0.y, v1.y, v2.y));
    var maxY = Math.ceil(Math.max(v0.y, v1.y, v2.y));
    var output = new Array();
    var p = {};  
    
    for (var y = minY; y < maxY; y++) {
        for (var x = minX; x < maxX; x++) {
            p.x = x + 0.5; 
            p.y = y + 0.5;

            // if any point in the left of line, point is outside of triangle
            // if (cross(v1, v2, p) < 0 || cross(v2, v0, p) < 0 || cross(v0, v1, p) < 0) {
            // if (!IsPointInTriangle4(v0, v1, v2, p)) {
            if (!IsPointInTriangle2(v0, v1, v2, p)) {
                continue; 
            }
            output.push(vec2(x, y));
        }
    }
    return output;
}