
var SampleNumber = 1;

var half_sephere_sample = {
    samples : pdf_sephere(SampleNumber),
    // 平均采样，在半球上任意一点的概率密度 都是 1 / 2π
     pdf_wi : 1 / (2 * Math.PI)
}

var area_sample = {
    samples : pdf_sephere(SampleNumber),
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

// 在光源 范围内随机采样,认为是平均采样
// pdf 1 / 是光源的面积
function getAreaSample(areaLights, p) {
    var areaLight = areaLights[0]
    var pdf_area = 1 / areaLight.getArea();
    var samples = [];
    for(let i = 0; i < SampleNumber; i ++) {
        var random_sample = areaLight.sample_pdf();

        // 光源上的位置 - 物体位置得到光线方向
        var dir = minus3(random_sample.pos, p);
        vec3.normalize(dir, dir)
        samples[i] = {
            wi:dir,
            normal:random_sample.normal,
            pos:random_sample.pos,
            emission:areaLight.material.emission
        };
    }

    return {
        samples : samples,
        pdf_wi : pdf_area
    } 
}

function shade(p, scene, object, N) {
    // 使用pdf 在 范围内随机采用
    sample = getAreaSample(scene.areaLights, p);

    var Lo = vec3.fromValues(0, 0, 0);
    sample.samples.forEach(item => {
        var wi = item.wi;
        var light_wi_normal = item.normal;
        var lightPos_3 = item.pos;
        var lightEmission = item.emission;
        var pdf_wi = sample.pdf_wi
        
        // 1 在光源采样
        // 2.1 计算当前位置到采样点的向量 wi
        // 2.2 从当前位置沿着wi发射光线，和场景计算相交，判断相交点是不是光源采样点， 判断是否存在遮挡
        //      如果没有遮挡则是直接光照
        // L0 = L0 + (1/Number) * Li * fr * cosine / pdf(wi)
        var p_3 = p;
        var p_to_light_3 = minus3(lightPos_3, p_3);
       
        // 当前位置到采样点的向量是 wi
        var wi_dir = mul3(1, p_to_light_3); // 不能直接复制，否则
        vec3.normalize(wi_dir, wi_dir)
        // 点到光源的距离平方计算
        var dis_p_to_light_square = dot_product3(p_to_light_3, p_to_light_3);


        // 发射光线和场景求交点，判断是否被遮挡
        var payload = trace(p_3, wi_dir, scene);
        if (payload) {
            // 判断交点是否是光源采样点
            var hitPoint = add3(p_3 , mul3(payload.tnear, wi_dir));
            // 计算交点和采样点到圆点的距离是否相同
            var len_offset = vec3.length(minus3(hitPoint , p_3)) - vec3.length(p_to_light_3);
            // var len_offset = vec3.length(hitPoint) - vec3.length(p_to_light_3);
            // if (len_offset <= 0 && len_offset > -0.5)
            //  {
            if (1) {
                // 是同一个点，说明当前位置和采样点直接没有遮挡，是直接照射
               
                // - wi_dir 就是采样点 发出的能量 照射到当前位置的方向
                var cos_light_dir_with_light_normal = dot_product3(mul3(-1, wi_dir), light_wi_normal)
                var Li_3 = mul3(cos_light_dir_with_light_normal / dis_p_to_light_square, lightEmission);

                // 漫反射均匀分布，在半球面上，每个方向的漫反射相同
                var fr_3 = mul3(1 / (1 * Math.PI), object.diffuseColor)

                // 光线和当前位置法线的夹角
                var cos_p_to_light_with_p_normal = dot_product3(wi_dir, N);

                 // L0 = L0 + (1/Number) * Li * fr * cosine / pdf(wi)
                var result = vec3.create();
                vec3.multiply(result, Li_3, fr_3);

                 Lo = add3(Lo, mul3((1 / SampleNumber) * cos_p_to_light_with_p_normal / pdf_wi, result))
            }
        }

        // 参考代码
        // var intersection_coords = p;
        // var lightpos_coords = lightPos_3;
        // var lightpdf = sample.pdf_wi;
        // //sampleLight(lightpos, lightpdf);
        // var collisionlight = minus3(lightpos_coords, intersection_coords);
        // var dis = dot_product3(collisionlight, collisionlight);
        // // var collisionlightdir = collisionlight.normalized();   
        // var collisionlightdir = collisionlight;   
        // vec3.normalize(collisionlightdir,collisionlightdir)

        // // Ray light_to_object_ray(intersection_coords, collisionlightdir);
       
        // // Intersection light_to_anything_ray = Scene::intersect(light_to_object_ray);
        // var light_to_anything_ray = trace(intersection_coords, collisionlightdir, scene);

        // // var f_r = intersection.m -> eval(ray.direction, collisionlightdir, intersection.normal);
        // var fr_3 = mul3(1 / (Math.PI), object.diffuseColor);
        // if (light_to_anything_ray) {
        //     var hitPoint = add3(intersection_coords , mul3(light_to_anything_ray.tnear, collisionlightdir));
        //     var light_to_anything_ray_distance = vec3.length(hitPoint);
        //     var collisionlight_norm = vec3.length(collisionlight);
        //     if (light_to_anything_ray_distance - collisionlight_norm > -0.005) {  
        //         //L_dir = L_i * f_r * cos_theta * cos_theta_x / |x - p | ^ 2 / pdf_light

        //         var lightpos_emit = lightEmission;
        //         var f_r = fr_3;
        //         // 当前位置的法线
        //         var intersection_normal = N;
        //         var cos_theta = dot_product3(collisionlightdir, intersection_normal);
        //         var lightpos_normal = light_wi_normal;

        //         var cos_theta_x = dot_product3(mul3(-1,collisionlightdir), lightpos_normal)
                
        //         // L_dir = lightpos.emit * f_r * dotProduct(collisionlightdir, intersection.normal) * dotProduct(-collisionlightdir, lightpos.normal) / dis / lightpdf;
        //         var l_i_f_r = vec3.create();
        //         vec3.multiply(l_i_f_r, lightpos_emit, f_r);
        //         L_dir = mul3(cos_theta * cos_theta_x / dis / lightpdf, l_i_f_r) ;
        //         // Lo = L_dir;
        //         Lo = add3(Lo, mul3(1 / SampleNumber, L_dir))
        //     }
        // }
        

      
        
       



        
      
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

        hitColor = shade(hitPoint, scene, object, N);

        

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