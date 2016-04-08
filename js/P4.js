var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = setup_renderer();

// SETUP CAMERA
var cameraDefaultPos = new THREE.Vector3(0, 35, 50);
var camera = setup_camera(scene, cameraDefaultPos);

// SETUP ORBIT CONTROL OF THE CAMERA
// TODO?

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD
var floor = init_floor(GRID_RADIUS);
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
var phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightColor: {type: 'c', value: lightColor},
        ambientColor: {type: 'c', value: ambientColor},
        lightPosition: {type: 'v3', value: lightPosition},
        kAmbient: {type: 'f', value: kAmbient},
        kDiffuse: {type: 'f', value: kDiffuse},
        kSpecular: {type: 'f', value: kSpecular},
        shininess: {type: 'f', value: shininess}
    }
});

shaderFiles = [
    'glsl/phong.vs.glsl',
    'glsl/phong.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
    phongMaterial.vertexShader = shaders['glsl/phong.vs.glsl'];
    phongMaterial.fragmentShader = shaders['glsl/phong.fs.glsl'];
    phongMaterial.needsUpdate = true;
});


var floatHeight = 1;
function onLoadPlayer(object) {
    material = phongMaterial;
    player = object;
    player.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = material;
        }
    });
    var playerScale = 0.02;
    player.scale.set(playerScale , playerScale, playerScale);
    player.rotation.set(-Math.PI/2, 0, Math.PI);
    player.position.set(0, floatHeight, 0);
    player.type = 'player';
    scene.add(player);
    addMovementProperties(player, 0.75, 0.1, 0.05);
}

function addMovementProperties(object, maxAccel, accelRate, decelRate) {
    object.maxAccel = maxAccel;
    object.accelRate = accelRate;
    object.accel = new THREE.Vector3(0,0,0);
    object.decelRate = decelRate;
    movingObjects.push(object);
}

var player;
loadOBJ('obj/player.obj', onLoadPlayer);

