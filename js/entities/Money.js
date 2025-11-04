import { Entity } from "./Entity.js";
import { spriteManager } from "../managers/spriteManager.js";

export class Money extends Entity {
    /** @type {number} - количество бонусных очков */
    bonus = 50;

    /**
     * Создает экземпляр денег
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * Отрисовывает деньги
     * @param {CanvasRenderingContext2D} ctx - контекст canvas
     */
    draw(ctx) {
        console.log("Отрисовка монеты");
        spriteManager.drawSprite(ctx, "money64", this.pos_x, this.pos_y);
    }

    /**
     * Обрабатывает сбор денег
     */
    kill() {
        // TODO: Логика сбора денег (например, добавление очков игроку)
    }

    /**
     * Обновление состояния денег (не требуется)
     */
    update() {
        // TODO: Деньги обычно статичны, не требуют обновления
    }
}