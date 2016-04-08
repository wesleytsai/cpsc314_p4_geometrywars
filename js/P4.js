// SETUP UPDATE CALL-BACK
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
        updatePlayerDirection(player, mouse, camera);

        /// SPAWN ENEMIES ///
        if (ticks % 100 == 0) {
            for (var i = 0; i < ticks / 1000; i++) {
                scene.add(createEnemyRandom());
                scene.add(createEnemyFollower());
            }
        }

        ticks += 1;
    }

    // Write UI
    updateUI(player, score);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
};


$(window).load(function () {
    render()
});
