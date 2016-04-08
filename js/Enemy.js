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
