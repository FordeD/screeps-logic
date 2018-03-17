// includes
global.memory = require('memory.checked');
global.notifier = require('utils.notifier');


global.roomProc = require('room.proc');
global.buildController = require('build.controller');
global.defendController = require('defend.controller');
global.towerController = require('tower.controller');
global.queueController = require('queue.controller');


// global variables

global.roomControllers        = [];


// CONSTANTS

// ROOM STATES
global.ROOM_STATES = {
  STARTED: 0,
  EVOLUTION: 1,
  DEFEND: 2,
  ATACK: 3
};

// WORLD VARIABLES
global.HOSTILES               = [];
global.SPAWN_QUEUE            = [];
global.WALL_HITS_MAX          = [1000,3000,5000,20000,100000,400000,800000,2900000];

// CREEP CONSTANTS
global.CREEPS_MAX_COUNT       = 34;
global.HARVESTER_MAX_COUNT    = [11,11,3,5]; 
global.CL_UPGRADER_MAX_COUNT  = [5,4,2,2];
global.EX_BUILDER_MAX_COUNT   = [5,4,4,5];
global.REPAIRER_MAX_COUNT     = [5,4,4,3];
global.SOLDER_MAX_COUNT       = [3,4,7,7];
global.RANGER_MAX_COUNT       = [3,2,6,2];
global.HEALER_MAX_COUNT       = [0,1,4,4];
global.CLAIMER_MAX_COUNT      = [2,4,4,6];

global.ROLES = {
  harvester: 'harvester', 
  upgrader: 'cl_upgrader', 
  builder: 'ex_builder', 
  repairer: 'repairer', 
  solder: 'solder', 
  ranger: 'ranger', 
  healer: 'healer',
  claimer: 'claimer'
};

global.SPAWN_QUEUE_MAX        = 26;
global.MIN_SPAWN_ENERGY       = [300,500,700,1400];

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

global.HARVESTER_BODY_ECO = [MOVE, WORK, CARRY];
global.HARVESTER_BODY = [
  [MOVE, WORK, WORK, CARRY],
  [MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
];
global.CL_UPGRADER_BODY = [
  [MOVE, WORK, CARRY, CARRY, CARRY],
  [MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, MOVE, MOVE,  WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
];
global.EX_BUILDER_BODY = [
  [MOVE, WORK, CARRY, CARRY, CARRY],
  [MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
  [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
];
global.SOLDER_BODY = [
  [ATTACK, ATTACK, ATTACK, MOVE, TOUGH],
  [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE],
  [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH]
];
global.REPAIRER_BODY = [
  [MOVE, WORK, CARRY, CARRY, CARRY],
  [MOVE, MOVE, WORK, CARRY, CARRY, CARRY, RANGED_ATTACK],
  [MOVE, MOVE, MOVE, MOVE, MOVE,  WORK, CARRY, CARRY, CARRY, CARRY, RANGED_ATTACK]
];
global.RANGER_BODY = [
  [RANGED_ATTACK, MOVE, MOVE, MOVE],
  [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
  [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]
];
global.HEALER_BODY = [
  [HEAL, MOVE],
  [HEAL, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH],
  [HEAL, HEAL, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH]
];
global.CLAIMER_BODY = [
  false,
  false,
  [CLAIM,MOVE,MOVE],
  [CLAIM,CLAIM,MOVE,MOVE,MOVE,MOVE],
];


// OTHER CONSTANTS

global.GCL = Game.gcl;

global.LOG_TYPES = {
  DEV: 0,
  ACTION: 1,
  STATISTIC: 2
};

global.NOTIFY_TIMER_COUNT = {
  LEVEL: 300,
  CPU: 100
};
global.CPU_NOTIFY_TIME = 0;
global.USED_CPU = 0;
global.MAX_USED_CPU = 0;
global.AVERAGE_USED_CPU = 0;

global.CREEP_MOVE_ATACK       = {visualizePathStyle: {stroke: '#ee6a50'}};
global.CREEP_MOVE_LINE        = {visualizePathStyle: {stroke: '#ffffff'}};

module.exports.loop = function() {
  roomProc.processing();
  memory.checkMemory();

  let mainSpawn = Game.spawns['Spawn1'];
  notifier.cpuNotify(mainSpawn);
}