
/**
 * point is a map, contain gl_position :vec4 at lease
 * return color
 */
function frag_main(point) {
    var color = point.varyings.color;
    return color;
}

class ColorWithBuffer {
    constructor(x, y, color, depth) {
        this.s_x = x;
        this.s_y = y;
        this.color = color;
        this.depth = depth;
    }
}

/**
 * return colors
 */
function pixel_shadding(points, width, height) {
    var colorWithBuffers = []
    var counter = 0;
    points.forEach(point => {
        // step 4 shading
        var color = frag_main(point);

        var p = point.gl_Position;
        var v = ndcToScreen(p, width, height);

        // depth check
        var x = v[0];
        var y = v[1];
        var depth = p[2] / p[3];
        colorWithBuffers[counter++] = new ColorWithBuffer(x, y, color, depth);

    });
    return colorWithBuffers;

}