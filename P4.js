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
var gridRadius = 25;
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

    // TODO: refactor accel
    player.xAccel = 0;
    player.yAccel = 0;
    player.zAccel = 0;
};

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
var keyHash = {};
var movementSpeed = 0.1;
var keyboard = new THREEx.KeyboardState();
var decelRate = movementSpeed / 3;
var maxAccel = 0.5;
var render = function () {
    // tip: change armadillo shading here according to keyboard
    if (player) {
        if (keyHash['W']) {
            if (Math.abs(player.zAccel) < maxAccel) {
                player.zAccel -= movementSpeed;
            }
        } else if (keyHash['S']) {
            if (Math.abs(player.zAccel) < maxAccel) {
                player.zAccel += movementSpeed;
            }
        }

        if (keyHash['A']) {
            if (Math.abs(player.xAccel) < maxAccel) {
                player.xAccel -= movementSpeed;
            }
        } else if (keyHash['D']) {
            if (Math.abs(player.xAccel) < maxAccel) {
                player.xAccel += movementSpeed;
            }
        }

        if (player.zAccel != 0) {
            player.position.z += player.zAccel;
            if (player.zAccel > 0) {
                player.zAccel = player.zAccel > decelRate ? player.zAccel - decelRate : 0;
            } else {
                player.zAccel = player.zAccel < decelRate ? player.zAccel + decelRate : 0;
            }
        }

        if (player.xAccel != 0) {
            player.position.x += player.xAccel;
            if (player.xAccel > 0) {
                player.xAccel = player.xAccel > decelRate ? player.xAccel - decelRate : 0;
            } else {
                player.xAccel = player.xAccel < decelRate ? player.xAccel + decelRate : 0;
            }
        }

        /// CAMERA WORK ///
        if (player) {
            camera.position.x = player.position.x / 4;
            camera.position.z = player.position.z / 4 + cameraDefaultPos.z;
            camera.lookAt(player.position);
        }

        /// PICKING PLAYER FACING DIRECTION ///
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera( mouse, camera );

        // calculate objects intersecting the picking ray
        var intersect = raycaster.intersectObject(floor);
        if (intersect[0] && player) {
            var direction = new THREE.Vector3();
            direction.subVectors(intersect[0].point, player.position);
            direction.normalize();
            var angle = Math.atan2(direction.x, direction.z);
            player.rotation.z = angle; // this is weird cuz should be y (we rotated on player obj initialization)
        }
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

keyboard.domElement.addEventListener('keydown', onKeyDown);
keyboard.domElement.addEventListener('keyup', onKeyUp);
window.addEventListener( 'mousemove', onMouseMove, false );

function onKeyDown(event) {
        keyHash[String.fromCharCode(event.which)] = true;
}

function onKeyUp(event) {
    keyHash[String.fromCharCode(event.which)] = false;
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

render();
