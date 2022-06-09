
const MaterialType_DIFFUSE_AND_GLOSSY = 0;
const MaterialType_REFLECTION_AND_REFRACTION = 1;
const MaterialType_REFLECTION = 2;

class Light {
    constructor(p, i) {
        this.position = p;
        this.intensity = i;
    }
}

class MeshObject {
    constructor() {
        this.materialType = MaterialType_DIFFUSE_AND_GLOSSY;
        this.ior = 1.3;
        this.Kd = 0.8;
        this.Ks = 0.2;
        this.diffuseColor = vec3.fromValues(0.2, 0.2, 0.2);
        this.specularExponent = 25;
    }
    intersect(orig, dir, tnear){}
    getSurfaceProperties(P) {
        
        return []
    }
    setMaterialType(type) {
        this.materialType = type;
    }
    evalDiffuseColor() {
        return this.diffuseColor;
    }
}


class MeshTriangle extends MeshObject {
    constructor(vert, indeices, coords, stride = -1) {
        super();
        if(stride == -1) {
            this.vertices = vert
        } else {
            this.vertices = []
            const totalCount = vert.length / stride;
            for (let index = 0; index < totalCount; index++) {
                this.vertices[index] = vec3.fromValues(
                    vert[index * stride],
                    vert[index * stride + 1],
                    vert[index * stride + 2]
                )
            }
        }
        
        this.vertexIndex = indeices;
        this.coords = coords; 
        this.numTriangles = indeices.length / 3;
        this.diffuseColor = vec3.fromValues(0.8, 0.2, 0.2);
    }
    rayTriangleIntersect(p0, p1, p2, O, D) {
    
        // moller trumbore algorithm 计算 光线和三角形是否相交
        var E1 = minus3(p1, p0)
        var E2 = minus3(p2, p0)
        var S = minus3(O, p0)
        var S1 = coross_product3(D, E2)
        var S2 = coross_product3(S, E1);

        var denominator = dot_product3(S1, E1);
        var t = dot_product3(S2, E2) / denominator;
        var b1 = dot_product3(S1, S) / denominator;
        var b2 = dot_product3(S2, D) / denominator;

        // t > 0. 重心坐标的系数 1-b1-b2 b1 b2 都需要是正数
        var hasIntersection = (t>0) && (b1>0) && (b2>0) && (1-b1-b2>0);
        if (hasIntersection) {
            return [t, b1, b2]
        }
        return undefined
    }
    // tnear 是已经计算出来的,交点位置（t是光线传播的时间）
    intersect(orig, dir, tnear){
        // 计算光线和 物体是否相交
        // 返回相交的位置
        var intersect = false; 
        var index = 0;
        for (let k = 0; k < this.numTriangles; ++k) {
            // 从vert中找到三角形的三个顶点
            const v0 = this.vertices[this.vertexIndex[k * 3]];
            const v1 = this.vertices[this.vertexIndex[k * 3 + 1]];
            const v2 = this.vertices[this.vertexIndex[k * 3 + 2]];
            
            var res = this.rayTriangleIntersect(v0, v1, v2, orig, dir);
            if (res) {
                var t = res[0]
                if (t < tnear) {    
                    intersect |= true;
                    index = k;
                    tnear = t;
                }
            }
        }
        if (intersect) {
            return {
                index : index,
                tnear : tnear
            }
        }
        return undefined;

    }
    getSurfaceProperties(P) {
        const index = P.index;
        const v0 = this.vertices[this.vertexIndex[index * 3]];
        const v1 = this.vertices[this.vertexIndex[index * 3 + 1]];
        const v2 = this.vertices[this.vertexIndex[index * 3 + 2]];
        
        var e0 = vec3.create();
        var e1 = vec3.create();
        var N = vec3.create();
        vec3.normalize(e0, minus3(v1 , v0));
        vec3.normalize(e1, minus3(v2 , v1));
        vec3.normalize(N, coross_product3(e0, e1));

        return {
            normal : N
        };
    }
}

class Sphere extends MeshObject {
    constructor(c, r) {
        super();
        this.center = c;
        this.radius = r;
        this.radius2 = r * r;
    }
    intersect(O, D, tnear) {
        // analytic solution
        var OC = minus3(O, this.center);
        var a = dot_product3(D, D);
        var b = 2 * dot_product3(OC, D);
        var c = dot_product3(OC, OC) - this.radius2;
        var t0, t1;
        var res = solveQuadratic(a, b, c)
        t0 = res[1];
        t1 = res[2];
        if (!res[0])
            return undefined;
        if (t0 < 0)
            t0 = t1;
        if (t0 < 0)
            return undefined;
        tnear = t0;

        return {
            index : 0,
            tnear: tnear
        }
    }
    getSurfaceProperties(P) {
        var N = vec3.create();
        vec3.normalize(N, minus3(P.position , this.center))
        return {
            normal : N
        };
    }
}