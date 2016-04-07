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
camera.position.set(10, 15, 40);
camera.lookAt(scene.position);
scene.add(camera);

// SETUP ORBIT CONTROL OF THE CAMERA
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD
/*
var floorTexture = new THREE.TextureLoader().load('images/checkerboard.jpg');
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4, 4);
*/

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

var coolwarmMaterial = new THREE.ShaderMaterial({
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
    'glsl/coolwarm.vs.glsl',
    'glsl/coolwarm.fs.glsl',
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

    coolwarmMaterial.vertexShader = shaders['glsl/coolwarm.vs.glsl'];
    coolwarmMaterial.fragmentShader = shaders['glsl/coolwarm.fs.glsl'];
    coolwarmMaterial.needsUpdate = true;
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
    var scale = 0.01
    var floatHeight = 1;
    player.scale.set(scale, scale, scale);
    player.rotation.set(-Math.PI/2, 0, 0);
    player.position.set(0, floatHeight, 0);
    scene.add(player);
};

var player;
loadOBJ('obj/player.obj', onLoadPlayer);


// CREATE SPHERES
var sphere = new THREE.SphereGeometry(1, 32, 32);
var gem_gouraud = new THREE.Mesh(sphere, gouraudMaterial); // tip: make different materials for each sphere
gem_gouraud.position.set(-3, 1, -1);
scene.add(gem_gouraud);
gem_gouraud.parent = floor;

var gem_phong = new THREE.Mesh(sphere, phongMaterial);
gem_phong.position.set(-1, 1, -1);
scene.add(gem_phong);
gem_phong.parent = floor;

var gem_phong_blinn = new THREE.Mesh(sphere, blinnphongMaterial);
gem_phong_blinn.position.set(1, 1, -1);
scene.add(gem_phong_blinn);
gem_phong_blinn.parent = floor;

var gem_toon = new THREE.Mesh(sphere, coolwarmMaterial);
gem_toon.position.set(3, 1, -1);
scene.add(gem_toon);
gem_toon.parent = floor;

// SETUP UPDATE CALL-BACK
var keyboard = new THREEx.KeyboardState();
var render = function () {
    // tip: change armadillo shading here according to keyboard
    if (keyHash['W']) {
        player.position.z -= movementSpeed;
    } else if (keyHash['S']) {
        player.position.z += movementSpeed;
    }

    if (keyHash['A']) {
        player.position.x -= movementSpeed;
    } else if (keyHash['D']) {
        player.position.x += movementSpeed;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

keyboard.domElement.addEventListener('keydown', onKeyDown);
keyboard.domElement.addEventListener('keyup', onKeyUp);

var keyHash = {};
var movementSpeed = 1;
function onKeyDown(event) {
        keyHash[String.fromCharCode(event.which)] = true;
}

function onKeyUp(event) {
    keyHash[String.fromCharCode(event.which)] = false;
}

render();
