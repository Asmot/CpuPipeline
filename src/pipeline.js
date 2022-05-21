// ndc -1 1
function ndcToScreen(p, width, height) {
    return vec4.fromValues(
        Math.floor((((p[0] + 1) / 2.0 ) * width) + 0.5),
        Math.floor((((-p[1] + 1) / 2.0 ) * height) + 0.5),
        p[2],
        p[3]
    );
}

/**
 * change framebuffer by meshdata and uniforms
 * 
 */
function draw(frameBuffer, meshData, uniforms) {

    const vert = meshData.vert;
    const vertStride = meshData.vertStride;
    const indeices = meshData.indeices;


    // step 1.0 vertex_processing
    let points_processing = vert_processing(vert, vertStride, uniforms);

    // step 2.0  triangle_processing
    let triangles = triangle_processing(points_processing,indeices, PrimitiveTypeTriangles);

    // step 3.0  rasterizer
    let triangles_interpolating = rasterizer_processing(triangles, width, height);

    // culling 3.1
    let triangles_culling = culling(triangles_interpolating);

    triangles_culling.forEach(point => {
        // step 4 shading
        var color = frag_main(point);

        var p = point.gl_Position;
        var v = ndcToScreen(p, width, height);
        frameBuffer.changePosValue(v[0], v[1], color)
    });

}