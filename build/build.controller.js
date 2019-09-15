module.exports = {
  processing: function (spawn) {
    var terrain = Game.map.getRoomTerrain(spawn.room.name);
    this.checkTower(spawn, terrain);
    this.checkStorage(spawn, terrain);
    this.checkExtensions(spawn, terrain);
    this.checkContainers(spawn, terrain);
    this.checkRoads(spawn, terrain);
    this.checkRamparts(spawn, terrain);
    this.checkSwamps(spawn, terrain);
    return true;
  },

  checkRamparts: function (spawn, terrain) {
    if (spawn.room.controller.level >= 2) {
      var ramparts = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_RAMPART);
      var rampartsCenter = { x: spawn.pos.x, y: spawn.pos.y };
      var xStart = rampartsCenter.x - 3;
      var xEnd = rampartsCenter.x + 3;
      var yStart = rampartsCenter.y - 3;
      var yEnd = rampartsCenter.y + 3;
      for (var i = rampartsCenter.x - 3; i <= rampartsCenter.x + 3; i++) {
        for (var j = rampartsCenter.y - 3; j <= rampartsCenter.y + 3; j++) {
          if (i > xStart && i < xEnd && j > yStart && j < yEnd) {
            continue;
          }
          if (terrain.get(i, j) != TERRAIN_MASK_WALL) {
            var isCreated = false;
            ramparts.forEach((rampart) => {
              if (rampart.pos.x == i && rampart.pos.y == j) {
                isCreated = true;
              }
            });
            if (!isCreated) {
              spawn.room.createConstructionSite(i, j, STRUCTURE_RAMPART);
            }
          }
        }
      }
    }
    return false;
  },

  checkContainers: function (spawn, terrain) {
    if (spawn.room.controller.level >= 2) {
      var containers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_CONTAINER);
      var Center = { x: spawn.pos.x, y: spawn.pos.y };
      var xStart = Center.x - 4;
      var xEnd = Center.x + 4;
      var yStart = Center.y - 4;
      var yEnd = Center.y + 4;
      for (var i = xStart; i <= xEnd; i++) {
        for (var j = yStart; j <= yEnd; j++) {
          if ((i > Center.x - 1 && i < Center.x + 1) && (j > Center.y - 1 && j < Center.y + 1) && (i == Center.x && j == Center.y) && (i > xStart && i < xEnd && j > yStart && j < yEnd)) {
            continue;
          }
          if ((i + j) % 4 === 0) {
            if (terrain.get(i, j) != TERRAIN_MASK_WALL) {
              var isCreated = false;
              containers.forEach((container) => {
                if (container.pos.x == i && container.pos.y == j) {
                  isCreated = true;
                }
              });
              if (!isCreated) {
                spawn.room.createConstructionSite(i, j, STRUCTURE_CONTAINER);
              }
            }
          }
        }
      }
    }
  },

  checkExtensions: function (spawn, terrain) {
    if (spawn.room.controller.level >= 2) {
      var extensions = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_EXTENSION);
      var Center = { x: spawn.pos.x, y: spawn.pos.y };
      var xStart = Center.x - 3;
      var xEnd = Center.x + 3;
      var yStart = Center.y - 3;
      var yEnd = Center.y + 3;
      for (var i = xStart; i <= xEnd; i++) {
        for (var j = yStart; j <= yEnd; j++) {
          if ((i > Center.x - 1 && i < Center.x + 1) && (j > Center.y - 1 && j < Center.y + 1) && (i == Center.x && j == Center.y) && (i > xStart && i < xEnd && j > yStart && j < yEnd)) {
            continue;
          }
          if ((i + j) % 2 === 0) {
            if (terrain.get(i, j) != TERRAIN_MASK_WALL) {
              var isCreated = false;
              extensions.forEach((extension) => {
                if (extension.pos.x == i && extension.pos.y == j) {
                  isCreated = true;
                }
              });
              if (!isCreated) {
                spawn.room.createConstructionSite(i, j, STRUCTURE_EXTENSION);
              }
            }
          }
        }
      }
    }
  },

  checkRoads: function (spawn, terrain) {
    if (spawn.room.controller.level >= 2) {
      var roads = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_ROAD);
      var Center = { x: spawn.pos.x, y: spawn.pos.y };
      var xStart = Center.x - 4;
      var xEnd = Center.x + 4;
      var yStart = Center.y - 4;
      var yEnd = Center.y + 4;
      for (var i = xStart; i <= xEnd; i++) {
        for (var j = yStart; j <= yEnd; j++) {
          if (i == Center.x && j == Center.y) {
            continue;
          }
          if ((i + j) % 2 === 1 || i == Center.x || j == Center.y) {
            if (terrain.get(i, j) != TERRAIN_MASK_WALL) {
              var isCreated = false;
              roads.forEach((road) => {
                if (road.pos.x == i && road.pos.y == j) {
                  isCreated = true;
                }
              });
              if (!isCreated) {
                spawn.room.createConstructionSite(i, j, STRUCTURE_ROAD);
              }
            }
          }
        }
      }
    }
  },

  checkSwamps: function (spawn, terrain) {
    var roads = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_ROAD);
    var Center = { x: spawn.pos.x, y: spawn.pos.y };
    var xStart = Center.x - 11;
    var xEnd = Center.x + 11;
    var yStart = Center.y - 11;
    var yEnd = Center.y + 11;
    for (var i = xStart; i <= xEnd; i++) {
      for (var j = yStart; j <= yEnd; j++) {
        if ((i > Center.x - 4 && i < Center.x + 4) && (j > Center.y - 4 && j < Center.y + 4)) {
          continue;
        }
        if (terrain.get(i, j) == TERRAIN_MASK_SWAMP) {
          var isCreated = _.find(roads, function (road) {
            return road.pos.x == i && road.pos.y == j;
          });
          if (!isCreated) {
            spawn.room.createConstructionSite(i, j, STRUCTURE_ROAD);
          }
        }
      }
    }
  },

  checkTower: function (spawn, terrain) {
    if (spawn.room.controller.level >= 3) {
      var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
      var spawnPos = spawn.pos;
      for (var i = spawnPos.x - 3; i <= spawnPos.x + 3; i = i + 3) {
        for (var j = spawnPos.y - 3; j <= spawnPos.y + 3; j = j + 3) {
          if (terrain.get(i, j) != TERRAIN_MASK_WALL) {
            var isCreated = false;
            towers.forEach((rampart) => {
              if (rampart.pos.x == i && rampart.pos.y == j) {
                isCreated = true;
              }
            });
            if (!isCreated) {
              spawn.room.createConstructionSite(i, j, STRUCTURE_TOWER);
            }
          }
        }
      }
    }
    return false;
  },

  checkStorage: function (spawn, terrain) {
    if (spawn.room.controller.level >= 4) {
      var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_STORAGE);
      var spawnPos = spawn.pos;
      for (var i = spawnPos.x - 3; i <= spawnPos.x + 3; i = i + 3) {
        for (var j = spawnPos.y - 3; j <= spawnPos.y + 3; j = j + 3) {
          if (terrain.get(i, j) != TERRAIN_MASK_WALL) {
            var isCreated = false;
            towers.forEach((rampart) => {
              if (rampart.pos.x == i && rampart.pos.y == j) {
                isCreated = true;
              }
            });
            if (!isCreated) {
              spawn.room.createConstructionSite(i, j, STRUCTURE_STORAGE);
              return false;
            } else {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
