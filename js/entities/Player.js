import { Entity } from "./Entity";
import { spriteManager } from "../managers/spriteManager";
import {physicManager} from "../managers/physicManager";

export var Player = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 1,
    bonus: 0,

    /** @type {string} - имя текущей анимации */
    animationName: 'hero_idle_down',

    /** @type {number} - номер текущего фрейма в анимации */
    frameNumber: 0,

    /** @type {number} - счетчик для определения скорости смены фреймов */
    frameCounter: 0,

    animations: {
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
            framerate: 8,
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
            framerate: 8,
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
            framerate: 8,
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
            framerate: 8,
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
            framerate: 8,
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
            framerate: 8,
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
            framerate: 8,
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
            framerate: 8,
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
    },

    draw: function(ctx) {
        var animation = this.animations[this.animationName];
        if (this.frameCounter === animation.framerate) {
            this.frameCounter = 0;
            this.frame = (++this.frame) % animation.frames.length;
        }

        spriteManager.drawSprite(ctx, this.animation.frames[this.frameNumber], this.pos_x, this.pos_y);
        this.frameCounter++;
    },

    update: function() {
        physicManager.update(this);
        if (this.move_x === 0 && this.move_y === 0) {
            if (this.animationName.includes('right')) this.animationName = 'hero_idle_right';
            if (this.animationName.includes('left')) this.animationName = 'hero_idle_left';
            if (this.animationName.includes('down')) this.animationName = 'hero_idle_down';
            if (this.animationName.includes('up')) this.animationName = 'hero_idle_up';
        }
        else if (this.move_x === 1) this.animationName = 'hero_run_right';
        else if (this.move_x === -1) this.animationName = 'hero_run_left';
        else if (this.move_y === 1) this.animationName = 'hero_run_down';
        else if (this.move_y === -1) this.animationName = 'hero_run_up';
    },

    kill: function() {
        console.log("You are dead");
    },

    onTouchEntity: function(obj) {
        console.log("onTouchEntity", obj.name);
    },

    /**
     * Добавляет или убирает, если уже есть, блоки льда по направлению движения
     */
    fire: function() {

    },
});