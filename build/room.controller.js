var SPAWN_NAME = "";
var SPAWN_ROOM = null;
var SPAWN_OBJ = null;
var ROOM_STATE = 0;
var SOURCES = null;
var STORAGES = null;
var HARVEST_ROOMS = null;
var NEAR_ROOMS = null;

var CREEP_LEVEL = 0;
var CREEP_ENERGY_LEVEL = 0;
var CONTROLLER_LEVEL = 0;

var HARVESTER_COUNT = 0;
var CL_UPGRADER_COUNT = 0;
var EX_BUILDER_COUNT = 0;
var SOLDER_COUNT = 0;
var REPAIRER_COUNT = 0;
var RANGER_COUNT = 0;
var HEALER_COUNT = 0;
var CLAIMER_COUNT = 0;

var HARVESTER_QUEUE_COUNT = 0;
var CL_UPGRADER_QUEUE_COUNT = 0;
var EX_BUILDER_QUEUE_COUNT = 0;
var SOLDER_QUEUE_COUNT = 0;
var REPAIRER_QUEUE_COUNT = 0;
var RANGER_QUEUE_COUNT = 0;
var HEALER_QUEUE_COUNT = 0;
var CLAIMER_QUEUE_COUNT = 0;

var CREEPS = null;
var COMBAT_CREEPS = null;
var WORK_CREEPS = null;
var CLAIMERS_CREEPS = null;
var TOMBSTONES = null;

var SPAWN_MEMORY = null;

var HarvesterController = null;
var UpgraderController = null;
var BuilderController = null;
var RepairerController = null;
var SolderController = null;
var HealerController = null;

