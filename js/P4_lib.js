////////////////
// Misc. Util //
////////////////

function loadOBJ(file, onLoad) {
    // Load 3D object

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


////////////////
// Scene Init //
////////////////

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

function init_floor() {
    var floorTexture = new THREE.TextureLoader().load('images/checkerboard.jpg');
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);

    var floorMaterial = new THREE.LineBasicMaterial({color: 0x2121ae});

    var floorGeometry = new THREE.Geometry();
    for (var i = -GRID_RADIUS; i < GRID_RADIUS+1; i += 2) {
        floorGeometry.vertices.push(new THREE.Vector3(i, 0, -GRID_RADIUS));
        floorGeometry.vertices.push(new THREE.Vector3(i, 0, GRID_RADIUS));
        floorGeometry.vertices.push(new THREE.Vector3(-GRID_RADIUS, 0, i));
        floorGeometry.vertices.push(new THREE.Vector3(GRID_RADIUS, 0, i));
    }

    var floor = new THREE.Line(floorGeometry, floorMaterial, THREE.LinePieces);
    floor.position.y = -0.1;

    return floor;
}


////////////////////
// Bounds Testing //
////////////////////

function isLeftOOB(object) {
    return object.position.x <= -GRID_RADIUS;
}

function isRightOOB(object) {
    return object.position.x > GRID_RADIUS;
}

function isUpOOB(object) {
    return object.position.z > GRID_RADIUS;
}

function isDownOOB(object) {
    return object.position.z <= -GRID_RADIUS;
}
