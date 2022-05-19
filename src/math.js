// vector and matrix

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function vec2(x_value, y_value) {
    return {x: x_value, y: y_value}
}

function minus(a, b) {
    return vec2(a.x - b.x, a.y - b.y);
}

// V1(x1, y1) X V2(x2, y2) = x1y2 – y1x2
function coross_product(a, b) {
    return a.x * b.y - a.y * b.x;
}

//V1( x1, y1)   V2(x2, y2) = x1*x2 + y1*y2
function dot_product(a, b) {
    return a.x * b.x + a.y * b.y;
}