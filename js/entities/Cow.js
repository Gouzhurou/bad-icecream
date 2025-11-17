import { Entity } from './Entity.js';
import { spriteManager } from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";
import {gameManager, MoneyType, PlayerType} from "../core/gameManager.js";
import {mapManager} from "../managers/mapManager.js";

export class Cow extends Entity {
    /** @type {number} - движение по X */
    move_x = 0;
    /** @type {number} - движение по Y */
    move_y = 1;
    /** @type {number} - скорость движения */
    speed = 8;
    /** @type {string} - имя текущей анимации */
    animationName = "black_cat_go_down";
    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber = 0;
    /** @type {Object} - анимации игрока */
    animations = {
        "black_cat_go_left": [
            "black_cat_go_left_1",
            "black_cat_go_left_2",
            "black_cat_go_left_3",
            "black_cat_go_left_4",
            "black_cat_go_left_5",
            "black_cat_go_left_6",
        ],
        "black_cat_go_right": [
            "black_cat_go_right_1",
            "black_cat_go_right_2",
            "black_cat_go_right_3",
            "black_cat_go_right_4",
            "black_cat_go_right_5",
            "black_cat_go_right_6",
        ],
        "black_cat_go_up": [
            "black_cat_go_up_1",
            "black_cat_go_up_2",
            "black_cat_go_up_3",
            "black_cat_go_up_4",
            "black_cat_go_up_5",
            "black_cat_go_up_6",
        ],
        "black_cat_go_down": [
            "black_cat_go_down_1",
            "black_cat_go_down_2",
            "black_cat_go_down_3",
            "black_cat_go_down_4",
            "black_cat_go_down_5",
            "black_cat_go_down_6",
        ],
    }
    /** @type {number} - счетчик обновлений для смены направления */
    updateCounter = 0;
    /** @type {number} - частота смены направления (в количестве фреймов) */
    directionChangeFrequency = gameManager.FPS * 2;

    /**
     * Создает экземпляр зеленого монстра
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
        this.chooseDirection();
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
        this.updateCounter += 1;
        if (this.updateCounter >= this.directionChangeFrequency) {
            this.chooseDirection();
            this.updateCounter = 0;
        }

        physicManager.update(this);

        if (this.move_x === 1) {
            this.animationName = 'black_cat_go_right';
        }
        else if (this.move_x === -1) {
            this.animationName = 'black_cat_go_left';
        }
        else if (this.move_y === 1) {
            this.animationName = 'black_cat_go_down';
        }
        else if (this.move_y === -1) {
            this.animationName = 'black_cat_go_up';
        }
    }

    /**
     * Обрабатывает столкновение с другой сущностью
     * @param {Entity} obj - сущность, с которой столкнулись
     */
    onTouchEntity(obj) {
        if (obj.name === PlayerType) {
            obj.kill();
        }
        if (obj.name.includes(MoneyType))
            return;
        this.chooseDirection();
    }

    /**
     * Обрабатывает столкновение с картой
     */
    onTouchMap() {
        this.chooseDirection();
    }

    /**
     * Выбор направления движения
     */
    chooseDirection() {
        let frontBlock = mapManager.getNearlyBlock(
            {x: this.pos_x, y: this.pos_y},
            {x: this.size_x, y: this.size_y},
            {x: this.move_x, y: this.move_y}
        );
        let leftBlock = mapManager.getNearlyBlock(
            {x: this.pos_x, y: this.pos_y},
            {x: this.size_x, y: this.size_y},
            {x: this.move_y, y: (-1) * this.move_x}
        );
        let rightBlock = mapManager.getNearlyBlock(
            {x: this.pos_x, y: this.pos_y},
            {x: this.size_x, y: this.size_y},
            {x: (-1) * this.move_y, y: this.move_x}
        );

        const frontAvailable = this.isCellAvailable(frontBlock);
        const leftAvailable = this.isCellAvailable(leftBlock);
        const rightAvailable = this.isCellAvailable(rightBlock);

        const availableDirections = [];

        if (frontAvailable) {
            availableDirections.push({
                x: this.move_x,
                y: this.move_y
            });
        }

        if (leftAvailable) {
            availableDirections.push({
                x: this.move_y,
                y: (-1) * this.move_x
            });
        }

        if (rightAvailable) {
            availableDirections.push({
                x: (-1) * this.move_y,
                y: this.move_x
            });
        }

        if (availableDirections.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableDirections.length);
            const chosenDirection = availableDirections[randomIndex];

            this.move_x = chosenDirection.x;
            this.move_y = chosenDirection.y;
        } else {
            this.move_x = -this.move_x;
            this.move_y = -this.move_y;
        }
    }

    /**
     * Показывает, доступна ли клетка
     * @param {Object} block - координаты клетки (в пикселях)
     * @param {number} block.x - X-координата клетки на карте (в пикселях)
     * @param {number} block.y - Y-координата клетки на карте (в пикселях)
     * @return {boolean}
     */
    isCellAvailable(block) {
        if (mapManager.isTileWall(block.x, block.y)) {
            return false;
        }

        const entities = gameManager.getEntitiesAtXY(block.x, block.y, this.size_x, this.size_y);
        return entities.length === 0 || gameManager.allAreMoney(entities)
    }
}