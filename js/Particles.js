function generateParticles(pos, count, color, life, accel, size, type) {
    for (var i = 0; i < count; i++) {
        var direction = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        direction.normalize();

        var particleGeo = new THREE.SphereGeometry(size, 4, 4);
        var particleMat = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true
        });

        var mesh = new THREE.Mesh(particleGeo, particleMat);
        mesh.position.copy(pos);
        mesh.life = life;
        addMovementProperties(mesh, accel, accel, accel/100);
        mesh.accel.set(direction.x * mesh.accelRate, direction.y * mesh.accelRate, direction.z * mesh.accelRate);
        if (type)
            mesh.type = type;

        scene.add(mesh);
    }
}
