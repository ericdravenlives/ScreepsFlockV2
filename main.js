//Role Imports
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleTanker = require('role.tanker');

//Util Imports
var Traveler = require('utils/traveler.js');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    //inventory
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var tankers = _.filter(Game.creeps, (creep) => creep.memory.role == 'tanker');
    console.log('Harvesters: ' + harvesters.length);
    console.log('Builders: ' + builders.length);
    console.log('Upgraders: ' + upgraders.length);
    console.log('Tankers: ' + tankers.length);
    console.log('Available Energy: ' + Game.spawns.RESOURCE_ENERGY);

    //console.log('Controller Status: ' = PWR_OPERATE_CONTROLLER)

    //Basic spawner
    if(harvesters.length < 2 && Game.spawns.RESOURCE_ENERGY > 200) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'harvester'}});
    }
    if(builders.length < 2 && Game.spawns.RESOURCE_ENERGY > 200) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'builder'}});
    }
    if(upgraders.length < 2 && Game.spawns.RESOURCE_ENERGY > 200 && Game.room) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
            {memory: {role: 'upgrader'}});
    }
    if(tankers.length < 2 && Game.spawns.RESOURCE_ENERGY >= 300) {
        var newName = 'Tanker' + Game.time;
        console.log('Spawning new tanker: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE], newName, 
            {memory: {role: 'tanker'}});
    }


    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    //Room Controller Actions:

    //Creep Caller
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'tanker') {
            roleTanker.run(creep);
        }
    }
}