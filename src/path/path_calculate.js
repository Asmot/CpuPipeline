
var lastRayPath = []
var curRayPath = []

// 路径追踪只会采样一个点
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

function getOneAreaSample(areaLights, p) {
    var areaLight = areaLights[0]
    var pdf_area = 1 / areaLight.getArea();
    var random_sample = areaLight.sample_pdf();

    // 光源上的位置 - 物体位置得到光线方向
    var dir = minus3(random_sample.pos, p);
    vec3.normalize(dir, dir)
    return {
        wi:dir,
        normal:random_sample.normal,
        pos:random_sample.pos,
        emission:areaLight.material.emission,
        pdf_wi : pdf_area
    };
}

// 在光源 范围内随机采样,认为是平均采样
// pdf 1 / 是光源的面积
function getAreaSample(areaLights, p) {
    var samples = [];
    for(let i = 0; i < SampleNumber; i ++) {
        vec3.normalize(dir, dir)
        samples[i] = getOneAreaSample(areaLights, p)
    }

    return {
        samples : samples
    } 
}

// 光源位置采样
function shade_direct(p, scene, object, N) {
    var Lo = vec3.fromValues(0, 0, 0);

    // 使用pdf 在 范围内随机采用
    var sample_item = getOneAreaSample(scene.areaLights, p);
    var light_wi_normal = sample_item.normal;
    var lightPos_3 = sample_item.pos;
    var lightEmission = sample_item.emission;
    var pdf_wi = sample_item.pdf_wi
    
    // 1 在光源采样
    // 2.1 计算当前位置到采样点的向量 wi
    // 2.2 从当前位置沿着wi发射光线，和场景计算相交，判断相交点是不是光源采样点， 判断是否存在遮挡
    //      如果没有遮挡则是直接光照
    // L0 = L0 + (1/Number) * Li * fr * cosine / pdf(wi)/*  */
    var p_3 = p;
    var p_to_light_3 = minus3(lightPos_3, p_3);
    
    // 当前位置到采样点的向量是 wi
    var wi_dir = mul3(1, p_to_light_3); // 不能直接复制，否则
    vec3.normalize(wi_dir, wi_dir)
    // 点到光源的距离平方计算
    var dis_p_to_light_square = dot_product3(p_to_light_3, p_to_light_3);


    // 发射光线和场景求交点，判断是否被遮挡
    // 避免和自己相交 添加一个偏移
    var rayOrig = getHitPointWithEpsilon(p_3, mul3(-1,wi_dir), N);
    var payload = trace(rayOrig, wi_dir, scene);
    if (payload) {
        // 判断交点是否是光源采样点
        var hitPoint = add3(p_3 , mul3(payload.tnear, wi_dir));
        // 计算交点和采样点是否相同
        var len_offset = vec3.length(minus3(hitPoint , p_3)) - vec3.length(p_to_light_3);
        if (len_offset < 0.005) {
            // 是同一个点，说明当前位置和采样点直接没有遮挡，是直接照射
            
            // - wi_dir 就是采样点 发出的能量 照射到当前位置的方向
            var cos_light_dir_with_light_normal = dot_product3(mul3(-1, wi_dir), light_wi_normal)

            // 光源采样 需要变换公式 cos θ * cos θ' / (x' - x)²
            // 单位立体角的能量,   cos * A / r²
            // 随着距离越来越远能量就会衰减， 和半径r相关
            var Li_3 = mul3(cos_light_dir_with_light_normal / dis_p_to_light_square, lightEmission);

            // 漫反射均匀分布，在半球面上，每个方向的漫反射相同
            var fr_3 = mul3(1 / (1 * Math.PI), object.diffuseColor)

            // 光线和当前位置法线的夹角
            var cos_p_to_light_with_p_normal = dot_product3(wi_dir, N);

            // L0 = L0 + (1/Number) * Li * fr * cosine / pdf(wi)
            // L0 = L0 + (1/Number) * Li * fr * cos θ * cos θ' / (x' - x)² / pdf(wi)
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
   
    return Lo;
}


/**
 * 
 * @param {*} p 要计算的位置
 * @param {*} scene 场景
 * @param {*} object 位置所在的物体
 * @param {*} N 位置 所在的法线
 */
function shade(p, scene, object, N, depth) {     

    if (object.material && object.material.emission) {
        // hit到了光源, 直接返回光源的颜色
        return object.material.emission;
    }

    curRayPath[depth] = p; 
    // 直接光照
    // 这个点 四面八方来的光 和brdf作用后的结果
    // 蒙特卡洛 半球面上的积分 约等于 半球面上 N个采样点求和平均
    //    采样方式就是pdf
    var L_dir_3 = shade_direct(p, scene, object, N);

     // 间接光照
     var L_indir_3 = vec3.fromValues(0, 0, 0);
        
     // 1. 半球面上采样
     // 2. 发射条光线，看是否 和物体相交（如果和光源相交 则不用处理，直接用直接光照就行）
     //     使用pdf 在 范围内随机采用
     // 2.1 把交点假象一个新的光源 再次计算
     // 3. 结束条件 使用俄罗斯轮盘赌
     const RussianRoulette = 0.8;
     var P_RR = Math.random();
     if (P_RR < RussianRoulette) {
         // 如果没有通过俄罗斯轮盘赌, 则不用继续计算间接光照
         var wi_dir = random_sephere(N);
         var pdf_wi = 1 / (2 *Math.PI)
         var p_3 = p;
     
         var rayOrig = getHitPointWithEpsilon(p_3, mul3(-1,wi_dir), N);
         var payload = trace(rayOrig, wi_dir, scene);
         if (payload) {
             // 通过emission来判断是否是光源
             if (payload.hitobj.material && payload.hitobj.material.emission) {
                 // 交点是光源，不用处理
             } else {
                 // 采样一个点 就不需要除 采样数量 N
                 // L_indir =  Li * fr * cosine / pdf(wi)
                 // 间接光照可以认为是， 交点处发过来了一条光线
                 // 所以方向就是 -wi_dir
                var hitPoint = add3(p_3 , mul3(payload.tnear, wi_dir));
                // 计算假设的光源的能量
                // var Li_3 = castPath(hitPoint, mul3(-1, wi_dir), scene, depth + 1)
                //  var Li_3 = castPath(hitPoint, mul3(-1, wi_dir), scene, depth + 1)
                var item = {
                    position : hitPoint,
                    index : payload.index
                }        
                var res = payload.hitobj.getSurfaceProperties(item);
                var Li_3 = shade(hitPoint, scene, payload.hitobj, res.normal, depth + 1);
                
                 // 漫反射均匀分布，在半球面上，每个方向的漫反射相同
                 var fr_3 = mul3(1 / ( Math.PI), object.diffuseColor)
                // var fr_3 = object.eval(undefined, wi_dir, N);
         
                 // 当前位置光线和法线的夹角
                 // 光线方向 一般都用指向光源来计算
                 var cosin = dot_product3(wi_dir, N);
                 if (cosin <= 0) {
                    fr_3 = [0,0,0]
                 }
         
                 var result = vec3.create();
                 vec3.multiply(result, Li_3, fr_3);
         
                 L_indir_3 = mul3((cosin / pdf_wi) / RussianRoulette, result);
     
             }
         }
     } else {
         if (curRayPath.length > lastRayPath.length) {
            for (let i = 0; i < curRayPath.length; i ++) {
                lastRayPath[i] = curRayPath[i]
            }
            curRayPath = []
         }
     }
    return add3(L_dir_3, L_indir_3);
}


/**
 * orig 是光线起点, 眼睛位置
 * dir 是光线的方向， 观察点- 眼睛位置
 * scene [] 包含场景内所有的物体
 * 
 */ 
function castPath(orig, dir, scene, nouse) {
    var hitColor = [0,0,0];
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
        return shade(hitPoint, scene, object, N, 0);
    }


    return hitColor;
}