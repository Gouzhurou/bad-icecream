import {Entity} from "./Entity.js";
import {spriteManager} from "../managers/spriteManager.js";
import {gameManager} from "../core/gameManager.js";

export class Ice extends Entity {
    /** @type {string} - имя текущей анимации */
    animationName = 'creation';
    /** @type {string} - имя анимации по умолчанию */
    static defaultFrameName = "ice_4";
    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber = 0;
    /** @type {Object} - анимации сущности */
    animations = {
        "creation": [
            "ice_1",
            "ice_2",
            "ice_3",
            "ice_4",
        ]
    };
    isCreated = false;
    isDestroyed = false;

    /**
     * Создает экземпляр денег
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
        this.isCreated = true;
    }

    static getDefaultFrameName() {
        return this.defaultFrameName;
    }

    /**
     * Отображает блок льда
     * @param {CanvasRenderingContext2D} ctx - контекст canvas
     */
    draw(ctx) {
        if (!this.isCreated && !this.isDestroyed) {
            spriteManager.drawSprite(ctx, Ice.defaultFrameName, this.pos_x, this.pos_y);
        }
        else {
            this.drawAnimation(ctx);
        }
    }

    drawAnimation(ctx) {
        const animation = this.animations[this.animationName];
        if (this.frameNumber === animation.length) {
            this.isCreated = false;
            spriteManager.drawSprite(ctx, Ice.defaultFrameName, this.pos_x, this.pos_y);
            this.frameNumber -= 1;
            return;
        }
        if (this.frameNumber === -1) {
            gameManager.kill(this);
            return;
        }
        spriteManager.drawSprite(ctx, animation[this.frameNumber], this.pos_x, this.pos_y);
        if (this.isCreated) this.frameNumber++;
        if(this.isDestroyed) this.frameNumber--;
    }

    /**
     * Обработчик исчезновения блока
     */
    kill() {
        this.isDestroyed = true;
    }
}