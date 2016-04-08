function initUI() {
    setInterval(function(){
        document.getElementById('fps_counter').innerHTML = fps.toFixed(1);
    }, 500);
}


function updateUI (player, score) {
    document.getElementById('score').innerHTML = score;
    if (player) {
        document.getElementById('player_health').innerHTML = player.health;
    }
    updateFPScounter();
}


var last = new Date;
var fps = 0;
function updateFPScounter () {
    var now = new Date;
    fps = 1000.0 / (now - last);
    last = now;
}
