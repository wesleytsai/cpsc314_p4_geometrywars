var __render_ticks = 0;

function render () {

    if (player) {
        resetSpacialHash();
        handleKeystroke(player);

        // Do the game
        gameLogicOrSomethingToThatEffect();

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

    if (!gameOver) {
        requestAnimationFrame(render);
    }
    renderer.render(scene, camera);
}


$(window).load(function () {
    $(".loader").fadeOut("slow");
    render()
});
