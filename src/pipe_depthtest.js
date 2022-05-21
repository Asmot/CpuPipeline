


// check depth with the buffer
function depthtest(colorWithBuffers, frameBuffer) {
    colorWithBuffers.forEach(item => {
        let bufferDepth = frameBuffer.getDepthValue(item.s_x, item.s_y);
        if (item.depth < bufferDepth) {
            colorWithBuffers.slice(item);
        }
    });
}