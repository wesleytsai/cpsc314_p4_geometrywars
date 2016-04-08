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


function gameOVERRRRR () {
    gameOver = true;
    var old_highscore = __Game_lsobj.high_score;
    if (score > old_highscore) {
        __Game_lsobj.high_score = score;
    }
    updatelocalStorage();
    var modal_body = document.getElementById('modal-body');
    modal_body.innerHTML = "Thanks for playing! \
            Your score was " + score + ". \
            The previous high score was " + old_highscore + ".\n \
            Click anywhere outside of this pop-up to exit and jump into \
            a new game!";
    var modal = document.getElementById('egm_modal');
    modal.style.display = "block";
}


var __Game_lsobj;
function initlocalStorage () {
    var lsobj = JSON.parse(localStorage.getItem(LOCALSTORAGEKEY));
    if (lsobj == null) {
        __Game_lsobj = {
            high_score: 0
        }
    } else {
        __Game_lsobj = lsobj;
    }
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(__Game_lsobj));
}
initlocalStorage();


function updatelocalStorage() {
    localStorage.setItem(LOCALSTORAGEKEY, JSON.stringify(__Game_lsobj));
}
