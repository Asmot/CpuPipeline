//load all resource

async function loadOBJ(manager, path, name, onLoad) {
	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log('[asset] model ' + Math.round(percentComplete, 2) + '% downloaded');
		}
	}
	function onError(e) { console.log("[asset] error: loadOBJ " + e)}

    // new THREE.OBJLoader(manager)
    // .setPath(path)
    // .load(name + '.obj', function (object) {
    //     console.log("[asset] THREE.OBJLoader onload " + object);
    //     object.traverse(function (child) {
    //         if (child.isMesh) {
    //             let geo = child.geometry;
    //             var dataBuffer = {
    //                 attributes : {
    //                     aPos : { attr : geo.attributes.position.array, stride : 3},
    //                     aNormal : { attr : geo.attributes.normal.array, stride : 3},
    //                     aCoord : { attr : geo.attributes.uv.array, stride : 2},
    //                 },
    //                 indeices : Array.from({ length: geo.attributes.position.count }, (v, k) => k),
    //                 texture : new Texture("",  mat.map.image)
    //             }
    //             onLoad(dataBuffer); 
                
    //         }
    //     });
    // }, onProgress, onError);

    var url = name + '.obj';
    var loader = new THREE.FileLoader( manager );
    loader.setPath(path );
    loader.load( url, function ( text ) {

        try {

            var parse = function ( text ) {
                var dataBuffer = {
                    attributes : {
                        aPos : { attr : [], stride : 3}
                    },
                    indeices : [],
                    texture : undefined
                }
    
                if ( text.indexOf( '\r\n' ) !== - 1 ) {
                    // This is faster than String.split with regex that splits on both
                    text = text.replace( /\r\n/g, '\n' );
                }
    
                if ( text.indexOf( '\\\n' ) !== - 1 ) {
                    // join lines separated by a line continuation character (\)
                    text = text.replace( /\\\n/g, '' );
                }
    
                var lines = text.split( '\n' );
                var line = '', lineFirstChar = '';
                var lineLength = 0;
                var result = [];
    
                // Faster to just trim left side of the line. Use if available.
                var trimLeft = ( typeof ''.trimLeft === 'function' );
                var vertCount = 0;
                var indeicesCount = 0;
                for ( var i = 0, l = lines.length; i < l; i ++ ) {
    
                    line = lines[ i ];
    
                    line = trimLeft ? line.trimLeft() : line.trim();
    
                    lineLength = line.length;
    
                    if ( lineLength === 0 ) continue;
    
                    lineFirstChar = line.charAt( 0 );
    
                    // @todo invoke passed in handler if any
                    if ( lineFirstChar === '#' ) continue;
    
                    if ( lineFirstChar === 'v' ) {
    
                        var data = line.split( /\s+/ );
    
                        switch ( data[ 0 ] ) {
    
                            case 'v':
                                dataBuffer.attributes.aPos.attr[vertCount++] = ( parseFloat( data[ 1 ] ));
                                dataBuffer.attributes.aPos.attr[vertCount++] = ( parseFloat( data[ 2 ] ));
                                dataBuffer.attributes.aPos.attr[vertCount++] = ( parseFloat( data[ 3 ] ));
                                
                                break;
            
                        }
    
                    } else if ( lineFirstChar === 'f' ) {
                        var data = line.split( /\s+/ );
                        dataBuffer.indeices[indeicesCount++] = ( parseFloat( data[ 1 ] ) - 1);
                        dataBuffer.indeices[indeicesCount++] = ( parseFloat( data[ 2 ] ) - 1);
                        dataBuffer.indeices[indeicesCount++] = ( parseFloat( data[ 3 ] ) - 1);
                        
    
                    }
                }
                return dataBuffer;
            }



            onLoad( parse( text ) );

        } catch ( e ) {

            if ( onError ) {

                onError( e );

            } else {
                console.error( e );
            }
        }

    }, onProgress, onError );
    
}

async function loadMtlOBJ(manager, path, name, onLoad) {
	function onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log('[asset] model ' + Math.round(percentComplete, 2) + '% downloaded');
		}
	}
	function onError(e) { console.log("[asset] error: loadOBJ " + e)}

	new THREE.MTLLoader(manager)
		.setPath(path)
		.setCrossOrigin( 'Anonymous')
		.load(name + '.mtl', function (materials) {
			materials.preload();
			console.log("[asset] THREE.MTLLoader onload " + materials);
            setTimeout(function(){
                new THREE.OBJLoader(manager)
                .setMaterials(materials)
                .setPath(path)
                .load(name + '.obj', function (object) {
                    console.log("[asset] THREE.OBJLoader onload " + object);
                    object.traverse(function (child) {
                        if (child.isMesh) {
                            let geo = child.geometry;
                            let mat;
                            if (Array.isArray(child.material)) mat = child.material[0];
                            else mat = child.material;
                            if (mat.map != null) {
                                var dataBuffer = {
                                    attributes : {
                                        aPos : { attr : geo.attributes.position.array, stride : 3},
                                        aNormal : { attr : geo.attributes.normal.array, stride : 3},
                                        aCoord : { attr : geo.attributes.uv.array, stride : 2},
                                    },
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


class AssetKey {
    constructor(rootPath, name) {
        this.rootPath = rootPath;
        this.name = name;
        this.key = this.getKey();
    }
    getKey() {
        return this.rootPath + this.name;
    }
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
        this.assetsList = {}
        this.objInfoList = {}
    }
    addMtlPath(itemKey) {
        this.mtlInfoList[itemKey.key] = itemKey;
    }
    addObjPath(itemKey) {
        this.objInfoList[itemKey.key] = itemKey;
    }
    async loadMtl(rootPath, name) {
        return new Promise((resolve, reject) => {
            var loadObjComplete = function(dataBuffer) {
                resolve(dataBuffer);
            }
            loadMtlOBJ(this.manager, rootPath, name, loadObjComplete)
        })  
    }
    async loadObj(rootPath, name) {
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
            this.assetsList[key] = dataBuffer;
            console.log("[asset] loadMtl complete " + key)
        }
        for (const key in this.objInfoList) {
            var infos = this.objInfoList[key];
            var dataBuffer = await this.loadObj(infos.rootPath, infos.name)
            this.assetsList[key] = dataBuffer;
            console.log("[asset] loadobj complete " + key)
        }
      
        console.log("[asset] loadAllAssets complete")
        if (onLoad) {
            onLoad();
        }
    }
    getMtlBuffer(itemKey) {
        return this.assetsList[itemKey.key];
    }
    getBuffer(itemKey) {
        return this.assetsList[itemKey.key];
    }

}