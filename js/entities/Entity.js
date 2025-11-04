/**
 * Объект для представления сущности
 * @namespace
 */
export class Entity {
    /** @type {number} - X-координата сущности (в пикселях) */
    pos_x = 0;
    /** @type {number} - Y-координата сущности (в пикселях) */
    pos_y = 0;
    /** @type {number} - ширина сущности (в пикселях) */
    size_x = 0;
    /** @type {number} - высота сущности (в пикселях) */
    size_y = 0;
    /** @type {string} - имя сущности */
    name = "";

    /**
     * Создает экземпляр сущности
     * @param {Object} [options] - параметры инициализации
     * @param {number} [options.pos_x=0] - X-координата
     * @param {number} [options.pos_y=0] - Y-координата
     * @param {number} [options.size_x=0] - ширина
     * @param {number} [options.size_y=0] - высота
     * @param {string} [options.name=""] - имя
     */
    constructor(options = {}) {
        this.pos_x = options.pos_x || 0;
        this.pos_y = options.pos_y || 0;
        this.size_x = options.size_x || 0;
        this.size_y = options.size_y || 0;
        this.name = options.name || "";
    }

    /**
     * Метод обновления состояния сущности (должен быть переопределен)
     */
    update() {
        // Базовая реализация, должна быть переопределена в дочерних классах
    }

    /**
     * Метод отрисовки сущности (должен быть переопределен)
     * @param {CanvasRenderingContext2D} ctx - контекст canvas
     */
    draw(ctx) {
        // Базовая реализация, должна быть переопределена в дочерних классах
    }
}

