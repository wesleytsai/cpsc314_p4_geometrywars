"use strict";


function initUI() {
    setInterval(function(){
        document.getElementById('fps_counter').innerHTML = (1000 / __UI_frameTime).toFixed(1);
    }, 1000);
    setInterval(function(){
        document.getElementById('high_score').innerHTML = __Game_lsobj.high_score.toFixed(0);
    }, 3000);
}


function updateUI (player, score) {
    document.getElementById('score').innerHTML = score;
    if (player) {
        document.getElementById('player_health').innerHTML = player.health;
    }
    updateFPScounter();
}

// Using low pass filter for FPS: https://stackoverflow.com/questions/4787431/check-fps-in-js
var __UI_last = new Date;
var __UI_frameTime = 0;
function updateFPScounter () {
    var now = new Date;
    var thisFrameTime = now - __UI_last;
    __UI_frameTime += (thisFrameTime - __UI_frameTime) / FPS_LOPASS_FILTER_STRENGTH;
    __UI_last = now;
}
