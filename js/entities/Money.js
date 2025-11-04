import {Entity} from "./Entity";
import {spriteManager} from "../managers/spriteManager";

export var Money = Entity.extend({
    bonus: 50,

    draw: function(ctx) {
      spriteManager.drawSprite(ctx, "Money", this.pos_x, this.pos_y);
    },

    kill: function() {

    }
});