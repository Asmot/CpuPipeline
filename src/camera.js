class Camera {
    constructor() {
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    
        mat4.identity(this.viewMatrix);
        mat4.identity(this.projectionMatrix);
    }
};