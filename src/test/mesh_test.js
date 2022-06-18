

function log_mesh_area0() {
    var v0 = vec3.fromValues(0,0,0);
    var v1 = vec3.fromValues(1,1,0);
    var v2 = vec3.fromValues(1,0,0);
    var mesh = new MeshTriangle(
        [v0, v1, v2],
        [0,1,2],
        []
    )
    console.log(v0 + "/" +  v1 + "/" + v2 + " area " + mesh.getArea())
}

function log_mesh_area1() {
    var mesh = new MeshTriangle(
        [
            vec3.fromValues(0,0,0),
            vec3.fromValues(1,0,0),
            vec3.fromValues(1,1,0),
            vec3.fromValues(0,1,0)
        ],
        [0,1,2, 0, 2, 3],
        []
    )
    console.log(mesh.vertices + " area " + mesh.getArea())
}

function log_mesh_area() {
    
    log_mesh_area0();
    log_mesh_area1();
}

function drawMeshPdfSample() {
    clearColor()

    var mesh = new MeshTriangle(
        [
            vec3.fromValues(-0.5, -0.5,0),
            vec3.fromValues(-0.5, -0.0,0),
            vec3.fromValues(-0.0, +0.5,0),
            vec3.fromValues(+0.5, -0.0,0),
            vec3.fromValues(+0.5, -0.5,0)
        ],
        [0,1,2, 0, 2, 3, 0, 3, 4],
        []
    )

    const OFFSET = width / 2;
    var samples_pos = [];
    for(let i = 0; i < controls.pdf_mesh_sample_count; i ++) {
        var random_sample = mesh.sample_pdf();

        // 光源上的位置 - 物体位置得到光线方向
        // var dir = minus(random_sample.pos, p);
        // vec3.normalize(dir, dir)
        samples_pos[i] = random_sample.pos;
    }

    samples_pos.forEach(p => {
        // x y z is normalize range is [-1, 1]
        var x = p[0] * OFFSET;
        var y = p[1] * OFFSET;
        var res = xyToPixel(x, y, width, height)
        setColor("#FF0000")
        drawPoint(res.x, res.y, 2, 2)
    });

}