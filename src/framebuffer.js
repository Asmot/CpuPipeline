// https://codepen.io/GabbeV/pen/abOVjQ

class Color {
    constructor(r,g,b,a) {
        this[0] = r;
        this[1] = g;
        this[2] = b;
        this[3] = a;
    }
}

class FrameBuffer {
    constructor(imgData, width, height, clearColor = new Color(1, 1, 1, 1)) {
        this.width = width;
        this.height = height;
        this.imgData = imgData;
        this.depthBuffer = []
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.imgData.data[(x + y * width ) * 4]   =   Math.round(clearColor[0] * 255);
                this.imgData.data[(x + y * width ) * 4 + 1] = Math.round(clearColor[1] * 255);
                this.imgData.data[(x + y * width ) * 4 + 2] = Math.round(clearColor[2] * 255);
                this.imgData.data[(x + y * width ) * 4 + 3] = Math.round(clearColor[3] * 255);
            }   
        }
        this.clearDepthBuffer(1);
    }
    changePosValue(x, y, color) {
        this.imgData.data[(x + y * this.width)*4]   = Math.round(color[0] * 255);
        this.imgData.data[(x + y * this.width)*4+1] = Math.round(color[1] * 255);
        this.imgData.data[(x + y * this.width)*4+2] = Math.round(color[2] * 255);
        this.imgData.data[(x + y * this.width)*4+3] = Math.round(color[3] * 255);
    }
    clearDepthBuffer(value) {
        var width = this.width;
        var height = this.height;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.depthBuffer[(x + y * width )] = value
            }
        }
    }
    setDepthValue(x, y, value) {
        this.depthBuffer[(x + y * this.width )] = value
    }
    getDepthValue(x, y) {
        return   this.depthBuffer[(x + y * this.width )];
    }
}

const rgbaToHex = (r, g, b, a) => '#' + [r, g, b, a].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

function colorRGB2Hex(color) {
    let r = Math.floor(color[0] * 255);
    let g = Math.floor(color[1] * 255);
    let b = Math.floor(color[2] * 255);
    let a = Math.floor(color[3] * 255);

    let hex = rgbaToHex(r, g, b, a);
    return hex;
}

// array is color buffer
function array_to_frame(ctx, frameBuffer) {
    ctx.putImageData(frameBuffer.imgData, 0, 0);
    // var width = frameBuffer.width;
    // var height = frameBuffer.height;
    // for (let x = 0; x < width; x++) {
    //     for (let y = 0; y < height; y++) {
          
    //         let r = frameBuffer.imgData.data[(x + y * width ) * 4] / 255;
    //         let g = frameBuffer.imgData.data[(x + y * width ) * 4 + 1] / 255;
    //         let b = frameBuffer.imgData.data[(x + y * width ) * 4 + 2] / 255;
    //         let a = frameBuffer.imgData.data[(x + y * width ) * 4 + 3] / 255;

    //         ctx.fillStyle = colorRGB2Hex(new Color(r, g, b, a));    
            
    //         ctx.fillRect(x, y, 1, 1);
    //     }
    // }
}

function draw_depth_buffer(ctx, frameBuffer) {
    var width = frameBuffer.width;
    var height = frameBuffer.height;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            var depth = frameBuffer.getDepthValue(x, y)
            if (depth !== 1) {
                ctx.fillStyle = colorRGB2Hex(new Color(depth, 0, 0, 1));    
            } else {
                ctx.fillStyle = "#000000"
            }
            ctx.fillRect(x, y, 1, 1);
        }
    }
}