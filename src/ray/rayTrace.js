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

var shader = new BasicShader();
var textureShader = new TextureShader();
var phongShader = new PhongShader();



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

    var plane = new MeshTriangle([
            vec3.fromValues(-5,-3,-6),
            vec3.fromValues( 5,-3,-6), 
            vec3.fromValues( 5,-3,-16), 
            vec3.fromValues(-5,-3,-16)
            
            // vec3.fromValues( 0, 0, 0),
            // vec3.fromValues( 15, 0, 0), 
            // vec3.fromValues( 10, 10, 0)
        ],
        [0, 1, 3, 1, 2, 3],
        [[0, 0], [1, 0], [1, 1], [0, 1]]
    );

    var sph1 = new Sphere(vec3.fromValues(-1, 0, -12), 2);
    var sph2 = new Sphere(vec3.fromValues(0.5, -0.5, -8), 1.5);

    // sph1.setMaterialType(MaterialType_DIFFUSE_AND_GLOSSY)
    // sph2.setMaterialType(MaterialType_REFLECTION_AND_REFRACTION)
    sph1.setMaterialType(MaterialType_DIFFUSE_AND_GLOSSY)
    sph2.setMaterialType(MaterialType_REFLECTION)
    plane.setMaterialType(MaterialType_DIFFUSE_AND_GLOSSY);

    var light1 = new Light(vec3.fromValues(-20, 70, 20), 0.5);
    var light2 = new Light(vec3.fromValues(30, 50, -12), 0.5);

    var scene = {
        objects : [plane, sph1, sph2],
        lights : [light1, light2]
    };
 
    var eye_pos = vec3.fromValues(0, 0, 2);
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            var x,y;
            x = i / width - 0.5; 
            x = 2 * x * scale * imageAspectRatio;
            y = (height - 1 - j) / height - 0.5;
            y = 2 * y * scale;
            var dir = vec3.fromValues(x, y, -1);
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
    //         var color = castRay(eye_pos, dir, scene);
    //         frameBuffer.changePosValue(i, j , color);
    //     }

    // }



    array_to_frame(ctx, frameBuffer)
    // draw_depth_buffer(ctx, frameBuffer)
}

main()