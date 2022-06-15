
var N = 100;
var shade_samples = pdf_sephere(N);


function areaLightPhongShading(dir, N, hitPoint, hitobj, lightPos, intensity) {
    var lightAmt = 0, specularColor = 0;
    var lightDir = minus3(lightPos, hitPoint);
    // 起点到光源的距离
    var lightDistance2 = dot_product3(lightDir, lightDir);
    vec3.normalize(lightDir, lightDir);
    
    var LdotN = Math.max(0, dot_product3(lightDir, N));
    lightAmt += intensity * LdotN;
    // var reflectionDirection = reflect3(mul3(-1, lightDir), N);
    // var color = 
    // specularColor += Math.pow(Math.max(0, -dot_product3(reflectionDirection, dir)),
    //     payload.hitobj.specularExponent) * light.intensity;
    

    return mul3(lightAmt * hitobj.Kd , hitobj.evalDiffuseColor());// + specularColor * payload.hitobj.Ks;
}


function shade(p, areaLights, object, N) {
    // 使用pdf 在 范围内随机采用
    var Lo = vec3.fromValues(0, 0, 0);
    shade_samples.forEach(wi => {
        var payload = traceObjects(p, wi, areaLights);
        // 如果光线射中光源， 则说明被光源直接照到
        if (payload) {
            // 沿着光线方向 计算出来 面光源上的一个位置
            var hitPoint = add3(p , mul3(payload.tnear, wi));
            var light = payload.hitobj;
            var color = light.diffuseColor;
            color = mul3(1 / (2 * Math.PI), color);
            Lo = mul3(1 / N, add3(Lo, color))
            Lo = light.diffuseColor;

            Lo = areaLightPhongShading(wi, N, p, object, hitPoint, 0.5);
        }
    });
    return Lo;
}

/**
 * orig 是光线起点
 * dir 是光线的方向
 * scene [] 包含场景内所有的物体
 * depth 是递归调用的次数
 */ 
function castPath(orig, dir, scene, depth) {

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
        
        // 直接光照
        // 这个点 四面八方来的光 和brdf作用后的结果
        // 蒙特卡洛 半球面上的积分 约等于 半球面上 N个采样点求和平均
        //    采样方式就是pdf
        hitColor = shade(hitPoint, scene.areaLights, object, N);

        

        // if (object.materialType === MaterialType_DIFFUSE_AND_GLOSSY) {
        //     return phongShading(dir, N, scene, hitPoint, payload.hitobj);

        // } else if(object.materialType == MaterialType_REFLECTION) {
        //     // 反射光线，反射出一条新的光线，进行计算
        //     var reflectRayDir = reflect3(dir, N);
        //     vec3.normalize(reflectRayDir,reflectRayDir);
        //     var reflectRayOrig = getHitPointWithEpsilon(hitPoint, dir, N);

        //     var kr = fresnel(dir, N, object.ior);
        //     kr = 0.5;

        //     hitColor = mul3(kr, castRay(reflectRayOrig, reflectRayDir, scene, depth + 1));
        // } else if(object.materialType == MaterialType_REFLECTION_AND_REFRACTION) {
        //     // 反射光线，反射出一条新的光线，进行计算 
        //     var reflectRayDir = reflect3(dir, N);
        //     vec3.normalize(reflectRayDir,reflectRayDir);
        //     var reflectRayOrig = getHitPointWithEpsilon(hitPoint, mul3(-1,reflectRayDir), N);
        //     var kr = fresnel(dir, N, object.ior);
        //     var kr = 0.8;
        //     var reflectColor = mul3(kr, castRay(reflectRayOrig, reflectRayDir, scene, depth + 1));

        //     // 折射出一条新的光线进行计算
        //     var refractDir = refract(dir, N, object.ior);
        //     vec3.normalize(refractDir,refractDir);
        //     var refractRayOrig = getHitPointWithEpsilon(hitPoint, mul3(-1,refractDir), N);

            
        //     var refractColor = mul3(kr, castRay(refractRayOrig, refractDir, scene, depth + 1));
        //     hitColor = add3(mul3(kr, reflectColor) , mul3((1 - kr) , refractColor));
            
        // }

        return hitColor;
    }    



    return hitColor;
}