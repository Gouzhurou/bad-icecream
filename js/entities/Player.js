import { Entity } from "./Entity.js";
import { spriteManager } from "../managers/spriteManager.js";
import {physicManager} from "../managers/physicManager.js";

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
    speed = 10;
    /** @type {number} - количество бонусов */
    bonus = 0;
    /** @type {string} - имя текущей анимации */
    animationName = 'hero_idle_down';
    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber = 0;
    /** @type {number} - счетчик для определения скорости смены фреймов */
    frameCounter = 0;
    /** @type {Object} - анимации игрока */
    animations = {
        'hero_attack1_down': {
            framerate: 8,
            frames: [
                'hero_attack1_down_1',
                'hero_attack1_down_2',
                'hero_attack1_down_3',
                'hero_attack1_down_4',
                'hero_attack1_down_5',
                'hero_attack1_down_6',
                'hero_attack1_down_7',
                'hero_attack1_down_8',
            ]
        },
        'hero_attack1_up': {
            framerate: 8,
            frames: [
                'hero_attack1_up_1',
                'hero_attack1_up_2',
                'hero_attack1_up_3',
                'hero_attack1_up_4',
                'hero_attack1_up_5',
                'hero_attack1_up_6',
                'hero_attack1_up_7',
                'hero_attack1_up_8',
            ]
        },
        'hero_attack1_left': {
            framerate: 8,
            frames: [
                'hero_attack1_left_1',
                'hero_attack1_left_2',
                'hero_attack1_left_3',
                'hero_attack1_left_4',
                'hero_attack1_left_5',
                'hero_attack1_left_6',
                'hero_attack1_left_7',
                'hero_attack1_left_8',
            ]
        },
        'hero_attack1_right': {
            framerate: 8,
            frames: [
                'hero_attack1_right_1',
                'hero_attack1_right_2',
                'hero_attack1_right_3',
                'hero_attack1_right_4',
                'hero_attack1_right_5',
                'hero_attack1_right_6',
                'hero_attack1_right_7',
                'hero_attack1_right_8',
            ]
        },
        'hero_idle_down': {
            framerate: 1,
            frames: [
                'hero_idle_down_1',
                'hero_idle_down_2',
                'hero_idle_down_3',
                'hero_idle_down_4',
                'hero_idle_down_5',
                'hero_idle_down_6',
                'hero_idle_down_7',
                'hero_idle_down_8',
            ]
        },
        'hero_idle_up': {
            framerate: 1,
            frames: [
                'hero_idle_up_1',
                'hero_idle_up_2',
                'hero_idle_up_3',
                'hero_idle_up_4',
                'hero_idle_up_5',
                'hero_idle_up_6',
                'hero_idle_up_7',
                'hero_idle_up_8',
            ]
        },
        'hero_idle_left': {
            framerate: 1,
            frames: [
                'hero_idle_left_1',
                'hero_idle_left_2',
                'hero_idle_left_3',
                'hero_idle_left_4',
                'hero_idle_left_5',
                'hero_idle_left_6',
                'hero_idle_left_7',
                'hero_idle_left_8',
            ]
        },
        'hero_idle_right': {
            framerate: 1,
            frames: [
                'hero_idle_right_1',
                'hero_idle_right_2',
                'hero_idle_right_3',
                'hero_idle_right_4',
                'hero_idle_right_5',
                'hero_idle_right_6',
                'hero_idle_right_7',
                'hero_idle_right_8',
            ]
        },
        'hero_run_down': {
            framerate: 1,
            frames: [
                'hero_run_down_1',
                'hero_run_down_2',
                'hero_run_down_3',
                'hero_run_down_4',
                'hero_run_down_5',
                'hero_run_down_6',
                'hero_run_down_7',
                'hero_run_down_8',
            ]
        },
        'hero_run_up': {
            framerate: 1,
            frames: [
                'hero_run_up_1',
                'hero_run_up_2',
                'hero_run_up_3',
                'hero_run_up_4',
                'hero_run_up_5',
                'hero_run_up_6',
                'hero_run_up_7',
                'hero_run_up_8',
            ]
        },
        'hero_run_left': {
            framerate: 1,
            frames: [
                'hero_run_left_1',
                'hero_run_left_2',
                'hero_run_left_3',
                'hero_run_left_4',
                'hero_run_left_5',
                'hero_run_left_6',
                'hero_run_left_7',
                'hero_run_left_8',
            ]
        },
        'hero_run_right': {
            framerate: 1,
            frames: [
                'hero_run_right_1',
                'hero_run_right_2',
                'hero_run_right_3',
                'hero_run_right_4',
                'hero_run_right_5',
                'hero_run_right_6',
                'hero_run_right_7',
                'hero_run_right_8',
            ]
        },
    };

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
        if (!animation) {
            console.error(`Player: Ошибка! Анимация "${this.animationName}" не найдена`);
            return;
        }

        if (this.frameCounter === animation.framerate) {
            this.frameCounter = 0;
            this.frameNumber = (this.frameNumber + 1) % animation.frames.length;
        }

        var currentFrame = animation.frames[this.frameNumber];
        spriteManager.drawSprite(ctx, currentFrame, this.pos_x, this.pos_y);
        this.frameCounter++;
    }

    /**
     * Обновляет состояние игрока
     */
    update() {
        physicManager.update(this);

        if (this.move_x === 1) {
            this.animationName = 'hero_run_right';
            this.direction_y = 0;
            this.direction_x = 1;
        }
        else if (this.move_x === -1) {
            this.animationName = 'hero_run_left';
            this.direction_y = 0;
            this.direction_x = -1;
        }
        else if (this.move_y === 1) {
            this.animationName = 'hero_run_down';
            this.direction_x = 0;
            this.direction_y = 1;
        }
        else if (this.move_y === -1) {
            this.animationName = 'hero_run_up';
            this.direction_x = 0;
            this.direction_y = -1;
        }

        if (this.move_y === 0 && this.move_x === 0) {
            if (this.direction_x === 1) this.animationName = 'hero_idle_right';
            else if (this.direction_x === -1) this.animationName = 'hero_idle_left';
            else if (this.direction_y === 1) this.animationName = 'hero_idle_down';
            else if (this.direction_y === -1) this.animationName = 'hero_idle_up';
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
        console.log("Player: onTouchEntity", obj.name);
    }

    /**
     * Добавляет или убирает, если уже есть, блоки льда по направлению движения
     */
    fire() {
        // TODO: реализовать логику создания/удаления льда
        console.log("Player fire method called");
    }
}