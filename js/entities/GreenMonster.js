import { Entity } from './Entity.js';
import { spriteManager } from "../managers/spriteManager.js";

export class GreenMonster extends Entity {
    /** @type {number} - движение по X */
    move_x = 0;
    /** @type {number} - движение по Y */
    move_y = 0;
    /** @type {number} - скорость движения */
    speed = 1;

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
        spriteManager.drawSprite(ctx, "orange_cat_sit_1", this.pos_x, this.pos_y);
    }

    /**
     * Обновляет состояние монстра
     */
    update() {
        // TODO: Логика обновления монстра
    }

    /**
     * Обрабатывает столкновение с другой сущностью
     * @param {Entity} obj - сущность, с которой столкнулись
     */
    onTouchEntity(obj) {
        // TODO: Логика столкновения с другой сущностью
    }

    /**
     * Обрабатывает столкновение с картой
     */
    onTouchMap() {
        // TODO: Логика столкновения с картой
    }
}