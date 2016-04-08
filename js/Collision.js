var movingObjects = [];

var spacialHash = [];

function resetSpacialHash() {
    spacialHash = [];
    for (var x = 0; x < GRID_RADIUS * 2; x++) {
        spacialHash.push([]);
        for (var y = 0; y < GRID_RADIUS * 2; y++) {
            spacialHash[x][y] = [];
        }
    }

    for (var i = 0; i < movingObjects.length; i++) {
        var object = movingObjects[i];
        var posX = Math.floor(object.position.x) + GRID_RADIUS;
        var posY = Math.floor(object.position.y) + GRID_RADIUS;
        spacialHash[posX][posY].push(object);
    }
}
