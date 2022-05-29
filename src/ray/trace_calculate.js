

const MAX_DEPTH = 1;
const BACKGROUND_COLOR = [1,1,1,1];



function trace(orig, dir, scene) {

    var tNear = 10000000;
    var haveIntersect = false;
    var payLoad = {};
    scene.forEach(object => {
        // 检查光线和物体是否相交
        var res = object.intersect(orig, dir, tNear);
        if (res) {
            haveIntersect = true;
        }

    });
    if (haveIntersect) {
        return payLoad;
    }
    return undefined;
}


/**
 * orig 是光线起点
 * dir 是光线的方向
 * scene [] 包含场景内所有的物体
 * depth 是递归调用的次数
 */ 
function castRay(orig, dir, scene, depth) {

    if (depth > MAX_DEPTH) {
        return [0, 0, 0, 0];
    }

    var hitColor = BACKGROUND_COLOR;
    var payload = trace(orig, dir, scene);
    if (payload) {
        return [1, 0, 0, 1];
    }    



    return hitColor;
}