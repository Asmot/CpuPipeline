//load all resource

async function loadOBJ(manager, path, name, onLoad) {
	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');
		}
	}
	function onError(e) { console.log("loadOBJ error " + e)}

	new THREE.MTLLoader(manager)
		.setPath(path)
		.setCrossOrigin( 'Anonymous')
		.load(name + '.mtl', function (materials) {
			materials.preload();
			console.log("THREE.MTLLoader onload " + materials);
            setTimeout(function(){
                new THREE.OBJLoader(manager)
                .setMaterials(materials)
                .setPath(path)
                .load(name + '.obj', function (object) {
                    console.log("THREE.OBJLoader onload " + object);
                    object.traverse(function (child) {
                        if (child.isMesh) {
                            let geo = child.geometry;
                            let mat;
                            if (Array.isArray(child.material)) mat = child.material[0];
                            else mat = child.material;
                            if (mat.map != null) {
                                var dataBuffer = {
                                    vert : [
                                        geo.attributes.position.array,
                                        geo.attributes.normal.array,
                                        geo.attributes.uv.array
                                    ],
                                    vertStride : [
                                        3, 3, 2
                                    ],
                                    indeices : Array.from({ length: geo.attributes.position.count }, (v, k) => k),
                                    texture : new Texture("",  mat.map.image)
                                }
                                onLoad(dataBuffer); 
                            }
                        }
                    });
                }, onProgress, onError);
        }, 100);
		});
}

function getKey(rootPath, name) {
    return rootPath + name
}

class AssetsManager{
    constructor() {
        this.manager = new THREE.LoadingManager();
        this.manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total);
        };
        this.mtlInfoList = {}
        this.mtlList = {}
    }
    addMtlPath(rootPath, name) {
        var key = getKey(rootPath, name);
        this.mtlInfoList[key] = {
            rootPath:rootPath,
            name:name
        }
    }
    async loadMtl(rootPath, name) {
        return new Promise((resolve, reject) => {
            var loadObjComplete = function(dataBuffer) {
                resolve(dataBuffer);
            }
            loadOBJ(this.manager, rootPath, name, loadObjComplete)
        })  
    }

    async loadAllAssets(onLoad) {
        for (const key in this.mtlInfoList) {
            var infos = this.mtlInfoList[key];
            var dataBuffer = await this.loadMtl(infos.rootPath, infos.name)
            this.mtlList[key, dataBuffer]
            console.log("[asset] loadMtl complete " + key)
        }
      
        console.log("[asset] loadAllAssets complete")
        if (onLoad) {
            onLoad();
        }
    }
    getMtlBuffer(rootPath, name) {
        var key = getKey(rootPath, name);
        return this.mtlList[key];
    }

}