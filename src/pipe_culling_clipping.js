



// projection and culipping
function culling(triangles) {
    
    triangles.forEach(point => {
        // culling outof space
        let position = point.gl_Position;
        if(!((position[0] <= 1 && position[0] >= -1) &&
            (position[1] <= 1 && position[1] >= -1))) {
            triangles.splice(point)
        }
    });
}