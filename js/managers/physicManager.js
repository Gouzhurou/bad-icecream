import {mapManager} from "./mapManager.js";
import {gameManager} from "../core/gameManager.js";

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

        var entities = gameManager.getEntitiesTouchingObject(obj, newX, newY);
        const allAreMoney = gameManager.allAreMoney(entities);
        if (entities.length !== 0 && obj.onTouchEntity) {
            for (var i = 0; i < entities.length; i++) {
                obj.onTouchEntity(entities[i]);
            }
        }

        var isWall = mapManager.isTileWall(
            newX + obj.size_x / 2,
            newY + obj.size_y / 2
        );
        if (isWall && obj.onTouchMap) {
            obj.onTouchMap();
        }

        if (isWall || (entities.length !== 0 && !allAreMoney)) {
            return "break";
        }

        obj.pos_x = newX;
        obj.pos_y = newY;
        return "move";
    },
};