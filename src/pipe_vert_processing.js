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
 * @param {*} attributeData [key: {attr:, stride:}]
 * @param {*} uniforms 
 * @returns 
 */
function vert_processing(attributeData, shader) {
    var vertSize = 0;
    for (const key in attributeData) {
        const attrItem =  attributeData[key];
        const curVertSize = attrItem.attr.length / attrItem.stride;
         // all value in attributeData, size must the same
        if (vertSize !== 0 && vertSize !== curVertSize) {
            console.log("[shader][vert] error, attributeData " + key + " length is  not" + vertSize);
            return;
        }
        vertSize = curVertSize;
    }
    if (vertSize === 0) {
        console.log("[shader][vert] error, attributeData length is 0 ");
        return;
    }

    var result = [];
    var counter = 0;

    for (let index = 0; index < vertSize; index ++) {
        var attrItemValues = {};
        for (const key in attributeData) {
            const attrItem =  attributeData[key];
            const attrItemStride = attrItem.stride;
            attrItemValues[key] = [];
            for (let j = 0; j < attrItemStride; j++) {
                // get the attr data by counter and stride
                attrItemValues[key][j] = attrItem.attr[counter * attrItemStride + j];
            }
        }
        result[counter++] = shader.vert_main(attrItemValues)
    }
    return result;
   
}
