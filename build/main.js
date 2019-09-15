// includes
global.memory = require('memory.checked');
global.notifier = require('utils.notifier');


global.roomProc = require('room.proc');
global.buildController = require('build.controller');
global.defendController = require('defend.controller');
global.towerController = require('tower.controller');
global.queueController = require('queue.controller');
global.spawnGlobals = require('room.globals');


// global variables

global.roomControllers = [];

module.exports.loop = function () {
  roomProc.processing();
  memory.checkMemory();

  let mainSpawn = Game.spawns['Spawn1'];
  notifier.cpuNotify(mainSpawn);
}