// Load 3D object
function loadOBJ(file, onLoad) {
    var onProgress = function (query) {
        if (query.lengthComputable) {
            var percentComplete = query.loaded / query.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    var onError = function () {
        console.log('Failed to load ' + file);
    };

    var loader = new THREE.OBJLoader();
    loader.load(file, onLoad, onProgress, onError);
}


function setup_renderer() {
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    document.body.appendChild(renderer.domElement);
    return renderer;
}


function setup_camera(scene, cameraDefaultPos) {
    var aspect = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
    camera.position.copy(cameraDefaultPos);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.add(camera);
    return camera;
}


function init_floor(gridRadius) {
    var floorTexture = new THREE.TextureLoader().load('images/checkerboard.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);

    var floorMaterial = new THREE.LineBasicMaterial({color: 0x2121ae});

    var floorGeometry = new THREE.Geometry();
    for (var i = -gridRadius; i < gridRadius+1; i += 2) {
        floorGeometry.vertices.push(new THREE.Vector3(i, 0, -gridRadius));
        floorGeometry.vertices.push(new THREE.Vector3(i, 0, gridRadius));
        floorGeometry.vertices.push(new THREE.Vector3(-gridRadius, 0, i));
        floorGeometry.vertices.push(new THREE.Vector3(gridRadius, 0, i));
    }

    var floor = new THREE.Line(floorGeometry, floorMaterial, THREE.LinePieces);
    floor.position.y = -0.1;

    return floor;
}
