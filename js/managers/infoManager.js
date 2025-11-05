import {spriteManager} from "./spriteManager.js";
import {mapManager} from "./mapManager.js";

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
        console.log("infoManager: draw points");
        let pointsStr = points.toString();

        if (pointsStr.length > this.maxDigitCount) {
            pointsStr = pointsStr.substring(0, this.maxDigitCount);
        }

        while (pointsStr.length < this.maxDigitCount) {
            pointsStr = '0' + pointsStr;
        }

        var x = mapManager.view.x;
        var y = mapManager.view.y;

        const sprite = spriteManager.getSprite(this.heartSpriteName);
        spriteManager.drawSprite(ctx, this.heartSpriteName, x, y);
        x += sprite.w;

        for (let i = 0; i < pointsStr.length; i++) {
            const digitName = pointsStr[i];

            const sprite = spriteManager.getSprite(digitName);
            if (sprite) {
                spriteManager.drawSprite(ctx, digitName, x, y);
                x += sprite.w;
            }
        }
    }
};