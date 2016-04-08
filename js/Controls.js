"use strict";


var mouse = new THREE.Vector2();


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
