import { Entity } from "./Entity.js";
import { spriteManager } from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";
import {mapManager} from "../managers/mapManager.js";
import {gameManager, IceType} from "../core/gameManager.js";
import {Ice} from "./Ice.js";

export class Player extends Entity {
    /** @type {number} - движение по X */
    move_x = 0;
    /** @type {number} - движение по Y */
    move_y = 0;
    /** @type {number} - направление по X */
    direction_x = 0;
    /** @type {number} - направление по Y */
    direction_y = 1;
    /** @type {number} - скорость движения */
    speed = 16;
    /** @type {number} - количество бонусов */
    points = 0;
    /** @type {string} - имя текущей анимации */
    animationName = 'hero_idle_down';
    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber = 0;
    /** @type {Object} - анимации игрока */
    animations = {
        'hero_attack1_down': [
            'hero_attack1_down_1',
            'hero_attack1_down_2',
            'hero_attack1_down_3',
            'hero_attack1_down_4',
            'hero_attack1_down_5',
            'hero_attack1_down_6',
            'hero_attack1_down_7',
            'hero_attack1_down_8',
        ],
        'hero_attack1_up': [
            'hero_attack1_up_1',
            'hero_attack1_up_2',
            'hero_attack1_up_3',
            'hero_attack1_up_4',
            'hero_attack1_up_5',
            'hero_attack1_up_6',
            'hero_attack1_up_7',
            'hero_attack1_up_8',
        ],
        'hero_attack1_left': [
            'hero_attack1_left_1',
            'hero_attack1_left_2',
            'hero_attack1_left_3',
            'hero_attack1_left_4',
            'hero_attack1_left_5',
            'hero_attack1_left_6',
            'hero_attack1_left_7',
            'hero_attack1_left_8',
        ],
        'hero_attack1_right': [
            'hero_attack1_right_1',
            'hero_attack1_right_2',
            'hero_attack1_right_3',
            'hero_attack1_right_4',
            'hero_attack1_right_5',
            'hero_attack1_right_6',
            'hero_attack1_right_7',
            'hero_attack1_right_8',
        ],
        'hero_idle_down': [
            'hero_idle_down_1',
            'hero_idle_down_2',
            'hero_idle_down_3',
            'hero_idle_down_4',
            'hero_idle_down_5',
            'hero_idle_down_6',
            'hero_idle_down_7',
            'hero_idle_down_8',
        ],
        'hero_idle_up': [
            'hero_idle_up_1',
            'hero_idle_up_2',
            'hero_idle_up_3',
            'hero_idle_up_4',
            'hero_idle_up_5',
            'hero_idle_up_6',
            'hero_idle_up_7',
            'hero_idle_up_8',
        ],
        'hero_idle_left': [
            'hero_idle_left_1',
            'hero_idle_left_2',
            'hero_idle_left_3',
            'hero_idle_left_4',
            'hero_idle_left_5',
            'hero_idle_left_6',
            'hero_idle_left_7',
            'hero_idle_left_8',
        ],
        'hero_idle_right': [
            'hero_idle_right_1',
            'hero_idle_right_2',
            'hero_idle_right_3',
            'hero_idle_right_4',
            'hero_idle_right_5',
            'hero_idle_right_6',
            'hero_idle_right_7',
            'hero_idle_right_8',
        ],
        'hero_run_down': [
            'hero_run_down_1',
            'hero_run_down_2',
            'hero_run_down_3',
            'hero_run_down_4',
            'hero_run_down_5',
            'hero_run_down_6',
            'hero_run_down_7',
            'hero_run_down_8',
        ],
        'hero_run_up': [
            'hero_run_up_1',
            'hero_run_up_2',
            'hero_run_up_3',
            'hero_run_up_4',
            'hero_run_up_5',
            'hero_run_up_6',
            'hero_run_up_7',
            'hero_run_up_8',
        ],
        'hero_run_left': [
            'hero_run_left_1',
            'hero_run_left_2',
            'hero_run_left_3',
            'hero_run_left_4',
            'hero_run_left_5',
            'hero_run_left_6',
            'hero_run_left_7',
            'hero_run_left_8',
        ],
        'hero_run_right': [
            'hero_run_right_1',
            'hero_run_right_2',
            'hero_run_right_3',
            'hero_run_right_4',
            'hero_run_right_5',
            'hero_run_right_6',
            'hero_run_right_7',
            'hero_run_right_8',
        ],
    };
    /** @type {boolean} - Показывает на наличие текущего процесса огня */
    isFireStarted = false;
    /** @type {boolean} - Показывает на наличие анимации подачи игроком огня */
    isFireAnimationStarted = false;
    /** @type {number} - X-координата текущего льда */
    fire_x = 0;
    /** @type {number} - Y-координата текущего льда */
    fire_y = 0;
    /** @type {number} - ширина текущего льда */
    fire_w = 0;
    /** @type {number} - высота текущего льда */
    fire_h = 0;
    /** @type {number} - направление текущей волны льда по X */
    fire_direction_x = 0;
    /** @type {number} - направление текущей волны льда по Y */
    fire_direction_y = 0;
    /** @type {boolean} - Показывает, какое действие идет на данные момент в волне льда */
    isAddIce = true;

    /**
     * Создает экземпляр игрока
     * @param {Object} [options] - параметры инициализации
     */
    constructor(options = {}) {
        super(options);
    }

