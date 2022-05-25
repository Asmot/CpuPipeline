
class BasicShader{
    constructor(uniforms) {
        this.uniforms = uniforms;
    }
    vert_main(attrItemValues) {
        let uniforms = this.uniforms;
        // effect by the input data
        const aVert = vec4.fromValues(
            attrItemValues.aVertColor[0],
            attrItemValues.aVertColor[1],
            attrItemValues.aVertColor[2],
            1
        );
        const aColor = vec4.fromValues(
            attrItemValues.aVertColor[3],
            attrItemValues.aVertColor[4],
            attrItemValues.aVertColor[5],
            attrItemValues.aVertColor[6]
        );
        let mvpMat = mat4.create();
        mat4.multiply(mvpMat, uniforms.projectionMatrix, uniforms.viewMatrix);
        let position = transformMat4Triangle(aVert, mvpMat)
        // console.log("vert_main " + aVert +  " => " + position);
        return {gl_Position : position, varyings : {color: aColor}};
    }
    // point is vert_main return
    frag_main(point) {
        var color = point.varyings.color;
        return color;
    }
}

class TextureShader extends BasicShader {
    vert_main(attrItemValues) {
        let uniforms = this.uniforms;
        // effect by the input data
        const aPos = vec4.fromValues(attrItemValues.aPos[0],attrItemValues.aPos[1],attrItemValues.aPos[2],1);
        const aCoord = vec2.fromValues(attrItemValues.aCoord[0],attrItemValues.aCoord[1]);
        let mvpMat = mat4.create();
        mat4.multiply(mvpMat, uniforms.projectionMatrix, uniforms.viewMatrix);
        let position = transformMat4Triangle(aPos, mvpMat)

        return {gl_Position : position, varyings : {texture: aCoord}};
    }
    // point is vert_main return
    frag_main(point) {
        let uniforms = this.uniforms;
        let sampleTexture = uniforms.uTexture;

        var texture = point.varyings.texture;
        return sampleTexture.sample(texture[0], texture[1]);
    }
}