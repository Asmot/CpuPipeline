

async function getPixelData(path) {
    const image = new Image()
    image.crossOrigin = ''
    image.src = path
    return new Promise((resolve, reject) => {
        image.onload = function () {    
            var canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            let pixelData = canvas.getContext('2d').getImageData(0, 0, image.width, image.height).data;
            // console.log("[texture] onload " + image.width + " " + image.height)
            resolve([image.width, image.height, pixelData])
        }
    })  
}

// load texture form file and have sample function
class Texture {
    constructor(path) {
        this.path = path;
    }
    async loadTexture() {
        var resArray = await getPixelData(this.path);
        this.width = resArray[0];
        this.height = resArray[1];
        this.pixelData = resArray[2];
        console.log("[texture] loadTexture complete size " + this.width + " " + this.height)
    }
    // x y range is [0, 1]
    // left bottom is (0,0), right top is (1,1)
    sample(t_x, t_y) {
        let x = Math.floor(this.width * t_x);
        let y = Math.floor(this.height *  (1.0 - t_y));
        let r = this.pixelData[(x + y * this.width ) * 4] / 255;
        let g = this.pixelData[(x + y * this.width ) * 4 + 1] / 255;
        let b = this.pixelData[(x + y * this.width ) * 4 + 2] / 255;
        let a = this.pixelData[(x + y * this.width ) * 4 + 3] / 255;
        return vec4.fromValues(r,g,b,a);
    }
}

class TextureManager{
    constructor() {
        this.textures = []
    }
    addTexture(texture) {
        this.textures.push(texture);
    }
    async loadTextures(onload) {
       for (let index = 0; index < this.textures.length; index++) {
           const element = this.textures[index];
           await element.loadTexture();
       }
        console.log("[texture] textures load complete counter " + this.textures.length)
        onload();
    }
}