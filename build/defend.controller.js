module.exports = {
  processing: function(room, hostles, solders, helpers) {
    let hostile = hostles[0];
    let roomName = room.name;
    var userName = hostiles[0].owner;
    notifier.dangerNotify(userName, roomName, hostles.count);
    solders.forEach(creep => this.solderDefend(creep, hostile));
    helpers.forEach(creep => this.solderDefend(creep, hostile));
  },

  solderDefend: function(creep, hostile) {
    if(creep.room.name == creep.memory.target) {
      target = creep.pos.findClosestByPath(hostile);
      if(target) {
        if(creep.memory.role == 'solder') {
          if(creep.attack(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target, CREEP_MOVE_ATACK);
          }
        } else {
          if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target, CREEP_MOVE_ATACK);
          }
        }
      }
    } else {
        var route = Game.map.findRoute(creep.room, creep.memory.target);
        if(route.length > 0) {
          creep.moveTo(creep.pos.findClosestByRange(route[0].exit), CREEP_MOVE_LINE);
        }
    }
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
            } else {
              return true;
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