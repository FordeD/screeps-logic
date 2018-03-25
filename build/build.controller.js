module.exports = {
  processing: function(spawn) {
    this.checkRamparts(spawn);
    this.checkTower(spawn);
    this.checkStorage(spawn);
    return true;
  },

  checkRamparts: function(spawn) {
    if(spawn.room.controller.level >= 2) {
      var ramparts = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_RAMPART);
      var rampartsCenter = {x: spawn.pos.x, y: spawn.pos.y};
      for(var i = rampartsCenter.x-3; i <= rampartsCenter.x+3; i++) {
        for(var j = rampartsCenter.y-3; j <= rampartsCenter.y+3; j++) {
          if(Game.map.getTerrainAt({x:i,y:j}) != 'wall') {
            var isCreated = false;
            ramparts.forEach((rampart) => { 
              if(rampart.pos.x == i && rampart.pos.y == j) { 
                isCreated = true; 
              } 
            });
            if(!isCreated) {
              spawn.room.createConstructionSite(i, j, STRUCTURE_RAMPART);
            }
          }
        }
      }
    }
    return false;
  },

  checkTower: function(spawn) {
    if(spawn.room.controller.level >= 3) {
      var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER);
      var spawnPos = spawn.pos;
      for(var i = spawnPos.x-3; i <= spawnPos.x+3; i=i+3) {
        for(var j = spawnPos.y-3; j <= spawnPos.y+3; j=j+3) {
          if(Game.map.getTerrainAt({x:i,y:j}) != 'wall') {
            var isCreated = false;
            towers.forEach((rampart) => { 
              if(rampart.pos.x == i && rampart.pos.y == j) { 
                isCreated = true;
              } 
            });
            if(!isCreated) {
              spawn.room.createConstructionSite(i, j, STRUCTURE_TOWER);
              return false;
            }
          }
        }
      }
    }
    return false;
  },

  checkStorage: function(spawn) {
    if(spawn.room.controller.level >= 4) {
      var towers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_STORAGE);
      var spawnPos = spawn.pos;
      for(var i = spawnPos.x-3; i <= spawnPos.x+3; i=i+3) {
        for(var j = spawnPos.y-3; j <= spawnPos.y+3; j=j+3) {
          if(Game.map.getTerrainAt({x:i,y:j}) != 'wall') {
            var isCreated = false;
            towers.forEach((rampart) => { 
              if(rampart.pos.x == i && rampart.pos.y == j) { 
                isCreated = true;
              } 
            });
            if(!isCreated) {
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
