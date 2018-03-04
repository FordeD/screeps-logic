var spawns_proc = require('spawn.proc');
var memory_checked = require('memory.checked');
var defend_proc = require('defend.proc');
var atack_proc = require('atack.proc');

module.exports.loop = function() {
    memory_checked.checkMemory();
    defend_proc.processing();
    spawns_proc.processing();
    atack_proc.processing();
}