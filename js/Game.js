var scene = new THREE.Scene();

// SETUP RENDERER
var renderer = setup_renderer();

// SETUP CAMERA
var cameraDefaultPos = new THREE.Vector3(0, 35, 50);
var camera = setup_camera(scene, cameraDefaultPos);

// ADAPT TO WINDOW RESIZE
function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// FLOOR WITH CHECKERBOARD
var floor = create_floor();
scene.add(floor);

// ADD LIGHTING TO SCENE
init_lighting(scene);

// CREATE PLAYER
var player;
function onLoadPlayer(object) {
    player = create_player(object);
    scene.add(player);
}
loadOBJ('obj/player.obj', onLoadPlayer);

// INIT UI
initUI();
