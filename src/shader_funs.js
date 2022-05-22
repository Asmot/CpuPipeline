
class BasicShader{
    constructor(uniforms) {
        this.uniforms = uniforms;
    }
    vert_main(attrItemArray) {
        let uniforms = this.uniforms;
        const aVert = vec4.fromValues(
            attrItemArray[0],
            attrItemArray[1],
            attrItemArray[2],
            1
        );
        const aColor = vec4.fromValues(
            attrItemArray[3],
            attrItemArray[4],
            attrItemArray[5],
            attrItemArray[6]
        );
        let mvpMat = mat4.create();
        mat4.multiply(mvpMat, uniforms.projectionMatrix, uniforms.viewMatrix);
        let position = transformMat4Triangle(aVert, mvpMat)
        console.log("vert_main " + aVert +  " => " + position);
        return {gl_Position : position, varyings : {color: aColor}};
    }
    // point is vert_main return
    frag_main(point) {
        var color = point.varyings.color;
        return color;
    }
}

class TextureShader extends BasicShader {
    vert_main(attrItemArray) {
        let uniforms = this.uniforms;
        const aVert = vec4.fromValues(attrItemArray[0],attrItemArray[1],attrItemArray[2],1);
        const aTex = vec2.fromValues(attrItemArray[3],attrItemArray[4]);
        let mvpMat = mat4.create();
        mat4.multiply(mvpMat, uniforms.projectionMatrix, uniforms.viewMatrix);
        let position = transformMat4Triangle(aVert, mvpMat)

        return {gl_Position : position, varyings : {texture: aTex}};
    }
    // point is vert_main return
    frag_main(point) {
        let uniforms = this.uniforms;
        var texture = point.varyings.texture;
        return uniforms.sampleTexture.sample(texture);
    }
}