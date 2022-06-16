var SampleNumber = 100;

var half_sephere_sample = {
    shade_samples : pdf_sephere(SampleNumber),
    // 平均采样，在半球上任意一点的概率密度 都是 1 / 2π
     pdf_wi : 1 / (2 * Math.PI)
}

var sample = half_sephere_sample;

function areaLightPhongShading(phongItem) {
    // https://learnopengl.com/code_viewer_gh.php?code=src/2.lighting/2.1.basic_lighting_diffuse/2.1.basic_lighting.fs
    var ambient = mul3(phongItem.ambientStrength, phongItem.lightColor);
    var diff = Math.max(0, dot_product3(phongItem.normal, phongItem.lightDir));
    var diffuse = mul3(diff, phongItem.lightColor);
    var colorTemp = add3(ambient, diffuse);

    var result = vec3.create();
    vec3.multiply(result, colorTemp, phongItem.objectColor);
    return result;
}

function shade(p, areaLights, object, N) {
    // 使用pdf 在 范围内随机采用
    var Lo = vec3.fromValues(0, 0, 0);
    sample.shade_samples.forEach(wi => {
        var payload = traceObjects(p, wi, areaLights);
        // 如果光线射中光源， 则说明被光源直接照到
        if (payload) {
            // 沿着光线方向 计算出来 面光源上的一个位置
            var hitPoint = add3(p , mul3(payload.tnear, wi));

            // L0 = L0 + (1/Number) * Li * fr * cosine / pdf(wi)
            var phongItem = {
                lightColor : payload.hitobj.diffuseColor,
                normal : N,
                lightDir : wi,
                lightPos: hitPoint,
                ambientStrength : 0.1,
                objectColor: object.evalDiffuseColor()
            }
            // 使用phong作为brdf， phong会计算出这个点的颜色
            // 用这个颜色替换  Li * fr * cosine
            var f_r_cos = areaLightPhongShading(phongItem);
            // L0 += (1/Number) * f_r_cos / pdf(wi)
            var pdf_wi = sample.pdf_wi;
            f_r_cos = mul3(1 / pdf_wi, f_r_cos);
            var f_r_cos_n = mul3(1 / SampleNumber, f_r_cos);
            Lo = add3(Lo, f_r_cos_n)
        }
    });
    return mul3(10,Lo);
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