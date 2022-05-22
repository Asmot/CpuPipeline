
class BasicShader{
    constructor() {
        this.vert_main = function(attrItemArray, uniforms) {
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
        this.frag_main = function(point) {
            var color = point.varyings.color;
            return color;
        }
    }
}