var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = setup_renderer();

// SETUP CAMERA
var cameraDefaultPos = new THREE.Vector3(0, 35, 50);
var camera = setup_camera(scene, cameraDefaultPos);

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD
var floor = create_floor();
scene.add(floor);

// ADD LIGHTING TO SCENE
init_lighting(scene);


function onLoadPlayer(object) {
    player = create_player(object);
    scene.add(player);
    addMovementProperties(player, 0.75, 0.1, 0.05);
}


var player;
loadOBJ('obj/player.obj', onLoadPlayer);

// SETUP UPDATE CALL-BACK
var mouseMapIntersection;
var ticks = 0;
var render = function () {

    if (player) {
        resetSpacialHash();
        handleKeystroke(player);

        for (var i = 0; i < movingObjects.length; i++) {
            var object = movingObjects.shift();
            handleMovement(player, object);
            handleCollision(player, object);

            // Handle Death
            if (object.life != null) {
                object.life -= 1;
                if (object.material)
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
        raycaster.setFromCamera(mouse, camera);

        // calculate objects intersecting the picking ray
        mouseMapIntersection = raycaster.intersectObject(floor);
        if (mouseMapIntersection[0]) {
            var direction = new THREE.Vector3();
            direction.subVectors(mouseMapIntersection[0].point, player.position);
            direction.normalize();
            var angle = Math.atan2(direction.x, direction.z);
            player.rotation.y = angle + Math.PI/2; // this is weird cuz should be y (we rotated on player obj initialization)
        }

        /// SPAWN ENEMIES ///

        if (ticks % 100 == 0) {
            for (var i = 0; i < ticks / 1000; i++) {
                scene.add(createEnemyRandom());
                scene.add(createEnemyFollower());
            }
        }

        ticks += 1;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
};


var raycaster = new THREE.Raycaster();

function createProjectile(initPos, destination) {
    var direction = new THREE.Vector3();
    direction.subVectors(destination, initPos);
    direction.normalize();
    geo = new THREE.SphereGeometry(0.2, 4, 4);
    mat = new THREE.MeshBasicMaterial({
        color: 'white',
        transparent: true
    });
    proj = new THREE.Mesh(geo, mat);
    proj.position.copy(initPos);
    scene.add(proj);
    proj.type = 'projectile';

    addMovementProperties(proj, 2, 2, 0.01);
    proj.accel.set(direction.x * proj.accelRate, 0, direction.z * proj.accelRate);
    proj.life = 100;
    return proj;
}


render();
