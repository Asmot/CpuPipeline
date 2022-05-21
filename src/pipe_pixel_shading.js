
/**
 * point is a map, contain gl_position :vec4 at lease
 * return color
 */
function frag_main(point) {
    var color = point.varyings.color;
    return color;
}