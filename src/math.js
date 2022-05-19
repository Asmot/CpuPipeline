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
    return vec2(a.x - b.x, a.x - b.y);
}

function dot_product(a, b) {
    return a.x * b.x + a.y * b.y;
}