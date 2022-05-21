// generate triangles point
// 


function getVec3(attributeData, attributeStride, index) {
    return vec3.fromValues(
        attributeData[attributeStride * index + 0],
        attributeData[attributeStride * index + 1],
        attributeData[attributeStride * index + 2]
    )
}


/**
 * shader vert main, return gl_Position
 * @param {*} attrItem each attribuet array 
 * @param {*} uniforms 
 * @returns {gl_Position : vec4, varyings : {}}
 */
function vert_main(attrItemArray, uniforms) {
    const aVert = vec4.fromValues(
        attrItemArray[0],
        attrItemArray[1],
        attrItemArray[2],
        1
    );
    let mvpMat = mat4.create();
    mat4.multiply(mvpMat, uniforms.projectionMatrix, uniforms.viewMatrix);
    let position = transformMat4Triangle(aVert, mvpMat)

    return {gl_Position : position, varyings : {}};
}


/**
 * 1. get each pos from attribute data
 * 2. call vert main in shader, projection each position
 * @param {*} attributeData 
 * @param {*} attributeStride 
 * @param {*} uniforms 
 * @returns 
 */
function vert_processing(attributeData, attributeStride, uniforms) {
    const length = attributeData.length;

    var result = [];
    var counter = 0;
    for (let index = 0; index < attributeData.length; index += attributeStride) {
        var new_arr = [];
        for (let j = 0; j < attributeStride; j++) {
            new_arr[j] = attributeData[index + j];
        }
        result[counter++] = vert_main(new_arr, uniforms)
    }
    return result;
   
}

function primitiveSetup(attributeData, attributeStride, attributeType, indexData, type){
  
}
