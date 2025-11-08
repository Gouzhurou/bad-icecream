import { Entity } from './Entity.js';
import { spriteManager } from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";

export class GreenMonster extends Entity {
    /** @type {number} - движение по X */
    move_x = -1;
    /** @type {number} - движение по Y */
    move_y = 0;
    /** @type {number} - скорость движения */
    speed = 4;
    /** @type {string} - имя текущей анимации */
    animationName = "orange_cat_go_left";
    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber = 0;
    /** @type {Object} - анимации игрока */
    animations = {
        "orange_cat_go_left": [
            "orange_cat_go_left_1",
            "orange_cat_go_left_2",
            "orange_cat_go_left_3",
            "orange_cat_go_left_4",
            "orange_cat_go_left_5",
            "orange_cat_go_left_6",
        ],
        "orange_cat_go_right": [
            "orange_cat_go_right_1",
            "orange_cat_go_right_2",
            "orange_cat_go_right_3",
            "orange_cat_go_right_4",
            "orange_cat_go_right_5",
            "orange_cat_go_right_6",
        ],
        "orange_cat_go_up": [
            "orange_cat_go_up_1",
            "orange_cat_go_up_2",
            "orange_cat_go_up_3",
            "orange_cat_go_up_4",
            "orange_cat_go_up_5",
            "orange_cat_go_up_6",
        ],
        "orange_cat_go_down": [
            "orange_cat_go_down_1",
            "orange_cat_go_down_2",
            "orange_cat_go_down_3",
            "orange_cat_go_down_4",
            "orange_cat_go_down_5",
            "orange_cat_go_down_6",
        ],
    }

    /**
     * Создает экземпляр зеленого монстра
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * Отрисовывает монстра
     * @param {CanvasRenderingContext2D} ctx - контекст canvas
     */
    draw(ctx) {
        var animation = this.animations[this.animationName];
        if (this.frameNumber === animation.length) {
            this.frameNumber = 0;
        }

        var currentFrame = animation[this.frameNumber];
        spriteManager.drawSprite(ctx, currentFrame, this.pos_x, this.pos_y);
        this.frameNumber++;
    }

    /**
     * Обновляет состояние монстра
     */
    update() {
        physicManager.update(this);

        if (this.move_x === 1) {
            this.animationName = 'orange_cat_go_right';
        }
        else if (this.move_x === -1) {
            this.animationName = 'orange_cat_go_left';
        }
        else if (this.move_y === 1) {
            this.animationName = 'orange_cat_go_down';
        }
        else if (this.move_y === -1) {
            this.animationName = 'orange_cat_go_up';
        }
    }

    /**
     * Обрабатывает столкновение с другой сущностью
     * @param {Entity} obj - сущность, с которой столкнулись
     */
    onTouchEntity(obj) {
        if (obj.name.includes("Money"))
            return;
        this.turnRight();
    }

    /**
     * Обрабатывает столкновение с картой
     */
    onTouchMap() {
        this.turnRight();
    }

    /**
     * Поворот направо на 90 градусов
     */
    turnRight() {
        const newX = (-1) * this.move_y;
        const newY = this.move_x;

        this.move_x = newX;
        this.move_y = newY;
    }
}