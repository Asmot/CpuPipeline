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
 * 1. get each pos from attribute data
 * 2. call vert main in shader, projection each position
 * @param {*} attributeData 
 * @param {*} attributeStride 
 * @param {*} uniforms 
 * @returns 
 */
function vert_processing(attributeData, attributeStride, shader) {
    const length = attributeData.length;

    var result = [];
    var counter = 0;
    for (let index = 0; index < attributeData.length; index += attributeStride) {
        var new_arr = [];
        for (let j = 0; j < attributeStride; j++) {
            new_arr[j] = attributeData[index + j];
        }
        result[counter++] = shader.vert_main(new_arr)
    }
    return result;
   
}
