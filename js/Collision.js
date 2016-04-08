"use strict";


var movingObjects = [];
var spacialHash = [];
var score = 0;

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

function getCollidedObjectsInRadius(pos, radius) {
    var list = [];
    // so we don't need to square root distance calculations
    var radiusSqr = radius * radius;

    // Pos could be negative, so we shift it to start from 0, then search through the radius for other entities
    for (var x = Math.floor(pos.x) + GRID_RADIUS - Math.ceil(radius); x < Math.ceil(pos.x) + GRID_RADIUS + Math.ceil(radius); x++) {
        for (var y = Math.floor(pos.y) + GRID_RADIUS - Math.ceil(radius); y < Math.ceil(pos.y) + GRID_RADIUS + Math.ceil(radius); y++) {
            if (x > 0 && x < GRID_RADIUS * 2 && y > 0 && y < GRID_RADIUS * 2) {
                var entities = spacialHash[x][y];
                for (var i in entities) {
                    if (pos.distanceTo(entities[i].position) < radiusSqr) {
                        list.push(entities[i]);
                    }
                }
            }
        }
    }
    return list;
}

function handleCollision(player, object) {
    if (object.type == 'player') {
        var collidedObjects = getCollidedObjectsInRadius(object.position, 1.5);
        for (var i in collidedObjects) {
            if (collidedObjects[i].type == 'enemy') {
                player.life = 0;
            }
        }
    } else if (object.type == 'projectile') {
        var collidedObjects = getCollidedObjectsInRadius(object.position, 1.5);
        for (var i in collidedObjects) {
            if (collidedObjects[i].type == 'enemy') {
                object.life = 0;
                collidedObjects[i].life = 0;
                score++;
            }
        }
    }
}
