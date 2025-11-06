import {Entity} from "./Entity.js";
import {spriteManager} from "../managers/spriteManager.js";

export class Ice extends Entity {
    /** @type {string} - имя текущей анимации */
    animationName = 'creation';
    /** @type {string} - имя анимации по умолчанию */
    defaultFrameName = "ice_4";
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

    /**
     * Создает экземпляр денег
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
        this.isCreated = true;
    }

    /**
     * Отображает блок льда
     * @param {CanvasRenderingContext2D} ctx - контекст canvas
     */
    draw(ctx) {
        if (!this.isCreated) {
            spriteManager.drawSprite(ctx, this.defaultFrameName, this.pos_x, this.pos_y);
        } else {
            var animation = this.animations[this.animationName];
            if (this.frameNumber === animation.length) {
                this.isCreated = false;
                spriteManager.drawSprite(ctx, this.defaultFrameName, this.pos_x, this.pos_y);
                return;
            }
            spriteManager.drawSprite(ctx, animation[this.frameNumber], this.pos_x, this.pos_y);
            this.frameNumber++;
        }
    }

    /**
     * Обработчик исчезновения блока
     */
    kill() {
        // TODO: Добавить обработку исчезновения блока
    }
}