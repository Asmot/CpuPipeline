
function xyToPixel(x, y, width, height) {
    var p_x = x + (width / 2)
    var p_y = (height /  2) - y
    return {
        x : p_x,
        y : p_y
    }
}

function drawRay(rayOrig, rayDir, OFFSET,width, height) {
    for (let t = 0; t < OFFSET; t++) {
        var pos = add3(rayOrig, mul3(t, rayDir));
        var res = xyToPixel(pos[0], pos[1], width, height)
        drawPoint(res.x, res.y, 2, 2)
    }
}

/**
 *  canvas中心当成圆心，向上是y轴正方形
 */
function draw_reflect() {
    clearColor()

    const OFFSET = width / 2;

    var plane = function(x){return 0}; // z =0, y =0
    // 垂直于y=0的平面
    var normal = vec3.fromValues(0, 1, 0);

    var rayOrig = vec3.fromValues(controls.reflect_light_x, controls.reflect_light_y, 0);
    var hitPoint = vec3.fromValues(0,0,0);
    var rayDir = minus3(hitPoint, rayOrig);
    vec3.normalize(rayDir, rayDir);


    var reflectRay = reflect3(rayDir, normal)
    vec3.normalize(reflectRay, reflectRay);

    // draw plane 
    for (let x = -OFFSET; x < OFFSET; x++) {
        var y = plane(x);
        var res = xyToPixel(x, y, width, height)
        setColor("#000000")
        drawPoint(res.x, res.y, 2, 2)
    }
    
    var distance = vec3.distance(hitPoint, rayOrig);

    // draw ray
    setColor("#FF0000")
    drawRay(rayOrig, rayDir, distance, width, height);
    // draw start
    var res = xyToPixel(rayOrig[0], rayOrig[1], width, height)
    drawPoint(res.x, res.y, 5, 5)

    setColor("#00FF00")
    drawRay(hitPoint, reflectRay, distance, width, height);

    // draw hit
    var res = xyToPixel(hitPoint[0], hitPoint[1], width, height)
    drawPoint(res.x, res.y, 2, 2)

}

function draw_refract() {
    clearColor()

    const OFFSET = width / 2;

    var plane = function(x){return 0}; // z =0, y =0
    // 垂直于y=0的平面
    var normal = vec3.fromValues(0, 1, 0);

    var rayOrig = vec3.fromValues(controls.refract_light_x, controls.refract_light_y, 0);
    var hitPoint = vec3.fromValues(0,0,0);
    var rayDir = minus3(hitPoint, rayOrig);
    vec3.normalize(rayDir, rayDir);


    var refractRay = refract(rayDir, normal, controls.refract_ior)
    vec3.normalize(refractRay, refractRay);

    // draw plane 
    for (let x = -OFFSET; x < OFFSET; x++) {
        var y = plane(x);
        var res = xyToPixel(x, y, width, height)
        setColor("#000000")
        drawPoint(res.x, res.y, 2, 2)
    }
    
    var distance = vec3.distance(hitPoint, rayOrig);

    // draw ray
    setColor("#FF0000")
    drawRay(rayOrig, rayDir, distance, width, height);
    // draw start
    var res = xyToPixel(rayOrig[0], rayOrig[1], width, height)
    drawPoint(res.x, res.y, 5, 5)

    setColor("#00FF00")
    drawRay(hitPoint, refractRay, distance, width, height);

    // draw hit
    var res = xyToPixel(hitPoint[0], hitPoint[1], width, height)
    drawPoint(res.x, res.y, 2, 2)

}