module.exports = {
  harvester_doing: function (creep) {
    let anyRooms = HarvesterController.processing(creep, this);
    if (Array.isArray(anyRooms)) {
      this.addNearRooms(anyRooms);
    }
  },

  cl_upgrader_doing: function (creep) {
    let anyRooms = UpgraderController.processing(creep, this);
    if (Array.isArray(anyRooms)) {
      this.addNearRooms(anyRooms);
    }
  },

  ex_builder_doing: function (creep) {
    let anyRooms = BuilderController.processing(creep, this);
    if (Array.isArray(anyRooms)) {
      this.addNearRooms(anyRooms);
    }
  },

  repairer_doing: function (creep) {
    let anyRooms = RepairerController.processing(creep, this, CONTROLLER_LEVEL);
    if (Array.isArray(anyRooms)) {
      this.addNearRooms(anyRooms);
    } else if (anyRooms == 'BUILD') {
      this.ex_builder_doing(creep);
    }
  },

  solder_doing: function (creep) {
    SolderController.processing(creep, this);
  },

  healer_doing: function (creep) {
    HealerController.processing(creep, this);
  },

  claimer_doing: function (creep) {
    ClaimerController.processing(creep, this);
  },

  checkCreeps: function () {
    for (var name in CREEPS) {
      var creep = CREEPS[name];
      if (creep) {
        var role = creep.memory.role;
        switch (role) {
          case SPAWN_MEMORY.ROLES.harvester: {
            ++HARVESTER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.upgrader: {
            ++CL_UPGRADER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.builder: {
            ++EX_BUILDER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.solder: {
            ++SOLDER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.repairer: {
            ++REPAIRER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.ranger: {
            ++RANGER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.healer: {
            ++HEALER_COUNT;
            break;
          }
          case SPAWN_MEMORY.ROLES.claimer: {
            ++CLAIMER_COUNT;
            break;
          }
        }
      }
    }

    for (var i in SPAWN_MEMORY.SPAWN_QUEUE) {
      var role = SPAWN_MEMORY.SPAWN_QUEUE[i].memory.role;
      switch (role) {
        case SPAWN_MEMORY.ROLES.harvester: {
          ++HARVESTER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.upgrader: {
          ++CL_UPGRADER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.builder: {
          ++EX_BUILDER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.solder: {
          ++SOLDER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.repairer: {
          ++REPAIRER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.ranger: {
          ++RANGER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.healer: {
          ++HEALER_QUEUE_COUNT;
          break;
        }
        case SPAWN_MEMORY.ROLES.claimer: {
          ++CLAIMER_QUEUE_COUNT;
          break;
        }
      }
    }
  },

  killFiewLiveCreeps: function () {
    let spName = SPAWN_NAME ? SPAWN_NAME : SPAWN_OBJ.name;
    creeps = _.filter(Game.creeps, (creep) => creep.memory.owner == spName && (creep.memory.role != SPAWN_MEMORY.ROLES.solder || creep.memory.role != SPAWN_MEMORY.ROLES.ranger || creep.memory.role != SPAWN_MEMORY.ROLES.healer));
    for (name in creeps) {
      let creep = creeps[name];
      var total = _.sum(creep.carry);
      if (creep.ticksToLive < 50 && total == 0) {
        creep.suicide();
      }
    }
  },

  checkSpawnCreeps: function () {
    if (SPAWN_MEMORY.SPAWN_QUEUE.length < SPAWN_MEMORY.SPAWN_QUEUE_MAX) {
      let state = this.getState();
      if ((HARVESTER_COUNT + HARVESTER_QUEUE_COUNT) < SPAWN_MEMORY.HARVESTER_MAX_COUNT[state]) {
        queueController.addHarvester(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((CL_UPGRADER_COUNT + CL_UPGRADER_QUEUE_COUNT) < SPAWN_MEMORY.CL_UPGRADER_MAX_COUNT[state]) {
        queueController.addUpgrader(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((EX_BUILDER_COUNT + EX_BUILDER_QUEUE_COUNT) < SPAWN_MEMORY.EX_BUILDER_MAX_COUNT[state]) {
        queueController.addBuilder(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((REPAIRER_COUNT + REPAIRER_QUEUE_COUNT) < SPAWN_MEMORY.REPAIRER_MAX_COUNT[state]) {
        queueController.addRepairer(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((SOLDER_COUNT + SOLDER_QUEUE_COUNT) < SPAWN_MEMORY.SOLDER_MAX_COUNT[state]) {
        queueController.addSolder(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((RANGER_COUNT + RANGER_QUEUE_COUNT) < SPAWN_MEMORY.RANGER_MAX_COUNT[state]) {
        queueController.addRanger(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((HEALER_COUNT + HEALER_QUEUE_COUNT) < SPAWN_MEMORY.HEALER_MAX_COUNT[state]) {
        queueController.addHealer(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      } else if ((CLAIMER_COUNT + CLAIMER_QUEUE_COUNT) < SPAWN_MEMORY.CLAIMER_MAX_COUNT[state] && SPAWN_MEMORY.GCL > 1) {
        queueController.addClaimer(SPAWN_OBJ, SPAWN_ROOM.name, CREEP_ENERGY_LEVEL, SPAWN_NAME, CREEP_LEVEL);
      }
    }
    return false;
  },

  creepsActions: function () {
    let state = this.getState();
    for (var name in CREEPS) {
      var creep = CREEPS[name];
      if (creep) {
        var role = creep.memory.role;
        switch (role) {
          case SPAWN_MEMORY.ROLES.harvester: {
            this.harvester_doing(creep);
            break;
          }
          case SPAWN_MEMORY.ROLES.upgrader: {
            this.cl_upgrader_doing(creep);
            break;
          }
          case SPAWN_MEMORY.ROLES.builder: {
            this.ex_builder_doing(creep);
            break;
          }
          case SPAWN_MEMORY.ROLES.repairer: {
            if (state != SPAWN_MEMORY.ROOM_STATES.DEFEND) {
              this.repairer_doing(creep);
            }
            break;
          }
          case SPAWN_MEMORY.ROLES.solder: {
            if (state != SPAWN_MEMORY.ROOM_STATES.DEFEND && state != SPAWN_MEMORY.ROOM_STATES.ATACK) {
              this.solder_doing(creep);
            }
            break;
          }
          case SPAWN_MEMORY.ROLES.ranger: {
            if (state != SPAWN_MEMORY.ROOM_STATES.DEFEND && state != SPAWN_MEMORY.ROOM_STATES.ATACK) {
              this.solder_doing(creep);
            }
            break;
          }
          case SPAWN_MEMORY.ROLES.healer: {
            if (state != SPAWN_MEMORY.ROOM_STATES.DEFEND && state != SPAWN_MEMORY.ROOM_STATES.ATACK) {
              this.healer_doing(creep);
            }
            break;
          }
          case SPAWN_MEMORY.ROLES.claimer: {
            this.claimer_doing(creep);
            break;
          }
        }
      }
    }
  },

  getLevel: function () {
    max = SPAWN_ROOM.energyCapacityAvailable;
    CREEP_ENERGY_LEVEL = SPAWN_ROOM.energyAvailable;
    if (max < (300 + 5 * 50)) {
      CREEP_LEVEL = 0;
    } else if (max < (300 + 10 * 50)) {
      CREEP_LEVEL = 1;
    } else if (max < (300 + 20 * 50)) {
      CREEP_LEVEL = 2;
    } else {
      let currTime = Game.time;
      if (!SPAWN_OBJ.memory['notifyTimer'] || currTime - SPAWN_OBJ.memory['notifyTimer'] > SPAWN_MEMORY.NOTIFY_TIMER_COUNT.LEVEL) {
        notifier.infoNotify(SPAWN_OBJ, 'Creep level', 'just maximum, need upgrade logic');
        SPAWN_OBJ.memory['notifyTimer'] = currTime;
      }
      CREEP_LEVEL = 2;
    }
  },

  checkDangerInRoom: function () {
    if (SPAWN_MEMORY.HOSTILES.length > 0) {
      ROOM_STATE = SPAWN_MEMORY.ROOM_STATES.DEFEND;
      return true;
    }
    ROOM_STATE = SPAWN_MEMORY.ROOM_STATES.EVOLUTION;
    return false;
  },

  // GETTERS
  getSpawn: function () {
    if (SPAWN_OBJ) {
      return SPAWN_OBJ;
    } else {
      return false;
    }
  },

  getRoom: function () {
    return SPAWN_ROOM;
  },

  getMemory: function () {
    return SPAWN_MEMORY;
  },

  getNearRooms: function () {
    return NEAR_ROOMS;
  },

  getState: function () {
    return ROOM_STATE;
  },

  getSolders: function () {
    if (COMBAT_CREEPS && COMBAT_CREEPS > 0) {
      return COMBAT_CREEPS;
    }
    return false;
  },

  getWorkers: function () {
    return WORK_CREEPS;
  },

  getCreeps: function () {
    return CREEPS;
  },

  getRoomTombstones: function () {
    TOMBSTONES = SPAWN_ROOM.find(FIND_TOMBSTONES);
    return TOMBSTONES;
  },

  getStorages: function () {
    return STORAGES;
  },

  getSources: function () {
    return SOURCES;
  },


  // SETTERS

  // METHODS
  updateState: function () {
    if (CREEP_LEVEL < 2 && SPAWN_ROOM.controller.level < 2 && CREEPS.length <= 10) {
      ROOM_STATE = SPAWN_MEMORY.ROOM_STATES.BUILDING;
    } else if (CREEP_LEVEL >= 2 && SPAWN_ROOM.controller.level >= 3 && CREEPS.length > 10) {
      ROOM_STATE = SPAWN_MEMORY.ROOM_STATES.EVOLUTION;
    } else if (SPAWN_MEMORY.HOSTILES && SPAWN_MEMORY.HOSTILES.length > 0) {
      ROOM_STATE = SPAWN_MEMORY.ROOM_STATES.DEFEND;
    }
  },

  addNearRooms: function (rooms) {
    for (index in rooms) {
      SPAWN_OBJ.memory['NearRooms'].push({ name: rooms[index], sources: [] });
    }
  },

  updateDynamicVariables: function () {
    CONTROLLER_LEVEL = CONTROLLER_LEVEL ? CONTROLLER_LEVEL : SPAWN_ROOM.controller.level;

    STORAGES = SPAWN_ROOM.find(FIND_STRUCTURES, {
      filter: (obj) => { obj.structureType == STRUCTURE_STORAGE }
    });

    CREEPS = _.filter(Game.creeps, (creep) => creep.memory.owner == SPAWN_NAME);
    COMBAT_CREEPS = _.filter(CREEPS, (creep) => creep.memory.role == SPAWN_MEMORY.ROLES.solder || creep.memory.role == SPAWN_MEMORY.ROLES.ranger || creep.memory.role == SPAWN_MEMORY.ROLES.healer);
    WORK_CREEPS = _.filter(CREEPS, (creep) => creep.memory.role != SPAWN_MEMORY.ROLES.solder && creep.memory.role != SPAWN_MEMORY.ROLES.ranger && creep.memory.role != SPAWN_MEMORY.ROLES.healer && creep.memory.role != SPAWN_MEMORY.ROLES.claimer);


    let hostiles = SPAWN_ROOM.find(FIND_HOSTILE_CREEPS);
    SPAWN_MEMORY.HOSTILES = hostiles.length > 0 ? hostiles : false;

    // SOURCES = SOURCES ? SOURCES : SPAWN_ROOM.find(FIND_SOURCES_ACTIVE);

    if (!SPAWN_OBJ.memory['NearRooms'] || typeof SPAWN_OBJ.memory['NearRooms'][0] == "string") {
      var near = Game.map.describeExits(SPAWN_ROOM.name);
      var rooms = [];
      for (index in near) {
        rooms.push({ name: near[index], sources: [] });
      }
      SPAWN_OBJ.memory['NearRooms'] = rooms;
      // SPAWN_OBJ.memory['NearRooms'] = Game.map.describeExits(SPAWN_ROOM.name);
    }

    NEAR_ROOMS = SPAWN_OBJ.memory['NearRooms'];

    for (index in NEAR_ROOMS) {
      var roomName = NEAR_ROOMS[index];
      for (name in Game.flags) {
        let flag = Game.flags[name];
        let fromName = flag.name.split("-")
        if ((flag.room == roomName || fromName[0] == SPAWN_NAME) && !flag.memory['owner']) {
          flag.memory['owner'] = SPAWN_NAME;
        }
      }
    }

    HARVEST_ROOMS = [];
    for (name in Game.flags) {
      var flag = Game.flags[name];
      if (flag.memory['owner'] == SPAWN_NAME) {
        HARVEST_ROOMS.push(flag.room);
        break;
      }
    }

    SOURCES = SOURCES ? SOURCES : SPAWN_ROOM.find(FIND_SOURCES_ACTIVE);

    HARVESTER_COUNT = 0;
    CL_UPGRADER_COUNT = 0;
    EX_BUILDER_COUNT = 0;
    REPAIRER_COUNT = 0;
    RANGER_COUNT = 0;
    HEALER_COUNT = 0;
    CLAIMER_COUNT = 0;

    HARVESTER_QUEUE_COUNT = 0;
    CL_UPGRADER_QUEUE_COUNT = 0;
    EX_BUILDER_QUEUE_COUNT = 0;
    REPAIRER_QUEUE_COUNT = 0;
    RANGER_QUEUE_COUNT = 0;
    HEALER_QUEUE_COUNT = 0;
    CLAIMER_QUEUE_COUNT = 0;
  },

  processing: function (spawn_obj, spawnName) {
    if (spawn_obj) {
      SPAWN_NAME = spawn_obj.name;
      SPAWN_OBJ = spawn_obj;
      SPAWN_ROOM = spawn_obj.room;
    } else {
      SPAWN_OBJ = Game.spawns[spawnName];
    }

    spawnGlobals.processing(SPAWN_OBJ);
    SPAWN_MEMORY = SPAWN_OBJ.memory;
    this.killFiewLiveCreeps();
    this.updateDynamicVariables();
    this.getLevel();
    this.updateState();

    HarvesterController = require('./harvester.controller');
    UpgraderController = require('./upgrader.controller');
    BuilderController = require('./builder.controller');
    RepairerController = require('./repairer.controller');
    SolderController = require('./solder.controller');
    HealerController = require('./healer.controller');

    if (this.checkDangerInRoom()) {
      if (SPAWN_MEMORY.HOSTILES.length >= 2) {
        var rangers = _.filter(CREEPS, (creep) => creep.memory.role == ROLES.repairer);
        COMBAT_CREEPS.concat(rangers);
      }
      defendController.processing(SPAWN_ROOM, SPAWN_MEMORY.HOSTILES, COMBAT_CREEPS);
      towerController.processing(this.getState(), SPAWN_ROOM, SPAWN_MEMORY.HOSTILES, SPAWN_MEMORY);
      defendController.saveWorkCreeps(SPAWN_OBJ, WORK_CREEPS, SPAWN_MEMORY);
    } else {
      towerController.processing(this.getState(), SPAWN_ROOM, SPAWN_MEMORY.HOSTILES, SPAWN_MEMORY);
      this.creepsActions();
    }

    queueController.spawnQueqe(SPAWN_OBJ, SPAWN_ROOM, CREEPS, this.getState(), SPAWN_ROOM.name, CREEP_LEVEL, SPAWN_NAME);

    this.checkCreeps();
    this.checkSpawnCreeps();

    buildController.processing(SPAWN_OBJ);
  }
};
