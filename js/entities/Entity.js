/**
 * Объект для представления сущности
 * @namespace
 */
export var Entity = {
    /** @type {number} - X-координата сущности (в пикселях) */
    pos_x: 0,
    /** @type {number} - Y-координата сущности (в пикселях) */
    pos_y: 0,
    /** @type {number} - ширина сущности (в пикселях) */
    size_x: 0,
    /** @type {number} - высота сущности (в пикселях) */
    size_y: 0,
    /** @type {string} - имя сущности */
    name: "",

    /**
     * Расширение свойств Entity
     * @param extendProperties - дополнительные свойства
     * @return {Entity}
     */
    extend: function (extendProperties) {
        var object = Object.create(this);
        for (var property in extendProperties) {
            if (extendProperties.hasOwnProperty(property) &&
                typeof object[property] === 'undefined') {
                object[property] = extendProperties[property];
            }
        }
        return object;
    }
}

