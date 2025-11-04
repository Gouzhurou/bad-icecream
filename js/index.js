import {gameManager} from "./core/gameManager.js";

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

gameManager.initContext(ctx);
gameManager.loadAll();
gameManager.play();
