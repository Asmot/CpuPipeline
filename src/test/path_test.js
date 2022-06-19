

/**
 *  canvas中心当成圆心，向上是y轴正方形
 */
function draw_pdf() {
    clearColor()

    const OFFSET = width / 2;

    var samples = pdf_sephere(controls.pdf_sample_count);
    samples.forEach(p => {
        // x y z is normalize range is [-1, 1]
        var x = p[0] * OFFSET;
        var y = p[1] * OFFSET;
        var res = xyToPixel(x, y, width, height)
        setColor("#FF0000")
        drawPoint(res.x, res.y, 2, 2)
    });

    var plane = function(x){return 0}; // z =0, y =0


    // draw plane 
    for (let x = -OFFSET; x < OFFSET; x++) {
        var y = plane(x);
        var res = xyToPixel(x, y, width, height)
        setColor("#000000")
        drawPoint(res.x, res.y, 2, 2)
    }
    
  

}


function drwa_random_sephere() {
    clearColor()

    const OFFSET = width / 2;
   
    var plane = function(x){return x}; // z =0, y = x
    var planeNormal = vec3.fromValues(-1,1,0);

    vec3.normalize(planeNormal, planeNormal);

    // draw plane 
    for (let x = -OFFSET; x < OFFSET; x++) {
        var y = plane(x);
        var res = xyToPixel(x, y, width, height)
        setColor("#000000")
        drawPoint(res.x, res.y, 2, 2)
    }

    for (let i = 0 ; i < controls.random_sephere_count; i ++) {
        var dir = random_sephere(planeNormal);

        var x = dir[0] * OFFSET;
        var y = dir[1] * OFFSET;
        var res = xyToPixel(x, y, width, height)
        setColor("#FF0000")
        drawPoint(res.x, res.y, 2, 2)
    }
    
  
}