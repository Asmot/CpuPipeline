canvas = document.querySelector('canvas');
ctx = canvas.getContext('2d');
width = canvas.width = canvas.clientWidth;
height = canvas.height = canvas.clientHeight;
imgData = ctx.getImageData(0,0,width,height);
data = imgData.data;


const meshData = testData_alix();
// const meshData = testData0();

var camera = new Camera(width, height);
camera.position(0, 0, 100);
camera.update();


var cornellbox_floor_desc = new AssetKey("assets/cornellbox/","floor")
var cornellbox_left_desc = new AssetKey("assets/cornellbox/","left")
var cornellbox_right_desc = new AssetKey("assets/cornellbox/","right")
var cornellbox_shortbox_desc = new AssetKey("assets/cornellbox/","shortbox")
var cornellbox_tallbox_desc = new AssetKey("assets/cornellbox/","tallbox")
var cornellbox_light_desc = new AssetKey("assets/cornellbox/","light")

var assetsManager = new AssetsManager();
assetsManager.addObjPath(cornellbox_floor_desc)
assetsManager.addObjPath(cornellbox_left_desc)
assetsManager.addObjPath(cornellbox_right_desc)
assetsManager.addObjPath(cornellbox_shortbox_desc)
assetsManager.addObjPath(cornellbox_tallbox_desc)
assetsManager.addObjPath(cornellbox_light_desc)



var controls = new function() {
    this.eye_x = 278;
    this.eye_y = 273;
    this.eye_z = -800;
};

function createGUI() {
    const gui = new dat.gui.GUI();

    gui.add(controls, "eye_x", -1000, 1000).onChange(main)
    gui.add(controls, "eye_y", -1000, 1000).onChange(main)
    gui.add(controls, "eye_z", -1000, 1000).onChange(main)
    gui.open();
  
}
createGUI();


// main render
function main() {
    var frameBuffer = new FrameBuffer(imgData, width, height, new Color(201/255, 201/255, 201/255));
   
    /**
     * 以相机位置作为起点，屏幕的每个像素 作为光线传播中的一个点，算出一条光线
     * 计算这些光线和物体的交点（可以经过多次弹射），再看交点和光源的连线，是否与物体相机
     * 如果不想交，则表示该点有颜色。 
     * 将一个像素出去的光线，算出来的所有交点的颜色叠加，得到这个像素的颜色
     * 
     * 问题1：屏幕像素和相机位置，坐标体系不一样，是使用近平面位置吗
     * 让相机距离地面的高度是 H/2 / tan(fov/2), 看到的范围正好是屏幕大小，近平面一个点表示一个像素， 其实就是近平面的点
     */ 
    var scale = Math.tan(camera.fovR / 2);
    var imageAspectRatio = width / height;

    var floor = new MeshTriangle(
        assetsManager.getBuffer(cornellbox_floor_desc).attributes.aPos.attr,
        assetsManager.getBuffer(cornellbox_floor_desc).indeices,
        [],
        3
    )
    var left = new MeshTriangle(
        assetsManager.getBuffer(cornellbox_left_desc).attributes.aPos.attr,
        assetsManager.getBuffer(cornellbox_left_desc).indeices,
        [],
        3
    )
    var right = new MeshTriangle(
        assetsManager.getBuffer(cornellbox_right_desc).attributes.aPos.attr,
        assetsManager.getBuffer(cornellbox_right_desc).indeices,
        [],
        3
    )
    var shortbox = new MeshTriangle(
        assetsManager.getBuffer(cornellbox_shortbox_desc).attributes.aPos.attr,
        assetsManager.getBuffer(cornellbox_shortbox_desc).indeices,
        [],
        3
    )
    var tallbox = new MeshTriangle(
        assetsManager.getBuffer(cornellbox_tallbox_desc).attributes.aPos.attr,
        assetsManager.getBuffer(cornellbox_tallbox_desc).indeices,
        [],
        3
    )
    var light = new MeshTriangle(
        assetsManager.getBuffer(cornellbox_light_desc).attributes.aPos.attr,
        assetsManager.getBuffer(cornellbox_light_desc).indeices,
        [],
        3
    )

    floor.diffuseColor = vec3.fromValues(0.725, 0.71, 0.68);
    shortbox.diffuseColor = vec3.fromValues(0.725, 0.71, 0.68);
    tallbox.diffuseColor = vec3.fromValues(0.725, 0.71, 0.68);
    left.diffuseColor = vec3.fromValues(1,0,0);
    right.diffuseColor = vec3.fromValues(0,1,0);
    light.diffuseColor = vec3.fromValues(1,1,1);

    var light1 = new Light(vec3.fromValues(353.0, 508.7,302.0), 1);

    var scene = {
        objects : [left, right, shortbox, tallbox, light, floor],
        lights : [light1]
    };
 
    var eye_pos = vec3.fromValues(controls.eye_x, controls.eye_y, controls.eye_z);
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            var x,y;
            
            // 从eye pos 朝着一个方向发出n条光线
            // x = ((i - width / 2) / width) * scale * imageAspectRatio; 
            // y = ((height/ 2  - j) / height)  * scale;
            x = (i - width / 2) * scale * imageAspectRatio; 
            y = (height/ 2  - j) * scale;
            // if (j === height / 2) {
            //     console.log(i + "," + j + " = >" + x + "," + y)
            // }

            // x y 是近平面上的点，和x0y 所在平面平行，坐标是世界坐标，相机的z+上近平面的距离 得到近平面的z
            var near = 400;
            var pos = vec3.fromValues(x + eye_pos[0], y + eye_pos[1], eye_pos[2] + near);
            var dir = minus3(pos, eye_pos);
            vec3.normalize(dir,dir);
            // console.log(dir)
            // if (j === 0) {
            //     console.log(x + " " + y + " " + scale)
            // }
            var hitColor = castRay(eye_pos, dir, scene, 1);

            frameBuffer.changePosValue(i, j , [hitColor[0], hitColor[1], hitColor[2], 1]);
        }
    }

    // for (let i = 0; i < width; i++) {
    //     for (let j = 0; j < height; j++) {
    //         var x,y;

    //         x = (i - width / 2) * 0.05; 
    //         y =  (height/ 2  - j)  * 0.05;

    //         var pos = vec3.fromValues(x, y, 0);
    //         var dir = minus3(pos,eye_pos);
    //         vec3.normalize(dir,dir);
    //         var hitColor = castRay(eye_pos, dir, scene, 1);

    //         frameBuffer.changePosValue(i, j , [hitColor[0], hitColor[1], hitColor[2], 1]);
    //     }

    // }



    array_to_frame(ctx, frameBuffer)
    // draw_depth_buffer(ctx, frameBuffer)
}


assetsManager.loadAllAssets(main)
// main()