function draw_fresnel() {
    clearColor()
    for (let index = 0; index < 180; index++) {
        var rad = degreeToRadian(index);
        var dir = [Math.cos(rad), 0, Math.sin(rad)];
        var N = [0,0,1];
        var ior = 0.4;
        var res = fresnel(dir, N, controls.fresnel_ior);
        // console.log("fresnel cal " + index + " " + N + " " + ior + " => " + res);

        var x = width * index / 180;
        var y = height - height * res;
        // console.log("fresnel cal " + x + " " + y);

        drawPoint(x, y, 2, 2)
    }
}