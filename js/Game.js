var gameOver = false;


function gameLogicOrSomethingToThatEffect () {
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
                    gameOVERRRRR();
                }
                continue;
            }
        }
        movingObjects.push(object);
    }
}


function gameOVERRRRR() {
    gameOver = true;
    ; // TODO
}
