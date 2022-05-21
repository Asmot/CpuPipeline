


// check depth with the buffer
function depthtest(colorWithBuffers, frameBuffer) {

    for (let index = 0; index < colorWithBuffers.length; index++) {
        const item = colorWithBuffers[index];
        let bufferDepth = frameBuffer.getDepthValue(item.s_x, item.s_y);
        if (item.depth > bufferDepth) {
            colorWithBuffers.splice(index, 1);
        } else {
            frameBuffer.setDepthValue(item.s_x, item.s_y, item.depth)
        }
    }
    return colorWithBuffers;
}