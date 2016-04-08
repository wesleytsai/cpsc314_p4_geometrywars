"use strict";

var enemyFollowGeo = new THREE.DodecahedronGeometry(0.4);
var enemyFollowMat = new THREE.MeshBasicMaterial({
    color: 'yellow',
    wireframe: true
});
function createEnemyFollower() {

    var direction = new THREE.Vector3(Math.random(), 0, Math.random());
    direction.normalize();

    var enemy = new THREE.Mesh(enemyFollowGeo, enemyFollowMat);
    enemy.rotation.set(-Math.PI / 2, 0, 0);
    var posX = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    var posZ = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    enemy.rotation.set(-Math.PI/2, 0, 0);
    enemy.position.set(posX, FLOAT_HEIGHT, posZ);
    enemy.type = 'enemy';
    addMovementProperties(enemy, player.maxAccel / 2, 0.02, 0.005);
    enemy.movementType = 'follow';

    enemy.accel.set(direction.x * enemy.accelRate, 0, direction.z * enemy.accelRate);

    return enemy;
}

function createEnemyLine() {
    var enemyLineGeo = new THREE.TetrahedronGeometry(0.8, 2);
    var enemyLineMat = new THREE.MeshBasicMaterial({
        color: 'green',
        wireframe: true
    });
    var rand = Math.random();
    var direction
    if (rand > 0.5) {
        direction = new THREE.Vector3(1, 0, 0);
    } else {
        direction = new THREE.Vector3(0, 0, 1);
    }

    var enemy = new THREE.Mesh(enemyLineGeo, enemyLineMat);
    enemy.rotation.set(-Math.PI / 2, 0, 0);
    var posX = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    var posZ = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    enemy.rotation.set(-Math.PI/2, 0, 0);
    enemy.position.set(posX, FLOAT_HEIGHT, posZ);
    enemy.type = 'enemy';
    addMovementProperties(enemy, 1, player.maxAccel / 2, 0);

    enemy.accel.set(direction.x * enemy.accelRate, 0, direction.z * enemy.accelRate);

    return enemy;
}

function createEnemyRandom() {
    var enemyRandomGeo = new THREE.RingGeometry(0.4, 0.6);
    var enemyRandomMat = new THREE.MeshBasicMaterial({
        color: 'red'
    });

    var direction = new THREE.Vector3(Math.random(), 0, Math.random());
    direction.normalize();

    var enemy = new THREE.Mesh(enemyRandomGeo, enemyRandomMat);
    enemy.rotation.set(-Math.PI / 2, 0, 0);
    var posX = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    var posZ = Math.random() * GRID_RADIUS * 2 - GRID_RADIUS;
    enemy.rotation.set(-Math.PI/2, 0, 0);
    enemy.position.set(posX, FLOAT_HEIGHT, posZ);
    enemy.type = 'enemy';
    addMovementProperties(enemy, 1, player.maxAccel / 2, 0);

    enemy.accel.set(direction.x * enemy.accelRate, 0, direction.z * enemy.accelRate);

    return enemy;
}


function spawn_enemies (ticks) {
    /// SPAWN ENEMIES ///
    if (ticks % 100 == 0) {
        for (var i = 0; i < __render_ticks / 1000; i++) {
            scene.add(createEnemyRandom());
            scene.add(createEnemyFollower());
            scene.add(createEnemyLine());
        }
    }
}
