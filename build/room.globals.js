
module.exports = {
  processing(spawn) {
    if (!spawn.memory.ROOM_STATES) {
      spawn.memory.ROOM_STATES = {
        STARTED: 0,
        EVOLUTION: 1,
        DEFEND: 2,
        ATACK: 3
      };
    }

    // WORLD VARIABLES
    if (!spawn.memory.HOSTILES) {
      spawn.memory.HOSTILES = [];
    }
    if (!spawn.memory.SPAWN_QUEUE) {
      spawn.memory.SPAWN_QUEUE = [];
    }
    if (!spawn.memory.WALL_HITS_MAX) {
      spawn.memory.WALL_HITS_MAX = [1000, 3000, 5000, 20000, 100000, 400000, 800000, 2900000];
    }

    // CREEP CONSTANTS
    if (!spawn.memory.CREEPS_MAX_COUNT) {
      spawn.memory.CREEPS_MAX_COUNT = 34;
    }
    if (!spawn.memory.HARVESTER_MAX_COUNT) {
      spawn.memory.HARVESTER_MAX_COUNT = [11, 11, 3, 5];
    }
    if (!spawn.memory.CL_UPGRADER_MAX_COUNT) {
      spawn.memory.CL_UPGRADER_MAX_COUNT = [5, 4, 2, 2];
    }
    if (!spawn.memory.EX_BUILDER_MAX_COUNT) {
      spawn.memory.EX_BUILDER_MAX_COUNT = [5, 4, 4, 5];
    }
    if (!spawn.memory.REPAIRER_MAX_COUNT) {
      spawn.memory.REPAIRER_MAX_COUNT = [5, 4, 4, 3];
    }
    if (!spawn.memory.SOLDER_MAX_COUNT) {
      spawn.memory.SOLDER_MAX_COUNT = [3, 4, 7, 7];
    }
    if (!spawn.memory.RANGER_MAX_COUNT) {
      spawn.memory.RANGER_MAX_COUNT = [3, 2, 6, 2];
    }
    if (!spawn.memory.HEALER_MAX_COUNT) {
      spawn.memory.HEALER_MAX_COUNT = [0, 1, 4, 4];
    }
    if (!spawn.memory.CLAIMER_MAX_COUNT) {
      spawn.memory.CLAIMER_MAX_COUNT = [2, 4, 4, 6];
    }
    if (!spawn.memory.ROLES) {
      spawn.memory.ROLES = {
        harvester: 'harvester',
        upgrader: 'cl_upgrader',
        builder: 'ex_builder',
        repairer: 'repairer',
        solder: 'solder',
        ranger: 'ranger',
        healer: 'healer',
        claimer: 'claimer'
      };
    }

    if (!spawn.memory.SPAWN_QUEUE_MAX) {
      spawn.memory.SPAWN_QUEUE_MAX = 34;
    }
    if (!spawn.memory.MIN_SPAWN_ENERGY) {
      spawn.memory.MIN_SPAWN_ENERGY = [300, 500, 700, 1400];
    }

    /*          CREEP BODY
    MOVE            50
    WORK            100
    CARRY           50
    ATTACK          80
    RANGED_ATTACK   150
    HEAL            250
    CLAIM           600
    TOUGH           10
    */
    if (!spawn.memory.creepBodies) {
      spawn.memory.creepBodies = {
        MOVE: 50,
        WORK: 100,
        CARRY: 50,
        ATTACK: 80,
        RANGED_ATTACK: 150,
        HEAL: 250,
        CLAIM: 600,
        TOUGH: 10
      }
    }
    if (!spawn.memory.HARVESTER_BODY_ECO) {
      spawn.memory.HARVESTER_BODY_ECO = [MOVE, WORK, CARRY];
    }
    if (!spawn.memory.HARVESTER_BODY) {
      spawn.memory.HARVESTER_BODY = [
        [MOVE, WORK, WORK, CARRY],
        [MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
        [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      ];
    }
    if (!spawn.memory.CL_UPGRADER_BODY) {
      spawn.memory.CL_UPGRADER_BODY = [
        [MOVE, WORK, CARRY, CARRY, CARRY],
        [MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
        [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
      ];
    }
    if (!spawn.memory.EX_BUILDER_BODY) {
      spawn.memory.EX_BUILDER_BODY = [
        [MOVE, WORK, CARRY, CARRY, CARRY],
        [MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
        [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
      ];
    }
    if (!spawn.memory.SOLDER_BODY) {
      spawn.memory.SOLDER_BODY = [
        [ATTACK, ATTACK, ATTACK, MOVE, TOUGH],
        [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE],
        [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH]
      ];
    }
    if (!spawn.memory.REPAIRER_BODY) {
      spawn.memory.REPAIRER_BODY = [
        [MOVE, WORK, CARRY, CARRY, CARRY],
        [MOVE, MOVE, WORK, CARRY, CARRY, CARRY, RANGED_ATTACK],
        [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, RANGED_ATTACK]
      ];
    }
    if (!spawn.memory.RANGER_BODY) {
      spawn.memory.RANGER_BODY = [
        [RANGED_ATTACK, MOVE, MOVE, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
        [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]
      ];
    }
    if (!spawn.memory.HEALER_BODY) {
      spawn.memory.HEALER_BODY = [
        [HEAL, MOVE],
        [HEAL, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH],
        [HEAL, HEAL, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH]
      ];
    }
    if (!spawn.memory.CLAIMER_BODY) {
      spawn.memory.CLAIMER_BODY = [
        false,
        false,
        [CLAIM, MOVE, MOVE],
        [CLAIM, CLAIM, MOVE, MOVE, MOVE, MOVE],
      ];
    }


    // OTHER CONSTANTS
    if (!spawn.memory.GCL || spawn.memory.GCL != Game.gcl) {
      spawn.memory.GCL = Game.gcl;
    }

    if (!spawn.memory.LOG_TYPES) {
      spawn.memory.LOG_TYPES = {
        DEV: 0,
        ACTION: 1,
        STATISTIC: 2
      };
    }

    if (!spawn.memory.NOTIFY_TIMER_COUNT) {
      spawn.memory.NOTIFY_TIMER_COUNT = {
        LEVEL: 300,
        CPU: 100
      };
    }
    if (!spawn.memory.CPU_NOTIFY_TIME || spawn.memory.CPU_NOTIFY_TIME > spawn.memory.NOTIFY_TIMER_COUNT.CPU) {
      spawn.memory.CPU_NOTIFY_TIME = 0;
    }

    spawn.memory.USED_CPU = 0;
    spawn.memory.MAX_USED_CPU = 0;
    spawn.memory.AVERAGE_USED_CPU = 0;

    if (!spawn.memory.CREEP_MOVE_ATACK) {
      spawn.memory.CREEP_MOVE_ATACK = {
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#ee6a50',
          lineStyle: 'dashed',
          strokeWidth: .15,
          opacity: .1
        }
      };
    }
    if (!spawn.memory.CREEP_MOVE_LINE) {
      spawn.memory.CREEP_MOVE_LINE = {
        visualizePathStyle: {
          fill: 'transparent',
          stroke: '#ffffff',
          lineStyle: 'dashed',
          strokeWidth: .15,
          opacity: .1
        }, reusePath: 25
      };
    }

    if (!spawn.memory.CREEP_HARVEST_LINE) {
      spawn.memory.CREEP_HARVEST_LINE = {
        fill: 'transparent',
        stroke: '#ffd700',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
      };
    }

    if (!spawn.memory.CREEP_EXIT_LINE) {
      spawn.memory.CREEP_EXIT_LINE = {
        fill: 'transparent',
        stroke: '#4346ff',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
      };
    }

    if (!spawn.memory.CREEP_TO_SPAWN_LINE) {
      spawn.memory.CREEP_TO_SPAWN_LINE = {
        fill: 'transparent',
        stroke: '#029557',
        lineStyle: 'dashed',
        strokeWidth: .15,
        opacity: .1
      };
    }

    if (!spawn.memory.RESOURCE_TYPES) {
      spawn.memory.RESOURCE_TYPES = [
        RESOURCE_ENERGY,
        RESOURCE_POWER,
        RESOURCE_HYDROGEN,
        RESOURCE_OXYGEN,
        RESOURCE_UTRIUM,
        RESOURCE_LEMERGIUM,
        RESOURCE_KEANIUM,
        RESOURCE_ZYNTHIUM,
        RESOURCE_CATALYST,
        RESOURCE_GHODIUM,
        RESOURCE_HYDROXIDE,
        RESOURCE_ZYNTHIUM_KEANITE,
        RESOURCE_UTRIUM_LEMERGITE,
        RESOURCE_UTRIUM_HYDRIDE,
        RESOURCE_UTRIUM_OXIDE,
        RESOURCE_KEANIUM_HYDRIDE,
        RESOURCE_KEANIUM_OXIDE,
        RESOURCE_LEMERGIUM_HYDRIDE,
        RESOURCE_LEMERGIUM_OXIDE,
        RESOURCE_ZYNTHIUM_HYDRIDE,
        RESOURCE_ZYNTHIUM_OXIDE,
        RESOURCE_GHODIUM_HYDRIDE,
        RESOURCE_GHODIUM_OXIDE,
        RESOURCE_UTRIUM_ACID,
        RESOURCE_UTRIUM_ALKALIDE,
        RESOURCE_KEANIUM_ACID,
        RESOURCE_KEANIUM_ALKALIDE,
        RESOURCE_LEMERGIUM_ACID,
        RESOURCE_LEMERGIUM_ALKALIDE,
        RESOURCE_ZYNTHIUM_ACID,
        RESOURCE_ZYNTHIUM_ALKALIDE,
        RESOURCE_GHODIUM_ACID,
        RESOURCE_GHODIUM_ALKALIDE,
        RESOURCE_CATALYZED_UTRIUM_ACID,
        RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
        RESOURCE_CATALYZED_KEANIUM_ACID,
        RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
        RESOURCE_CATALYZED_LEMERGIUM_ACID,
        RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
        RESOURCE_CATALYZED_ZYNTHIUM_ACID,
        RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
        RESOURCE_CATALYZED_GHODIUM_ACID,
        RESOURCE_CATALYZED_GHODIUM_ALKALIDE
      ];
    }
  }
}