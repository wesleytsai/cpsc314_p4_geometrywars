function writeUI (player, score) {
    document.getElementById('score').innerHTML = score;
    if (player) {
        document.getElementById('player_health').innerHTML = player.health;
    }
    var fps = parseInt(getFPScounter());
    document.getElementById('fps_counter').innerHTML = fps;
}

var last = new Date;
function getFPScounter () {
    var now = new Date;
    var fps = 1000.0 / (now - last);
    last = now;
    return fps;
}
