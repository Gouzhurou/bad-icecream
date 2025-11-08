import {spriteManager} from "./spriteManager.js";
import {mapManager} from "./mapManager.js";
import {LevelStr, MenuStr, PauseStr, RepeatStr} from "./eventsManager.js";
import {Entity} from "../entities/Entity.js";
import {gameManager} from "../core/gameManager.js";

const Padding = 16;
/** @type {string} - название спрайта для отображения сердца */
const HeartSpriteName = "heart";
/** @type {string} - название спрайта для отображения кнопки уровня */
const LevelButtonSpriteName = "button";
/** @type {string} - название спрайта для отображения кнопки заблокированного уровня */
const BlockLevelButtonSpriteName = "block_button";

/**
 * Объект, который отображает информацию об игре
 * @namespace
 */
export var infoManager = {
    /** @type {number} - максимальное отображаемое количество цифр */
    maxDigitCount: 6,
    /** @type {Entity[]} - кнопки в контексте canvas */
    buttons: [],
    /** @type {string[]} - имена кнопок в контексте canvas */
    buttonNames: [],
    /** @type {Entity[]} - кнопки уровней */
    levelButtons: [],
    /** @type {number} - количество кнопок в ширину видимой области */
    buttonCountWidth: 0,
    /** @type {number} - количество кнопок в высоту видимой области */
    buttonCountHeight: 0,
    /** @type {boolean} - Определяет, загружены ли все данные */
    dataLoaded: false,

    /**
     * настройка информации игры
     */
    setup() {
        if (!spriteManager.imgLoaded || !spriteManager.jsonLoaded) {
            setTimeout(function () { infoManager.setup(); }, 100);
        } else {
            this.createButtons();
            this.createLevelButtons();
            this.dataLoaded = true;
        }
    },

    /**
     * создание кнопок уровней
     */
    createLevelButtons() {
        let x = Padding;
        let y = Padding;

        const levelButtonSprite = spriteManager.getSprite(LevelButtonSpriteName);
        const blockLevelButtonSprite = spriteManager.getSprite(BlockLevelButtonSpriteName);

        this.buttonCountWidth = Math.floor((mapManager.view.w - Padding) / (levelButtonSprite.w + Padding));
        this.buttonCountHeight = Math.floor((mapManager.view.h - Padding) / (levelButtonSprite.h + Padding));

        for (let i = 0; i < gameManager.levelCount; i++) {
            let button = new Entity;
            button.name = LevelStr + (i + 1);
            // координаты в видимой области
            button.pos_x = x;
            button.pos_y = y;
            button.size_x = levelButtonSprite.w;
            button.size_y = levelButtonSprite.h;
            this.levelButtons.push(button);

            const newX = x + levelButtonSprite.w + Padding;
            const newY = y + levelButtonSprite.h + Padding;
            y = newX > mapManager.view.w ? newY : y;
            x = newX > mapManager.view.w ? 0 : newX;
        }

        let button = new Entity;
        button.name = BlockLevelButtonSpriteName;
        // координаты в видимой области
        button.pos_x = 0;
        button.pos_y = 0;
        button.size_x = blockLevelButtonSprite.w;
        button.size_y = blockLevelButtonSprite.h;
        this.levelButtons.push(button);
    },

    /**
     * создание кнопок игры
     */
    createButtons() {
        this.buttonNames = [MenuStr, PauseStr, RepeatStr];

        let x = mapManager.view.w - Padding;

        for (let i = 0; i < this.buttonNames.length; i++) {
            console.log(this.buttonNames[i]);
            const sprite = spriteManager.getSprite(this.buttonNames[i]);

            let button = new Entity;
            button.name = this.buttonNames[i];
            // координаты в видимой области
            button.pos_x = x - sprite.w;
            button.pos_y = Padding;
            button.size_x = sprite.w;
            button.size_y = sprite.h;
            this.buttons.push(button);

            x -= (button.size_x + Padding);
        }
    },

    /**
     * Отображает в контексте очки игрока
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     * @param {number} points - количество очков игрока
     */
    drawPoints(ctx, points) {
        let pointsStr = points.toString();

        if (pointsStr.length > this.maxDigitCount) {
            pointsStr = pointsStr.substring(0, this.maxDigitCount);
        }

        while (pointsStr.length < this.maxDigitCount) {
            pointsStr = '0' + pointsStr;
        }

        var x = mapManager.view.x + Padding;
        var y = mapManager.view.y + Padding;

        const sprite = spriteManager.getSprite(HeartSpriteName);
        spriteManager.drawSprite(ctx, HeartSpriteName, x, y);
        x += sprite.w;

        this.drawString(ctx, pointsStr, x, y);
    },

    /**
     * рисует по указанным координатам строку
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     * @param {string} string - строка
     * @param {number} x - X-координата строки на карте (в пикселях)
     * @param {number} y - Y-координата строки на карте (в пикселях)
     */
    drawString(ctx, string, x, y) {
        for (let i = 0; i < string.length; i++) {
            const digitName = string[i];

            if (digitName === ' ') {
                x += 32;
                continue;
            }

            const sprite = spriteManager.getSprite(digitName);
            if (sprite) {
                spriteManager.drawSprite(ctx, digitName, x, y);
                x += sprite.w;
            }
        }
    },

    /**
     * находит ширину строки
     * @param {string} string - строка
     * @return {Object} - ширина и высота строки
     */
    getStringSize(string) {
        let width = 0;
        let height = 64;
        for (let i = 0; i < string.length; i++) {
            if (string[i] === ' ') {
                width += 32;
                continue;
            }
            const sprite = spriteManager.getSprite(string[i]);
            width += sprite.w;
            if (sprite.h > height) {
                height = sprite.h;
            }
        }
        return {w: width, h: height};
    },

    /**
     * Отображает в контексте номер текущего уровня
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     * @param {number} levelNumber - номер уровня
     */
    drawLevel(ctx, levelNumber) {
        let levelStr = "LEVEL - " + levelNumber.toString();
        let stringSize = this.getStringSize(levelStr);

        const x = mapManager.view.x + mapManager.view.w / 2 - stringSize.w / 2;
        const y = mapManager.view.y + mapManager.view.h / 2 - stringSize.h / 2;

        this.drawString(ctx, levelStr, x, y);
    },

    /**
     * Отображает в контексте кнопки игры
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     */
    drawButtons(ctx) {
        for (let i = 0; i < this.buttons.length; i++) {
            spriteManager.drawSprite(
                ctx,
                this.buttonNames[i],
                mapManager.view.x + this.buttons[i].pos_x,
                mapManager.view.y + this.buttons[i].pos_y
            );
        }
    },

    /**
     * Отображает паузу
     * @param ctx
     */
    drawPause(ctx) {
        ctx.save();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.restore();
    },

    /**
     * Отображает меню
     * @param ctx
     */
    drawMenu(ctx) {
        if (!this.dataLoaded) {
            setTimeout(function () { infoManager.drawMenu(ctx); }, 100);
        } else {
            ctx.save();

            ctx.fillStyle = 'rgba(198, 186, 166)';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.restore();

            let block_button = this.levelButtons.find(button => button.name === BlockLevelButtonSpriteName);
            let levelCounter = 0;
            for (var i = 0; i < this.buttonCountHeight; i++) {
                for (var j = 0; j < this.buttonCountWidth; j++) {
                    levelCounter++;
                    if (levelCounter <= gameManager.levelCount) {
                        const levelNumber = levelCounter.toString();
                        let button = this.levelButtons.find(button => button.name === LevelStr + levelNumber);
                        spriteManager.drawSprite(ctx, LevelButtonSpriteName, mapManager.view.x + button.pos_x, mapManager.view.y + button.pos_y);

                        const stringSize = this.getStringSize(levelNumber);
                        const x = mapManager.view.x + button.pos_x + button.size_x / 2 - stringSize.w / 2;
                        const y = mapManager.view.y + button.pos_y + button.size_y / 2 - stringSize.h / 2;
                        this.drawString(ctx, levelNumber, x, y);
                    } else {
                        spriteManager.drawSprite(
                            ctx,
                            BlockLevelButtonSpriteName,
                            mapManager.view.x + Padding + j * (block_button.size_x + Padding),
                            mapManager.view.y + Padding + i * (block_button.size_y + Padding)
                        );
                    }
                }
            }
        }
    }
};