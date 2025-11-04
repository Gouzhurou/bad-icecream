const WKeyBoardCode = 87;
const DKeyBoardCode = 65;
const SKeyBoardCode = 83;
const AKeyBoardCode = 68;
const SpaceKeyBoardCode = 32;

/**
 * Объект для управления событиями
 * @namespace
 */
export var eventsManager = {
    /** @type {Object<number, string>} Сопоставление кодов клавиш с действиями */
    bind: [],

    /** @type {Object<string, boolean>} Состояние действий (активно/неактивно) */
    action: [],

    /**
     * Настраивает менеджер событий
     */
    setup() {
        this.bind[WKeyBoardCode] = 'up';
        this.bind[DKeyBoardCode] = 'left';
        this.bind[SKeyBoardCode] = 'down';
        this.bind[AKeyBoardCode] = 'right';
        this.bind[SpaceKeyBoardCode] = 'fire';

        document.body.addEventListener('keydown', this.onKeyDown);
        document.body.addEventListener('keyup', this.onKeyUp);
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