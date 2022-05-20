// generate triangles point
// 

class Triangle {
    constructor(v0, v1, v2) {
        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
    }
}
function triangle(v0_value, v1_value, v2_value) {
    return {
        v0 : v0_value,
        v1 : v1_value,
        v2 : v2_value,
    };
}


const PrimitiveTypeTriangles = 0

const FieldTypeVec3 = 0


function getVec3(attributeData, attributeStride, index) {
    return vec3(
        attributeData[attributeStride * index + 0],
        attributeData[attributeStride * index + 1],
        attributeData[attributeStride * index + 2]
    )
}

function primitiveSetup(attributeData, attributeStride, attributeType, indexData, type){
    var triangles = []
    var count = 0;
    if (type == PrimitiveTypeTriangles) {
        if (indexData) {
            if (indexData.length % 3 !== 0) {
                console.log("indexData must be 3*n");
            }
            for (let index = 0; index < indexData.length; index+=3) {
                const i0 = indexData[index];
                const i1 = indexData[index + 1];
                const i2 = indexData[index + 2];

                if (attributeType == FieldTypeVec3) {
                    const a0 = getVec3(attributeData, attributeStride, i0);
                    const a1 = getVec3(attributeData, attributeStride, i1);
                    const a2 = getVec3(attributeData, attributeStride, i2);

                    const v0 = vec4(a0.x, a0.y, a0.z, 1);
                    const v1 = vec4(a1.x, a1.y, a1.z, 1);
                    const v2 = vec4(a2.x, a2.y, a2.z, 1);
                    triangles[count++] = triangle(v0, v1, v2)
                    
                }
                
            }
        }
    }
    return triangles;
}
