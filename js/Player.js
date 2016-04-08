"use strict";


function create_player(object) {
    var player = object;
    var playerTexture = new THREE.TextureLoader().load('images/playerTexture.jpg');
    player.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhongMaterial({
                map: playerTexture
            });
        }
    });
    var playerScale = 0.01;
    player.scale.set(playerScale, playerScale, playerScale);
    player.rotation.set(0, -Math.PI/2, 0);
    player.position.set(0, FLOAT_HEIGHT, 0);
    player.type = 'player';

    addMovementProperties(player, 0.75, 0.1, 0.05);
    
    return player;
}


////////////////
// Projectile //
////////////////

function createProjectile(initPos, destination) {
    var direction = new THREE.Vector3();
    direction.subVectors(destination, initPos);
    direction.normalize();
    var geo = new THREE.SphereGeometry(0.2, 4, 4);
    var mat = new THREE.MeshBasicMaterial({
        color: 'white',
        transparent: true
    });
    var proj = new THREE.Mesh(geo, mat);
    proj.position.copy(initPos);
    scene.add(proj);  // XXX? technically adding to scene here is bad design
                      //  I think but this is called by onMouseClick so ¯\_(ツ)_/¯
    proj.type = 'projectile';

    addMovementProperties(proj, 2, 2, 0.01);
    proj.accel.set(direction.x * proj.accelRate, 0, direction.z * proj.accelRate);
    proj.life = 100;
    return proj;
}


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
