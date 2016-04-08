"use strict";


function init_lighting(scene) {
    var lightColor = new THREE.Color(0.3, 0.3, 0.3);
    var pointLight = new THREE.PointLight(lightColor, 2, 100);
    var ambientColor = new THREE.Color(0.2, 0.3, 0.7);
    var hemisphereLight= new THREE.HemisphereLight(ambientColor);

    pointLight.position.set(cameraDefaultPos);
    scene.add(pointLight);
    scene.add(hemisphereLight); 
}
