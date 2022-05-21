
function transformMat4Triangle(p, mvpMat) {
    const output = vec4.create();
    const input = vec4.fromValues(p[0], p[1], p[2], p[3]);
    vec4.transformMat4(output, input, mvpMat);
    vec4.scale(output, output, 1 / output[3]);
    return output;
    
}


// projection and culipping
function culling(triangles, uniforms) {
    let viewMatrix = uniforms.viewMatrix;
    let projectionMatrix = uniforms.projectionMatrix;

    triangles.forEach(triangle => {
        
        let mvpMat = mat4.create();
        // mat4.translate(this.cameraModelMat, this.cameraModelMat, this.pos);

        mat4.multiply(mvpMat, projectionMatrix, viewMatrix);

        triangle.v0 = transformMat4Triangle(triangle.v0, mvpMat);
        triangle.v1 = transformMat4Triangle(triangle.v1, mvpMat);
        triangle.v2 = transformMat4Triangle(triangle.v2, mvpMat);
    });
    return triangles;

}