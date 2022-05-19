// https://codepen.io/GabbeV/pen/abOVjQ

class Color {
    constructor(r,g,b,a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

class FrameBuffer {
    constructor(imgData, width, height, clearColor = new Color(1, 1, 1, 1)) {
        this.width = width;
        this.height = height;
        this.imgData = imgData;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.imgData.data[(x + y * width ) * 4]   =   Math.round(clearColor.r * 255);
                this.imgData.data[(x + y * width ) * 4 + 1] = Math.round(clearColor.g * 255);
                this.imgData.data[(x + y * width ) * 4 + 2] = Math.round(clearColor.b * 255);
                this.imgData.data[(x + y * width ) * 4 + 3] = Math.round(clearColor.a * 255);
            }
            
        }
    }
    changePosValue(x, y, color) {
        this.imgData.data[(x + y * this.width)*4]   = Math.round(color.r * 255);
        this.imgData.data[(x + y * this.width)*4+1] = Math.round(color.g * 255);
        this.imgData.data[(x + y * this.width)*4+2] = Math.round(color.b * 255);
        this.imgData.data[(x + y * this.width)*4+3] = Math.round(color.a * 255);
    }
}

const rgbaToHex = (r, g, b, a) => '#' + [r, g, b, a].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

function colorRGB2Hex(color) {
    let r = color.r * 255;
    let g = color.g * 255;
    let b = color.b * 255;
    let a = color.a * 255;

    let hex = rgbaToHex(r, g, b, a);
    return hex;
}

// array is color buffer
function array_to_frame(ctx, frameBuffer) {
    ctx.putImageData(frameBuffer.imgData, 0, 0);
}