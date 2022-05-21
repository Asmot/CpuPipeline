// https://glmatrix.net/docs/module-mat4.html

class Camera {
    constructor(width, height) {
        this.viewMatrix = mat4.create();
        this.projectionMatrix = mat4.create();
    
        mat4.identity(this.viewMatrix);
        mat4.identity(this.projectionMatrix);

        this.pos =[0, 0, -50];
        this.rotate = 0;
        this.pitch = 0;
        this.width = width;
        this.height = height;
        this.fovR = 60;
        this.aspect = height / width;
        this.near = 0.1;
        this.far = 1000;
    }

    update() {
        const halfHeight = this.height / 2;
        const halfFov = this.fovR / 2;
        const cameraToCenterDistance = halfHeight / Math.tan(halfFov);


        this.cameraModelMat = mat4.create();
        mat4.identity(this.cameraModelMat);
        mat4.translate(this.cameraModelMat, this.cameraModelMat, this.pos);
        mat4.rotateZ(this.cameraModelMat, this.cameraModelMat, -this.rotate);
        mat4.rotateX(this.cameraModelMat, this.cameraModelMat, this.pitch);
        mat4.translate(this.cameraModelMat, this.cameraModelMat, [0, 0, cameraToCenterDistance]);
    
        mat4.invert(this.viewMatrix, this.cameraModelMat);

        mat4.perspective(this.projectionMatrix, this.fovR, this.aspect, this.near, this.far);

    }
    
    getViewMatrix() {
        return this.viewMatrix;
    }
    getProjectionMatrix() {
        return this.projectionMatrix;
    }
};