    /**
     * Отрисовывает игрока
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
     * Обновляет состояние игрока
     */
    update() {
        if (this.isFireAnimationStarted) {
            if (this.frameNumber === this.animations[this.animationName].length) {
                this.isFireAnimationStarted = false;
                this.frameNumber = 0;
            }
            this.frameNumber++;
        }
        if (!this.isFireAnimationStarted) {
            physicManager.update(this);

            if (this.move_x === 1) {
                this.animationName = 'hero_run_right';
            }
            else if (this.move_x === -1) {
                this.animationName = 'hero_run_left';
            }
            else if (this.move_y === 1) {
                this.animationName = 'hero_run_down';
            }
            else if (this.move_y === -1) {
                this.animationName = 'hero_run_up';
            }

            if (this.move_y === 0 && this.move_x === 0) {
                if (this.direction_x === 1) this.animationName = 'hero_idle_right';
                else if (this.direction_x === -1) this.animationName = 'hero_idle_left';
                else if (this.direction_y === 1) this.animationName = 'hero_idle_down';
                else if (this.direction_y === -1) this.animationName = 'hero_idle_up';
            }
        }

        if (this.isFireStarted) {
            if (this.isAddIce) {
                this.addIce();
            } else {
                this.deleteIce();
            }

            if (this.isFireStarted) {
                this.fire_x += this.fire_direction_x * mapManager.tSize.x;
                this.fire_y += this.fire_direction_y * mapManager.tSize.y;
            }
        }
    }

    /**
     * Обрабатывает смерть игрока
     */
    kill() {
        // TODO: реализовать логику смерти игрока
        console.log("Player: You are dead");
    }

    /**
     * Обрабатывает столкновение с другой сущностью
     * @param {Entity} obj - сущность, с которой столкнулись
     */
    onTouchEntity(obj) {
        // TODO: реализовать логику столкновения с сущностями
        if (obj.name.includes("Money") && !obj.isDead) {
            this.points += obj.bonus;
            obj.kill();
        }
    }

    /**
     * Ищет координаты соседнего по направлению блока
     * @return {Object} - координаты соседнего по направлению блока (в пикселях)
     */
    getNearlyBlock() {
        var x = Math.floor((this.pos_x + this.direction_x * this.size_x) / mapManager.tSize.x);
        var y = Math.floor((this.pos_y + this.direction_y * this.size_y) / mapManager.tSize.y);
        if (this.pos_x % mapManager.tSize.x !== 0 && this.direction_x === 1) {
            x += 1;
        }
        if (this.pos_y % mapManager.tSize.y !== 0 && this.direction_y === 1) {
            y += 1;
        }

        return {
            x: x * mapManager.tSize.x,
            y: y * mapManager.tSize.y
        };
    }

    /**
     * Добавляет или убирает, если уже есть, блоки льда по направлению движения
     */
    fire() {
        if (!this.isFireStarted) {
            let coordinates = this.getNearlyBlock();
            this.fire_x = coordinates.x;
            this.fire_y = coordinates.y;

            this.fire_direction_x = this.direction_x;
            this.fire_direction_y = this.direction_y;

            var sprite = spriteManager.getSprite(Ice.getDefaultFrameName());
            this.fire_w = sprite.w;
            this.fire_h = sprite.h;

            var ices = gameManager.getIceAtXY(this.fire_x, this.fire_y, this.fire_w, this.fire_h);
            this.isAddIce = ices.length === 0;

            if (this.direction_x === 1) {this.animationName = 'hero_attack1_right';}
            else if (this.direction_x === -1) {this.animationName = 'hero_attack1_left';}
            else if (this.direction_y === 1) {this.animationName = 'hero_attack1_down'}
            else if (this.direction_y === -1) {this.animationName = 'hero_attack1_up'}
            this.frameNumber = 0;
            this.isFireAnimationStarted = true;

            this.isFireStarted = true;
        }
    }

    /**
     * Устанавливает значения по умолчанию для полей, используемых для реализации выстрела
     */
    setDefaultFireState() {
        this.isFireStarted = false;
        this.fire_x = 0;
        this.fire_y = 0;
        this.fire_w = 0;
        this.fire_h = 0;
        this.fire_direction_x = 0;
        this.fire_direction_y = 0;
    }

    /**
     * Добавляет блок льда на позицию, указанной в соответствующих полях
     */
    addIce() {
        var entities = gameManager.getEntitiesAtXY(this.fire_x, this.fire_y, this.fire_w, this.fire_h);
        var allAreMoney = gameManager.allAreMoney(entities);
        var isWall = mapManager.isTileWall(this.fire_x, this.fire_y);
        if (isWall || (entities.length !== 0 && !allAreMoney)) {
            this.setDefaultFireState();
            return;
        }

        gameManager.addEntityWithInfo(
            IceType,
            IceType + gameManager.iceCounter + 1,
            this.fire_x,
            this.fire_y,
            this.fire_w,
            this.fire_h
        );
    }

    /**
     * Удаляет блок льда на позиции, указанной в соответствующих полях
     */
    deleteIce() {
        var ices = gameManager.getIceAtXY(this.fire_x, this.fire_y, this.fire_w, this.fire_h);
        var isWall = mapManager.isTileWall(this.fire_x, this.fire_y);
        if (ices.length === 0 || isWall) {
            this.setDefaultFireState();
            return;
        }

        for (var i = 0; i < ices.length; i++) {
            ices[i].kill();
        }
    }
}