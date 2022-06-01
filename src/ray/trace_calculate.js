

const MAX_DEPTH = 3;
const BACKGROUND_COLOR = [1,1,1,1];



function trace(orig, dir, scene) {

    var tnear = 10000000;
    var haveIntersect = false;
    var payLoad = {};
    scene.objects.forEach(object => {
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


/**
 * orig 是光线起点
 * dir 是光线的方向
 * scene [] 包含场景内所有的物体
 * depth 是递归调用的次数
 */ 
function castRay(orig, dir, scene, depth) {

    if (depth > MAX_DEPTH) {
        return [0, 0, 0];
    }

    var hitColor = BACKGROUND_COLOR;
    var payload = trace(orig, dir, scene);
    if (payload) {
        let object = payload.hitobj;
         // 计算光线和物体相交的位置
            // p = O + t * D
        var hitPoint = add3(orig , mul3(payload.tnear, dir));

        var item = {
            position : hitPoint,
            index : payload.index
        }

        var res = object.getSurfaceProperties(item);
        var N = res.normal; // normal

        if (object.materialType === MaterialType_DIFFUSE_AND_GLOSSY) {
            return phongShading(dir, N, scene, hitPoint, payload.hitobj);
        } else if(object.materialType == MaterialType_REFLECTION) {
            // 反射光线，反射出一条新的光线，进行计算
            var reflectRayDir = reflect3(dir, N);
            vec3.normalize(reflectRayDir,reflectRayDir);
            var reflectRayOrig = getHitPointWithEpsilon(hitPoint, dir, N);

            var kr = fresnel(dir, N, object.ior);
            kr = 0.5;

            hitColor = mul3(kr, castRay(reflectRayOrig, reflectRayDir, scene, depth + 1));
        } else if(object.materialType == MaterialType_REFLECTION_AND_REFRACTION) {
            // 反射光线，反射出一条新的光线，进行计算 
            var reflectRayDir = reflect3(dir, N);
            vec3.normalize(reflectRayDir,reflectRayDir);
            var reflectRayOrig = getHitPointWithEpsilon(hitPoint, mul3(-1,reflectRayDir), N);
            var kr = fresnel(dir, N, object.ior);
            var kr = 0.8;
            var reflectColor = mul3(kr, castRay(reflectRayOrig, reflectRayDir, scene, depth + 1));

            // 折射出一条新的光线进行计算
            var refractDir = refract(dir, N, object.ior);
            vec3.normalize(refractDir,refractDir);
            var refractRayOrig = getHitPointWithEpsilon(hitPoint, mul3(-1,refractDir), N);

            
            var refractColor = mul3(kr, castRay(refractRayOrig, refractDir, scene, depth + 1));
            hitColor = add3(mul3(kr, reflectColor) , mul3((1 - kr) , refractColor));
            
        }

        return hitColor;
    }    



    return hitColor;
}