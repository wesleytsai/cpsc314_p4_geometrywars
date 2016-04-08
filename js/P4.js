var __render_ticks = 0;
var do_render = true;

function render () {

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
                    if (object.type == "player") {
                        ; // TODO
                    }
                    continue;
                }
            }
            movingObjects.push(object);
        }

        /// CAMERA WORK ///
        updateCamera(camera, cameraDefaultPos);

        /// PICKING PLAYER FACING DIRECTION ///
        updatePlayerDirection(player, mouse, camera);

        /// SPAWN ENEMIES ///
        spawn_enemies(__render_ticks);

        __render_ticks += 1;
    }

    // Write UI
    updateUI(player, score);

    if (do_render) {
        requestAnimationFrame(render);
    }
    renderer.render(scene, camera);
}


$(window).load(function () {
    render()
});
