import { Entity } from "./Entity.js";
import { spriteManager } from "../managers/spriteManager.js";
import {gameManager} from "../core/gameManager.js";

export class Money extends Entity {
    /** @type {number} - количество бонусных очков */
    bonus = 50;
    /** @type {Boolean} - флаг смерти сущности */
    isDead = false;

    /** @type {string} - имя текущей анимации */
    animationName = 'money64';
    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber = 0;
    /** @type {Object} - анимации сущности */
    animations = {
        "bomb": [
            "bomb_1",
            "bomb_2",
            "bomb_3",
            "bomb_4",
            "bomb_5",
            "bomb_6",
            "bomb_7",
            "bomb_8",
            "bomb_9",
        ],
        "money64": [
            "money64"
        ]
    };

    /**
     * Создает экземпляр денег
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * Отображает сущность в контексте
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     */
    draw(ctx) {
        const animation = this.animations[this.animationName];
        if (this.frameNumber === animation.length) {
            if (this.isDead) {
                gameManager.kill(this);
                return;
            } else {
                this.frameNumber = 0;
            }
        }

        const currentFrame = animation[this.frameNumber];
        spriteManager.drawSprite(ctx, currentFrame, this.pos_x, this.pos_y);
        this.frameNumber++;
    }

    /**
     * Обрабатывает сбор денег
     */
    kill() {
        if (!this.isDead) {
            this.frameNumber = 0;
            this.animationName = 'bomb';
        }
        this.isDead = true;
    }
}