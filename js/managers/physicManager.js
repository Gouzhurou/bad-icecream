import {mapManager} from "./mapManager.js";
import {gameManager} from "../core/gameManager.js";

const WallsIndices = [1, 3, 4, 5, 6, 10, 12, 13, 14];

/**
 * Объект для определения физики перемещений объектов
 * @namespace
 */
export var physicManager = {
    /**
     * Обновляет координаты объекта
     * @param obj - объект
     * @return {string} - статус передвижения ("stop" - остановка, "break" - препятствие, "move" - движение)
     */
    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0) {
            return "stop";
        }

        var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);

        console.log(`Old coordinates: ${obj.pos_x}: ${obj.pos_y}`);
        console.log(`New coordinates: ${newX}: ${newY}`);

        var entity = this.entityAtXY(obj, newX, newY);
        if (entity !== null && obj.onTouchEntity) {
            obj.onTouchEntity(entity);
        }

        var index = mapManager.getTilesetIndex(
            newX + obj.size_x / 2,
            newY + obj.size_y / 2
        );
        var isWall = WallsIndices.includes(index);
        if (isWall && obj.onTouchMap) {
            obj.onTouchMap(index);
        }

        if (!isWall) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return "break";
        }

        return "move";
    },

    /**
     * Определяет столкновение с объектом по заданным координатам
     * @param obj - объект
     * @param x - X-координата, определяющая местоположение объекта
     * @param y - Y-координата, определяющая местоположение объекта
     * @return {*|null} - Объект, с которым имеется столкновение, если оно есть
     */
    entityAtXY(obj, x, y) {
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i];
            if (e.name !== obj.name) {
                // переписать эту хуйню
                if (
                    x + obj.size_x < e.pos_x ||
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y
                ) {
                    continue;
                }
                return e;
            }
        }
        return null;
    },
};