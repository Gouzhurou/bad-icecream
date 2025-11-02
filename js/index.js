import { mapManager } from './managers/mapManager.js';

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

mapManager.loadMap("./js/map.tmj");
// spriteManager.loadAtlas("atlas.json", "atlas.png");
// mapManager.parseEntities();
mapManager.draw(ctx);

console.log('Map manager loaded successfully');