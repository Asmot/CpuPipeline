
/**
 * change framebuffer by meshdata and uniforms
 * 
 */
function draw(frameBuffer, meshData, shader) {

    const vert = meshData.vert;
    const vertStride = meshData.vertStride;
    const indeices = meshData.indeices;


    // step 1.0 vertex_processing
    let points_processing = vert_processing(vert, vertStride, shader);

    // step 2.0  triangle_processing
    let triangles = triangle_processing(points_processing,indeices, PrimitiveTypeTriangles);

    // step 3.0  rasterizer
    let triangles_interpolating = rasterizer_processing(triangles, width, height);
    console.log("triangles_interpolating point size " + triangles_interpolating.length);
    // culling 3.1
    // culling(triangles_interpolating);
    console.log("triangles_interpolating culling point size " + triangles_interpolating.length);

    // step 4 shading
    let colorWithBuffers = pixel_shadding(triangles_interpolating, width, height, shader);
    console.log("colorWithBuffers point size " + colorWithBuffers.length);

    // step 4.1 depth-test
    colorWithBuffers = depthtest(colorWithBuffers, frameBuffer);
    console.log("colorWithBuffers point depthtest size " + colorWithBuffers.length);

    // step 5 to frame
    colorWithBuffers.forEach(item => {
        frameBuffer.changePosValue(item.s_x, item.s_y, item.color)
    });

}