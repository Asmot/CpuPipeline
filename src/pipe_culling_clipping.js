



// projection and culipping
function culling(triangles) {
    
    //TODO no effect
    triangles.forEach(point => {
        // culling outof space
        let position = point.gl_Position;
        if( position[0] > 1 ||
            position[0] < -1 ||
            position[1] > 1 ||
            position[1] < -1) {
            triangles.splice(point, 1)
        }

    });
}