

const MAX_DEPTH = 1;
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

function phongShading(dir, N, scene, hitPoint, hitobj) {
    var lightAmt = 0, specularColor = 0;
    // phong shading
    // p = O + t * D
    // 加一个偏移，避免计算出来可以自己所在的三角形相交
    var epsilon = 0.0001;
    var shadowPointOrig = (dot_product3(dir, N) < 0) ?
                                add3(hitPoint , mul3(epsilon, N)) :
                                minus3(hitPoint , mul3(epsilon,N));

   
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
        }

        return hitColor;
    }    



    return hitColor;
}