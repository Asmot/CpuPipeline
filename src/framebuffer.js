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
    constructor(width, height, clearColor = new Color(1, 1, 1, 1)) {
        this.width = width;
        this.height = height;
        this.bufferArray = [];
        this.bufferArray.length = width * height;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                this.bufferArray[y * width + x] = clearColor;
            }
            
        }
    }
    changePosValue(x, y, color) {
        this.bufferArray[y * width + x] = color;
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

// array to image
var canvas = document.querySelector('#mycanvas');
var ctx = canvas.getContext("2d");

// array is color buffer
function array_to_frame(frameBuffer) {
    var width = frameBuffer.width;
    var height = frameBuffer.height;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let color = frameBuffer.bufferArray[y * width + x];
            ctx.fillStyle = colorRGB2Hex(color);
            ctx.fillRect(x, y, 1, 1);
        }
    }
}