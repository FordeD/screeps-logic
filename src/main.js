var spawns_proc = require('spawn.proc');
var memory_checked = require('memory.checked');
var defend_proc = require('defend.proc');

module.exports.loop = function() {
    memory_checked.checkMemory();
    defend_proc.processing();
    spawns_proc.processing();
}