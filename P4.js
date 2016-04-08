/**
 * UBC CPSC 314, January 2016
 * Project 3 Template
 */

var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0);
document.body.appendChild(renderer.domElement);

// SETUP CAMERA
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
var cameraDefaultPos = new THREE.Vector3(0, 40, 40);
camera.position.copy(cameraDefaultPos);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD
var floorTexture = new THREE.TextureLoader().load('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);

var floorMaterial = new THREE.LineBasicMaterial({color: 0x2121ae});

var floorGeometry = new THREE.Geometry();
var gridRadius = 30;
for (var i = -gridRadius; i < gridRadius+1; i += 2) {
    floorGeometry.vertices.push(new THREE.Vector3(i, 0, -gridRadius));
    floorGeometry.vertices.push(new THREE.Vector3(i, 0, gridRadius));
    floorGeometry.vertices.push(new THREE.Vector3(-gridRadius, 0, i));
    floorGeometry.vertices.push(new THREE.Vector3(gridRadius, 0, i));
}

var floor = new THREE.Line(floorGeometry, floorMaterial, THREE.LinePieces);
floor.position.y = -0.1;
scene.add(floor);

// LIGHTING UNIFORMS
var lightColor = new THREE.Color(1, 1, 1);
var ambientColor = new THREE.Color(0.4, 0.4, 0.4);
var lightPosition = new THREE.Vector3(70, 250, 70);

var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;
var shininess = 10.0;

// MATERIALS
var gouraudMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
        kAmbient: {type: 'f', value: kAmbient},
        kDiffuse: {type: 'f', value: kDiffuse},
        kSpecular: {type: 'f', value: kSpecular},
        shininess: {type: 'f', value: shininess},
    },
});

var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
        kAmbient: {type: 'f', value: kAmbient},
        kDiffuse: {type: 'f', value: kDiffuse},
        kSpecular: {type: 'f', value: kSpecular},
        shininess: {type: 'f', value: shininess},
    },
});

var blinnphongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
        kAmbient: {type: 'f', value: kAmbient},
        kDiffuse: {type: 'f', value: kDiffuse},
        kSpecular: {type: 'f', value: kSpecular},
        shininess: {type: 'f', value: shininess},
    },
});

shaderFiles = [
    'glsl/gouraud.vs.glsl',
    'glsl/gouraud.fs.glsl',
    'glsl/phong.vs.glsl',
    'glsl/phong.fs.glsl',
    'glsl/blinnphong.vs.glsl',
    'glsl/blinnphong.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
    gouraudMaterial.vertexShader = shaders['glsl/gouraud.vs.glsl'];
    gouraudMaterial.fragmentShader = shaders['glsl/gouraud.fs.glsl'];
    gouraudMaterial.needsUpdate = true;

    phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
    phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
    phongMaterial.needsUpdate = true;

    blinnphongMaterial.vertexShader = shaders['glsl/blinnphong.vs.glsl'];
    blinnphongMaterial.fragmentShader = shaders['glsl/blinnphong.fs.glsl'];
    blinnphongMaterial.needsUpdate = true;
})

// LOAD ARMADILLO
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

function onLoadPlayer(object) {
    material = phongMaterial;
    player = object;
    player.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
    });
    var playerScale = 0.02
    var floatHeight = 1;
    player.scale.set(playerScale , playerScale, playerScale);
    player.rotation.set(-Math.PI/2, 0, Math.PI);
    player.position.set(0, floatHeight, 0);
    scene.add(player);
    addMovementProperties(player, 0.75, 0.1, 0.05);
};

function addMovementProperties(object, maxAccel, accelRate, decelRate) {
    object.maxAccel = maxAccel;
    object.accelRate = accelRate;
    object.accel = new THREE.Vector3(0,0,0);
    object.decelRate = decelRate;
    movingObjects.push(object);
}

var player;
loadOBJ('obj/player.obj', onLoadPlayer);

