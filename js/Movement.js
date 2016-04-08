function followPlayer(player, object) {
    var direction = new THREE.Vector3();
    direction.subVectors(player.position, object.position);
    direction.normalize();
    var accelRate = object.accelRate;
    object.accel.add(new THREE.Vector3(accelRate * direction.x, 0, accelRate * direction.z));
}
