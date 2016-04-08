"use strict";


function followPlayer(player, object) {
    var direction = new THREE.Vector3();
    direction.subVectors(player.position, object.position);
    direction.normalize();
    var accelRate = object.accelRate;
    object.accel.add(new THREE.Vector3(accelRate * direction.x, 0, accelRate * direction.z));
}

function handleMovement(player, object) {
    if (object.movementType == 'follow') {
        followPlayer(player, object);
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
