import {infoManager} from "./infoManager.js";
import {gameManager} from "../core/gameManager.js";

const WKeyBoardCode = 87;
const DKeyBoardCode = 65;
const SKeyBoardCode = 83;
const AKeyBoardCode = 68;
const SpaceKeyBoardCode = 32;

export const UpStr = 'up';
export const DownStr = 'down';
export const LeftStr = 'left';
export const RightStr = 'right';
export const FireStr = 'fire';
export const PauseStr = 'pause';
export const RepeatStr = 'repeat';
export const MenuStr = 'menu';
export const LevelStr = 'level';

/**
 * Объект для управления событиями
 * @namespace
 */
export var eventsManager = {
    /** @type {Object<number, string>} Сопоставление кодов клавиш с действиями */
    bind: [],

    /** @type {Object<string, boolean>} Состояние действий (активно/неактивно) */
    action: [],

    /** @type {boolean} Факт нажатия мыши */
    mouseDown: false,

    /** @type {number} X-координата нажатия мыши */
    mouseX: 0,

    /** @type {number} Y-координата нажатия мыши */
    mouseY: 0,

    /** @type {number} X-координата отпускания мыши */
    mouseUpX: 0,

    /** @type {number} Y-координата отпускания мыши */
    mouseUpY: 0,

    /** @type {HTMLCanvasElement} Canvas элемент */
    canvas: null,

    /**
     * Настраивает менеджер событий
     * @param {HTMLCanvasElement} canvas
     */
    setup(canvas) {
        this.canvas = canvas;

        this.bind[WKeyBoardCode] = UpStr;
        this.bind[DKeyBoardCode] = LeftStr;
        this.bind[SKeyBoardCode] = DownStr;
        this.bind[AKeyBoardCode] = RightStr;
        this.bind[SpaceKeyBoardCode] = FireStr;

        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);

        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
    },

    /**
     * Обработчик нажатия мыши
     * @param {MouseEvent} event
     */
    onMouseDown(event) {
        eventsManager.mouseDown = true;
        const rect = eventsManager.canvas.getBoundingClientRect();
        // координаты в видимой области
        eventsManager.mouseX = event.clientX - rect.left;
        eventsManager.mouseY = event.clientY - rect.top;

        if (!gameManager.isMenuActive) {
            for (let i = 0; i < infoManager.buttons.length; i++) {
                const button = infoManager.buttons[i];
                if (eventsManager.isButtonActive(button)) {
                    if (button.name === PauseStr) {
                        gameManager.pause();
                    }
                    else if (button.name === RepeatStr) {
                        gameManager.runLevel();
                    }
                    else if (button.name === MenuStr) {
                        gameManager.menu();
                    }
                }
            }
        } else {
            for (let i = 0; i < infoManager.levelButtons.length; i++) {
                const button = infoManager.levelButtons[i];
                if (eventsManager.isButtonActive(button)) {
                    if (button.name.startsWith(LevelStr)) {
                        const levelNumber = parseInt(button.name.replace(LevelStr, ""));
                        if (!isNaN(levelNumber)) {
                            gameManager.levelNumber = levelNumber;
                            gameManager.runLevel();
                            gameManager.runUpdates();
                        } else {
                            console.warn(`Некорректный номер уровня в кнопке: ${button.name}`);
                        }
                    }
                }
            }
        }
    },

    /**
     * Определяет, активна ли кнопка
     * @param {Entity} button - кнопка
     * @return {boolean}
     */
    isButtonActive(button) {
        return eventsManager.mouseX >= button.pos_x &&
            eventsManager.mouseX <= button.pos_x + button.size_x &&
            eventsManager.mouseY >= button.pos_y &&
            eventsManager.mouseY <= button.pos_y + button.size_y;
    },

    /**
     * Обработчик отпускания мыши
     */
    onMouseUp() {
        eventsManager.mouseDown = false;
    },

    /**
     * Получает координаты мыши относительно canvas
     * @returns {{x: number, y: number}}
     */
    getMousePos() {
        return {
            x: this.mouseX,
            y: this.mouseY
        };
    },

    /**
     * Обработчик нажатия клавиши
     * @param {KeyboardEvent} event - Событие клавиатуры
     */
    onKeyDown(event) {
        var action = eventsManager.bind[event.keyCode];
        if (action) {
            eventsManager.action[action] = true;
        }
    },

    /**
     * Обработчик отпускания клавиши
     * @param {KeyboardEvent} event - Событие клавиатуры
     */
    onKeyUp(event) {
        var action = eventsManager.bind[event.keyCode];
        if (action) {
            eventsManager.action[action] = false;
        }
    }
};