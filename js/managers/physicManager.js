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

        var entities = this.entitiesAtXY(obj, newX, newY);
        const allAreMoney = entities.every(entity => entity.name.includes("Money"));
        if (entities.length !== 0 && obj.onTouchEntity) {
            for (var i = 0; i < entities.length; i++) {
                obj.onTouchEntity(entities[i]);
            }
        }

        var index = mapManager.getTilesetIndex(
            newX + obj.size_x / 2,
            newY + obj.size_y / 2
        );
        var isWall = mapManager.wallsIndices.includes(index);
        if (isWall && obj.onTouchMap) {
            obj.onTouchMap(index);
        }

        if (isWall || (entities.length !== 0 && !allAreMoney)) {
            return "break";
        }

        obj.pos_x = newX;
        obj.pos_y = newY;
        return "move";
    },

    /**
     * Определяет столкновение с объектом по заданным координатам
     * @param obj - объект
     * @param x - X-координата, определяющая местоположение объекта
     * @param y - Y-координата, определяющая местоположение объекта
     * @return {*|null} - Объект, с которым имеется столкновение, если оно есть
     */
    entitiesAtXY(obj, x, y) {
        var entities = [];
        for (var i = 0; i < gameManager.entities.length; i++) {
            var entity = gameManager.entities[i];
            if (entity.name !== obj.name &&
                !(entity.name.includes("Money") && entity.isDead)
            ) {
                if (
                    x + obj.size_x <= entity.pos_x ||
                    y + obj.size_y <= entity.pos_y ||
                    x >= entity.pos_x + entity.size_x ||
                    y >= entity.pos_y + entity.size_y
                ) {
                    continue;
                }
                entities.push(entity);
            }
        }
        return entities;
    },
};