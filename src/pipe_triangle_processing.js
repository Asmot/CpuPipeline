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

/**
 * 
 * process triangles by points and indices
 * 
 */
function triangle_processing(points, indexData, type) {
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
                const v0 = points[i0];
                const v1 = points[i1];
                const v2 = points[i2];
                triangles[count++] = triangle(v0, v1, v2)
            }
        }
    }
    return triangles;
}