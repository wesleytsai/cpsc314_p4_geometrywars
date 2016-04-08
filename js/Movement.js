function followPlayer(player, object) {
    var direction = new THREE.Vector3();
    direction.subVectors(player.position, object.position);
    direction.normalize();
    var accelRate = object.accelRate;
    object.accel.add(new THREE.Vector3(accelRate * direction.x, 0, accelRate * direction.z));
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
