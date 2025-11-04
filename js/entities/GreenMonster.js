import { Entity } from './Entity';
import {spriteManager} from "../managers/spriteManager";

export var GreenMonster = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 1,
    draw: function(ctx) {
        spriteManager.drawSprite(ctx, "green_monster", this.pos_x, this.pos_y);
    },
    update: function() {},
    kill: function() {},
    onTouchEntity: function(obj) {},
    onTouchMap: function() {},
});