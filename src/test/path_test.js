
/**
 *  canvas中心当成圆心，向上是y轴正方形
 */
function draw_pdf() {
    clearColor()

    var samples = pdf_sephere(controls.pdf_sample_count);


    const OFFSET = width / 2;

    
    samples.forEach(p => {
        
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