// CREATE SPHERES
var sphere = new THREE.SphereGeometry(1, 32, 32);
var gem_gouraud = new THREE.Mesh(sphere, gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
//scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, phongMaterial);
gem_phong.position.set(-1, 1, -1);
//scene.add(gem_phong);
gem_phong.parent = floor;

var gem_phong_blinn = new THREE.Mesh(sphere, blinnphongMaterial);
gem_phong_blinn.position.set(1, 1, -1);
//scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

// SETUP UPDATE CALL-BACK
var movingObjects = []
var keyHash = {};
var keyboard = new THREEx.KeyboardState();
var mouseMapIntersection;
var render = function () {
    // tip: change armadillo shading here according to keyboard
    if (player) {
        handleKeystroke();

        for (var i = 0; i < movingObjects.length; i++) {
            handleMovement(movingObjects.shift());
        }

        /// CAMERA WORK ///
        camera.position.x = player.position.x / 4;
        camera.position.z = player.position.z / 4 + cameraDefaultPos.z;
        camera.lookAt(player.position);

        /// PICKING PLAYER FACING DIRECTION ///
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );

        // calculate objects intersecting the picking ray
        mouseMapIntersection = raycaster.intersectObject(floor);
        if (mouseMapIntersection[0]) {
            var direction = new THREE.Vector3();
            direction.subVectors(mouseMapIntersection[0].point, player.position);
            direction.normalize();
            var angle = Math.atan2(direction.x, direction.z);
            player.rotation.z = angle; // this is weird cuz should be y (we rotated on player obj initialization)
        }
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function handleMovement(object) {
    if (object.accel.z != 0) {
        object.position.z += object.accel.z;
        // If outta bounds bounce off the wall
        if (isUpOOB(object) || isDownOOB(object)) {
            object.position.z -= object.accel.z;
            object.accel.z = -object.accel.z;
        }
        if (object.accel.z > 0) {
            object.accel.z = object.accel.z > object.decelRate ? object.accel.z - object.decelRate : 0;
        } else {
            object.accel.z = object.accel.z < object.decelRate ? object.accel.z + object.decelRate : 0;
        }
    }

    if (object.accel.x != 0) {
        object.position.x += object.accel.x;
        // If outta bounds bounce off the wall
        if (isLeftOOB(object) || isRightOOB(object)) {
            object.position.x -= object.accel.x;
            object.accel.x = -object.accel.x;
        }

        if (object.accel.x > 0) {
            object.accel.x = object.accel.x > object.decelRate ? object.accel.x - object.decelRate : 0;
        } else {
            object.accel.x = object.accel.x < object.decelRate ? object.accel.x + object.decelRate : 0;
        }
    }

    if (object.life != null) {
        object.life -= 1;
        object.material.opacity = object.life / 100.0 + 10;
        if (object.life < 0) {
            scene.remove(object);
            return;
        }
    }

    movingObjects.push(object);
}

function isLeftOOB(object) {
    return object.position.x <= -gridRadius;
}

function isRightOOB(object) {
    return object.position.x > gridRadius;
}

function isUpOOB(object) {
    return object.position.z > gridRadius;
}

function isDownOOB(object) {
    return object.position.z <= -gridRadius;
}

keyboard.domElement.addEventListener('keydown', onKeyDown);
keyboard.domElement.addEventListener('keyup', onKeyUp);
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'click', onMouseClick, false );

function onMouseClick(event) {
    if (mouseMapIntersection[0]) {
        var point = mouseMapIntersection[0].point;
        createProjectile(player.position, point, phongMaterial);
    }
}

function createProjectile(initPos, destination, material) {
    var direction = new THREE.Vector3();
    direction.subVectors(destination, initPos);
    direction.normalize();
    pGeo = new THREE.SphereGeometry(0.2, 4, 4);
    pMaterial = new THREE.MeshBasicMaterial({
        color: 'green'
    });
    pMaterial.transparent = true;
    proj = new THREE.Mesh(pGeo, pMaterial);
    proj.position.copy(initPos);
    scene.add(proj);

    addMovementProperties(proj, 2, 2, 0.01);
    proj.accel = new THREE.Vector3(direction.x * proj.accelRate, 0 , direction.z * proj.accelRate);
    proj.life = 100;
    return proj;
}

function onKeyDown(event) {
    keyHash[String.fromCharCode(event.which)] = true;
}

function onKeyUp(event) {
    keyHash[String.fromCharCode(event.which)] = false;
}

function handleKeystroke() {
    if (keyHash['W']) {
        if (Math.abs(player.accel.z) < player.maxAccel) {
            player.accel.z -= player.accelRate;
        }
    } else if (keyHash['S']) {
        if (Math.abs(player.accel.z) < player.maxAccel) {
            player.accel.z += player.accelRate;
        }
    }

    if (keyHash['A']) {
        if (Math.abs(player.accel.x) < player.maxAccel) {
            player.accel.x -= player.accelRate;
        }
    } else if (keyHash['D']) {
        if (Math.abs(player.accel.x) < player.maxAccel) {
            player.accel.x += player.accelRate;
        }
    }
}


render();
