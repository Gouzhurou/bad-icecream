import {spriteManager} from "./spriteManager.js";
import {mapManager} from "./mapManager.js";

const Padding = 16;

/**
 * Объект, который отображает информацию об игре
 * @namespace
 */
export var infoManager = {
    /** @type {number} - максимальное отображаемое количество цифр */
    maxDigitCount: 6,
    /** @type {string} - название спрайта для отображения сердца */
    heartSpriteName: "heart",

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

        const sprite = spriteManager.getSprite(this.heartSpriteName);
        spriteManager.drawSprite(ctx, this.heartSpriteName, x, y);
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

            const sprite = spriteManager.getSprite(digitName);
            if (sprite) {
                spriteManager.drawSprite(ctx, digitName, x, y);
                x += sprite.w;
            }
        }
    },

    /**
     * Отображает в контексте номер текущего уровня
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     * @param {number} levelNumber - номер уровня
     */
    drawLevel(ctx, levelNumber) {
        let levelStr = "LEVEL - " + levelNumber.toString();
        let strWidth = 0;
        let strHeight = 64;
        for (let i = 0; i < levelStr.length; i++) {
            if (levelStr[i] === ' ') {
                strWidth += 32;
                continue;
            }
            const sprite = spriteManager.getSprite(levelStr[i]);
            strWidth += sprite.w;
        }

        const x = mapManager.view.x + mapManager.view.w / 2 - strWidth / 2;
        const y = mapManager.view.y + mapManager.view.h / 2 - strHeight / 2;

        this.drawString(ctx, levelStr, x, y);
    },


};