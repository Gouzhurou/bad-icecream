import {mapManager} from "./mapManager";

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

        var idx = mapManager.getTilesetIndex(
            newX + obj.size_x / 2,
            newY + obj.size_y / 2
        );
        var e = this.entityAtXY(obj, newX, newY);

        if (e !== null && obj.onTouchEntity) {
            obj.onTouchEntity(e);
        }
        // добавить проверку на наличие препятствия
        if (obj.onTouchMap) {
            obj.onTouchMap(idx);
        }

        // добавить проверку на отсутствие препятствий
        if (e === null) {
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