// SETUP UPDATE CALL-BACK
var movingObjects = [];
var keyHash = {};
var keyboard = new THREEx.KeyboardState();
var mouseMapIntersection;
var ticks = 0;
var enemiesSpawnedTillNow = 0;
var render = function () {

    if (player) {
        resetSpacialHash();
        handleKeystroke();

        for (var i = 0; i < movingObjects.length; i++) {
            var object = movingObjects.shift();
            handleMovement(object);
            handleCollision(object);

            // Handle Death
            if (object.life != null) {
                object.life -= 1;
                object.material.opacity = object.life / 100.0 + 0.1;
                if (object.life < 0) {
                    scene.remove(object);
                    continue;
                }
            }
            movingObjects.push(object);
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

        /// SPAWN ENEMIES ///

        if (ticks % 100 == 0) {
            for (var i = 0; i < ticks / 1000; i++) {
                createEnemyRandom();
                createEnemyFollower();
            }
        }

        ticks += 1;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

function handleCollision(object) {
    if (object.type == 'player') {
        var collidedObjects = getCollidedObjectsInRadius(object.position, 1);
        for (i in collidedObjects) {
            if (collidedObjects[i].type == 'enemy') {
                scene.remove(player);
            }
        }
    } else if (object.type == 'projectile') {
        var collidedObjects = getCollidedObjectsInRadius(object.position, 1.5);
        for (i in collidedObjects) {
            if (collidedObjects[i].type == 'enemy') {
                object.life = 0;
                collidedObjects[i].life = 0;
            }
        }
    }
}

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function followPlayer(object) {
    var direction = new THREE.Vector3();
    direction.subVectors(player.position, object.position);
    direction.normalize();
    var accelRate = object.accelRate;
    object.accel.add(new THREE.Vector3(accelRate*direction.x, 0, accelRate*direction.z));

}
function handleMovement(object) {
    if (object.movementType == 'follow') {
        followPlayer(object);
    }

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

}

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

keyboard.domElement.addEventListener('keydown', onKeyDown);
keyboard.domElement.addEventListener('keyup', onKeyUp);
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseClick, false );

function onMouseClick(event) {
    if (mouseMapIntersection[0]) {
        var point = mouseMapIntersection[0].point;
        createProjectile(player.position, point);
    }
}

function createEnemyRandom() {
    var direction = new THREE.Vector3(Math.random(), 0, Math.random());
    direction.normalize();

    geo = new THREE.RingGeometry(0.4, 0.6);
    mat = new THREE.MeshBasicMaterial({
        color: 'red'
    });

    enemy = new THREE.Mesh(geo, mat);
    var posX = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    var posZ = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    enemy.rotation.set(-Math.PI/2, 0, 0);
    enemy.position.set(posX, floatHeight, posZ);
    enemy.type = 'enemy'
    addMovementProperties(enemy, 1, player.maxAccel / 2, 0);
    scene.add(enemy);

    enemy.accel.set(direction.x * enemy.accelRate, 0, direction.z * enemy.accelRate);
}

var spacialHash = [];

function resetSpacialHash() {
    spacialHash = [];
    for (var x = 0; x < GRID_RADIUS * 2; x++) {
        spacialHash.push([]);
        for (var y = 0; y < GRID_RADIUS * 2; y++) {
            spacialHash[x][y] = [];
        }
    }

    for (var i = 0; i < movingObjects.length; i++) {
        var object = movingObjects[i];
        var posX = Math.floor(object.position.x) + GRID_RADIUS;
        var posY = Math.floor(object.position.y) + GRID_RADIUS;
        spacialHash[posX][posY].push(object);
    }
}

function getCollidedObjectsInRadius(pos, radius) {
    var list = [];
    // so we don't need to square root distance calculations
    var radiusSqr = radius * radius;

    // Pos could be negative, so we shift it to start from 0, then search through the radius for other entities
    // SPAGHETTI BUT ITS FAST I SWEAR
    for (var x = Math.floor(pos.x) + GRID_RADIUS - Math.ceil(radius); x < Math.ceil(pos.x) + GRID_RADIUS + Math.ceil(radius); x++) {
        for (var y = Math.floor(pos.y) + GRID_RADIUS - Math.ceil(radius); y < Math.ceil(pos.y) + GRID_RADIUS + Math.ceil(radius); y++) {
            if (x > 0 && x < GRID_RADIUS * 2 && y > 0 && y < GRID_RADIUS * 2) {
                var entities = spacialHash[x][y];
                for (i in entities) {
                    if (pos.distanceTo(entities[i].position) < radiusSqr) {
                        list.push(entities[i]);
                    }
                }
            }
        }
    }
    return list;
}

function createEnemyFollower() {
    var direction = new THREE.Vector3(Math.random(), 0, Math.random());
    direction.normalize();

    geo = new THREE.DodecahedronGeometry(0.4);
    mat = new THREE.MeshBasicMaterial({
        color: 'yellow',
        wireframe: true
    });

    enemy = new THREE.Mesh(geo, mat);
    var posX = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    var posZ = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    enemy.rotation.set(-Math.PI/2, 0, 0);
    enemy.position.set(posX, floatHeight, posZ);
    enemy.type = 'enemy';
    addMovementProperties(enemy, player.maxAccel / 2, 0.02, 0.005);
    enemy.movementType = 'follow';
    scene.add(enemy);

    enemy.accel.set(direction.x * enemy.accelRate, 0, direction.z * enemy.accelRate);
}

function createProjectile(initPos, destination) {
    var direction = new THREE.Vector3();
    direction.subVectors(destination, initPos);
    direction.normalize();
    geo = new THREE.SphereGeometry(0.2, 4, 4);
    mat = new THREE.MeshBasicMaterial({
        color: 'white',
        transparent: true,
    });
    proj = new THREE.Mesh(geo, mat);
    proj.position.copy(initPos);
    scene.add(proj);
    proj.type = 'projectile';

    addMovementProperties(proj, 2, 2, 0.01);
    proj.accel.set(direction.x * proj.accelRate, 0 , direction.z * proj.accelRate);
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
