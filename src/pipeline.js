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
    culling(triangles_interpolating);

    // step 4 shading
    let colorWithBuffers = pixel_shadding(triangles_interpolating, width, height);

    // step 4.1 depth-test
    // depthtest(colorWithBuffers, frameBuffer);

    // step 5 to frame
    colorWithBuffers.forEach(item => {
        frameBuffer.changePosValue(item.s_x, item.s_y, item.color)
    });

}