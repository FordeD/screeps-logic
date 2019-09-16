module.exports = {
  creepGetEnergy: function (creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, STORAGES, SOURCES, CREEPS) {
    var store = _.filter(STORAGES, (storage) => storage.store[RESOURCE_ENERGY] >= creep.carryCapacity);
    if (store.length > 0) {
      if (creep.withdraw(store[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(store[0]);
      }
      return;
    } else {
      if (!creep.memory.sourceId) {
        let anyRooms = this.goneGetEnergy(creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, SOURCES, CREEPS);
        if (Array.isArray(anyRooms)) {
          return anyRooms;
        }
      } else {
        var source = _.filter(SOURCES, (source) => source.id == creep.memory.sourceId);
        if (creep.harvest(source[0]) == ERR_NOT_IN_RANGE) {
          if (creep.moveTo(source[0], { noPathFinding: true, visualizePathStyle: SPAWN_OBJ.memory.CREEP_HARVEST_LINE }) == ERR_NOT_FOUND) {
            creep.moveTo(source[0], { reusePath: 50, visualizePathStyle: SPAWN_OBJ.memory.CREEP_HARVEST_LINE });
          }
        }
        return false;
      }
    }
    return true;
  },

  goneGetEnergy: function (creep, SPAWN_ROOM, SPAWN_OBJ, NEAR_ROOMS, WORK_CREEPS, SOURCES, CREEPS) {
    if (!creep.memory.goneRoom) {
      let source = this.getFreeSource(creep, false, SPAWN_OBJ, SOURCES, CREEPS);
      if (source) {
        creep.memory.sourceId = source;
      } else {
        for (var index in NEAR_ROOMS) {
          var roomName = NEAR_ROOMS[index].name;
          let sources = NEAR_ROOMS[index].sources.length;
          var emptyRoom = _.filter(WORK_CREEPS, (creep) => creep.memory.goneRoom == roomName);
          if (emptyRoom.length < (sources > 0 ? sources * 2 : 4)) {
            creep.memory.goneRoom = roomName;
            return;
          }
        }
      }
    } else {
      if (creep.room.name == SPAWN_ROOM.name || creep.room.name != creep.memory.goneRoom) {
        var exitDirection = Game.map.findExit(creep.room.name == SPAWN_ROOM.name ? SPAWN_ROOM : creep.room, creep.memory.goneRoom);
        var route = creep.pos.findClosestByRange(exitDirection);
        // creep.moveTo(route);
        if (creep.moveTo(route, { noPathFinding: true, visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE }) == ERR_NOT_FOUND) {
          let moveResult = creep.moveTo(route, { reusePath: 50, visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE });
          console.log(moveResult);
          if (moveResult != OK) {
            creep.moveTo(25, 25, { visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE });
          }
        }
      } else {
        if (creep.pos.x == 0 || creep.pos.y == 0 || creep.pos.x == 49 || creep.pos.y == 49) {
          creep.moveTo(25, 25, { visualizePathStyle: SPAWN_OBJ.memory.CREEP_EXIT_LINE });
        }
        let source = this.getFreeSource(creep, true, SPAWN_OBJ, SOURCES, CREEPS);
        if (Array.isArray(source) === false) {
          creep.memory.sourceId = source;
        } else {
          return source;
        }
      }
    }
  },

  getFreeSource: function (creep, isOtherRoom, SPAWN_OBJ, SOURCES, CREEPS) {
    if (!isOtherRoom) {
      for (var index in SOURCES) {
        var sourceID = SOURCES[index].id;
        var harvesters = _.filter(CREEPS, (creep) => creep.memory.sourceId == sourceID);
        if (harvesters.length < 2) {
          return sourceID;
        }
      }
    } else {
      if (!SPAWN_OBJ.memory.sources) {
        SPAWN_OBJ.memory.sources = [];
      }
      if (SPAWN_OBJ.memory.NearRooms[creep.room.name].sources.length == 0) {
        this.setSourcesFromOtherRoom(creep, SPAWN_OBJ);
      }
      var thisRoomSources = SPAWN_OBJ.memory.sources[creep.room.name];
      for (index in thisRoomSources) {
        var harvesters = _.filter(CREEPS, (creep) => creep.memory.sourceId == thisRoomSources[index]);
        if (harvesters.length < 2) {
          return thisRoomSources[index];
        }
      }

      return Game.map.describeExits(creep.room.name);
    }
  },

  setSourcesFromOtherRoom: function (creep, SPAWN_OBJ) {
    let thisRoomSources = creep.room.find(FIND_SOURCES_ACTIVE);
    SPAWN_OBJ.memory.sources[creep.room.name] = [];
    for (index in thisRoomSources) {
      source = thisRoomSources[index].id;
      var sources = _.filter(SPAWN_OBJ.memory.NearRooms[creep.room.name].sources, (src) => src == source);
      if (!sources) {
        var currRoom = _.filter(SPAWN_OBJ.memory.NearRooms, (room) => room.name == creep.room.name);
        if (!currRoom) {
          currRoom = { name: creep.room.name, sources: [] }
        }
        // SPAWN_OBJ.memory.NearRooms[creep.room.name].sources.push(source);
        currRoom.sources.push(source);
        SPAWN_OBJ.memory.sources[creep.room.name].push(source);
        notifier.infoNotify(SPAWN_OBJ, 'SEARCH ROOM ' + creep.room.name, 'Find source:' + source);

      }
    }
    return true;
  },

  // TODO: доделать метод сбора могил
  putTombstoneResources: function (creep, TOMBSTONES, STORAGES) {
    if (!creep.memory.goneToTombstone) {
      if (TOMBSTONES[0] && _.sum(TOMBSTONES[0].store) > 0) {
        for (index in RESOURCE_TYPES) {
          var resourceType = RESOURCE_TYPES[index];
          if (TOMBSTONES[0].store[resourceType] && TOMBSTONES[0].store[resourceType] > 0) {
            creep.memory.goneToTombstone = TOMBSTONES[0].id;
            creep.memory.resourceTypeTransfer = resourceType;
            return true;
          } else {
            continue;
          }
        }
        return false;
      }
      return false;
    } else {
      if (!creep.memory.goneToStorage) {
        var resourceType = creep.memory.resourceTypeTransfer;
        if (creep.transfer(STORAGES[0], resourceType) == ERR_NOT_IN_RANGE) {
          creep.moveTo(STORAGES[0], SPAWN_OBJ.memory.CREEP_MOVE_LINE);
          creep.memory.isTransfer = obj.id;
          creep.memory.goneRoom = false;
        }
        for (index in RESOURCE_TYPES) {
          var resourceType = RESOURCE_TYPES[index];
          if (creep.carry[resourceType] && creep.carry[resourceType] > 0) {
            creep.memory.resourceTypeTransfer = resourceType;
            if (creep.transfer(STORAGES[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(STORAGES[0], SPAWN_OBJ.memory.CREEP_MOVE_LINE);
              creep.memory.isTransfer = obj.id;
              creep.memory.goneRoom = false;
            }
          }
        }
      } else {
        let res = creep.transfer(STORAGES[0], creep.memory.resourceTypeTransfer);
        switch (res) {
          case ERR_NOT_IN_RANGE: {
            creep.moveTo(STORAGES[0], SPAWN_OBJ.memory.CREEP_MOVE_LINE);
            creep.memory.isTransfer = STORAGES[0].id;
            creep.memory.goneRoom = false;
            break;
          }
          case OK: {
            creep.memory.resourceTypeTransfer = false;
            break;
          }
        }
      }
    }
  }
}