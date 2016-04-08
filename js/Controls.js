"use strict";


///////////
// Mouse //
///////////

var mouse = new THREE.Vector2();
var mouseMapIntersection;

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseClick(event) {
    if (mouseMapIntersection[0]) {
        var point = mouseMapIntersection[0].point;
        createProjectile(player.position, point);
    }
}

window.addEventListener('mousemove', onMouseMove, false);
window.addEventListener('mousedown', onMouseClick, false);


//////////////
// Keyboard //
//////////////

var keyboard = new THREEx.KeyboardState();

keyboard.domElement.addEventListener('keydown', onKeyDown);
keyboard.domElement.addEventListener('keyup', onKeyUp);

    /////////////////////
    // Player Movement //
    /////////////////////

var keyHash = {};

function onKeyDown(event) {
    keyHash[String.fromCharCode(event.which)] = true;
}

function onKeyUp(event) {
    keyHash[String.fromCharCode(event.which)] = false;
}

function handleKeystroke(player) {
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
