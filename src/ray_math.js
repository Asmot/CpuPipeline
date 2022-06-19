

const MAX_DEPTH = 3;
const BACKGROUND_COLOR = [1,1,1,1];


function trace(orig, dir, scene) {
    return traceObjects(orig, dir, scene.objects)
}

function traceObjects(orig, dir, objects) {
    var tnear = 10000000;
    var haveIntersect = false;
    var payLoad = {};
    objects.forEach(object => {
        // 检查光线和物体是否相交
        var res = object.intersect(orig, dir, tnear);
        if (res) {
            var index = res.index;
            tnear = res.tnear;


            haveIntersect = true;
            payLoad.hitobj = object;
            payLoad.tnear = tnear;
            payLoad.index = index;
        }

    });
    if (haveIntersect) {
        return payLoad;
    }
    return undefined;
}

function fresnel(I, N, ior) {
    var cosi = clamp(-1, 1, dot_product3(I, N));
    var etai = 1, etat = ior;
    if (cosi > 0) {  
        var temp = etai;
        etai = etat;
        etat = temp;
    }
    // Compute sini using Snell's law
    var sint = etai / etat * Math.sqrt(Math.max(0, 1 - cosi * cosi));
    // Total internal reflection
    if (sint >= 1) {
        return 1;
    } else {
        var cost = Math.sqrt(Math.max(0, 1 - sint * sint));
        cosi = Math.abs(cosi);
        var Rs = ((etat * cosi) - (etai * cost)) / ((etat * cosi) + (etai * cost));
        var Rp = ((etai * cosi) - (etat * cost)) / ((etai * cosi) + (etat * cost));
        return (Rs * Rs + Rp * Rp) / 2;
    }
    // As a consequence of the conservation of energy, transmittance is given by:
    // kt = 1 - kr;
}

// p = O + t * D
// 加一个偏移，避免计算出来可以自己所在的三角形相交
function getHitPointWithEpsilon(hitPoint, dir, N) {
    var epsilon = 0.0001;
    return (dot_product3(dir, N) < 0) ?
                                add3(hitPoint , mul3(epsilon, N)) :
                                minus3(hitPoint , mul3(epsilon,N)); 
   
}

function phongShading(dir, N, scene, hitPoint, hitobj) {
    var lightAmt = 0, specularColor = 0;
    // phong shading

    var shadowPointOrig = getHitPointWithEpsilon(hitPoint, dir, N);
   
    scene.lights.forEach(light => {
        var lightDir = minus3(light.position, hitPoint);
        // 起点到光源的距离
        var lightDistance2 = dot_product3(lightDir, lightDir);
        vec3.normalize(lightDir, lightDir);
  
        
      
        var LdotN = Math.max(0, dot_product3(lightDir, N));
        // 把 上一次 光线和物体的交点 作为起点，光源作为方向，看看这条光线和物体是否有相交
        // 如果有相交，那说明这个交点在阴影里面
        // 而且相机的点，在起点和光源之间，如果在光源之后，那说明改点不在阴影里
        var shadow_res = trace(shadowPointOrig, lightDir, scene);
        var inShadow = false;
        if (shadow_res && (shadow_res.tnear * shadow_res.tnear < lightDistance2)) {
            inShadow = true;
        }
        lightAmt += inShadow ? 0 : light.intensity * LdotN;
        // var reflectionDirection = reflect3(mul3(-1, lightDir), N);
        // var color = 
        // specularColor += Math.pow(Math.max(0, -dot_product3(reflectionDirection, dir)),
        //     payload.hitobj.specularExponent) * light.intensity;
    });

    return mul3(lightAmt * hitobj.Kd , hitobj.evalDiffuseColor());// + specularColor * payload.hitobj.Ks;
}


//  x o z 为平面， y方向上的半球 
function pdf_sephere(N) {
    // 在半球面上 均匀取N个点（ N个方向）
    samples = []
    var counter = 0;

    var n = Math.sqrt(N);
    var step = 180 / n;

    var r = 1;
    for (let a = 0; a < 180; a+=step) {
        for (let b = 0; b < 180; b+=step) {
            var a_r = degreeToRadian(a);
            var b_r = degreeToRadian(b);
            var x = 1 * Math.sin(a_r) * Math.cos(b_r);
            var y = 1 * Math.sin(a_r) * Math.sin(b_r);
            var z = 1 * Math.cos(a_r);

            var dir = vec3.fromValues(x, y, z);
            vec3.normalize(dir, dir);
            samples[counter++] = dir;

        }
    }
    return samples;
}

// normal 所在半球随机 去一个点，单位向量
function random_sephere(normal) {
    var x_1 = Math.random();
    var x_2 = Math.random();

    var z = Math.abs(1.0 - 2.0 * x_1);
    var r = Math.sqrt(1.0 - z * z);
    var phi = 2 * Math.PI * x_2;

    var a = vec3.fromValues(r*Math.cos(phi), r*Math.sin(phi), z);

    var B, C;
    if (Math.abs(normal[0]) > Math.abs(normal[1])){
        var invLen = 1.0 / Math.sqrt(normal[0] * normal[0] + normal[2] * normal[2]);
        C = vec3.fromValues(normal[2] * invLen, 0.0, -normal[0] *invLen);
    } else {
        var invLen = 1.0 / Math.sqrt(normal[1] * normal[1] + normal[2] * normal[2]);
        C = vec3.fromValues(0.0, normal[2] * invLen, -normal[1] *invLen);
    }
    B = coross_product3(C, normal);
    var res =  add3(
        add3(mul3(a[0] , B) , 
             mul3(a[1] , C)
            ),
        mul3(a[2] , normal)
    );
    vec3.normalize(res, res);
    return res;
}

// 在一个区域内采样
// 实现在光源区域采样
function pfd_area(N, area) {

}