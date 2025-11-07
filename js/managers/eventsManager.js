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
export const MouseClickStr = 'mouseClick';

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
        eventsManager.mouseX = event.clientX - rect.left;
        eventsManager.mouseY = event.clientY - rect.top;

        eventsManager.action[MouseClickStr] = true;
    },

    /**
     * Обработчик отпускания мыши
     * @param {MouseEvent} event
     */
    onMouseUp(event) {
        eventsManager.mouseDown = false;
        eventsManager.action[MouseClickStr] = false;
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