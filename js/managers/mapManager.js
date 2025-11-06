import {gameManager} from "../core/gameManager.js";

const tileLayerType = "tilelayer";
const objectLayerType = "objectgroup";

/**
 * @typedef {Object} Tileset
 * @property {number} firstgid - Первый GID тайлсета
 * @property {HTMLImageElement} image - Изображение тайлсета
 * @property {string} name - Название тайлсета
 * @property {number} xCount - Ширина в тайлах
 * @property {number} yCount - Высота в тайлах
 */

/**
 * @typedef {Object} TileLayer
 * @property {string} name - имя слоя
 * @property {number[]} data - массив индексов тайлов
 * @property {number} height - высота в тайлах
 * @property {number} width - ширина в тайлах
 * @property {number} id - идентификатор
 * @property {boolean} visible - видимость слоя
 * @property {string} type - тип слоя. Может быть "tilelayer" или "objectgroup"
 */

/**
 * Объект для управления картой игры
 * @namespace
 */
export var mapManager = {
    mapData: null,
    /** @type {TileLayer[]} */
    tLayer: [],
    tLayerCount: 0,
    /** @type {TileLayer} */
    wallsLayer: {},
    /** @type {number[]} - массив индексов стен */
    wallsIndices: [],
    /** @type {number} - размер карты по ширине (в тайлах) */
    xCount: 0,
    /** @type {number} - размер карты по высоте (в тайлах) */
    yCount: 0,
    /** @type {Object} - размер тайла (в пикселях) */
    tSize: {x: 64, y: 64},
    /** @type {Object} - размер карты (в пикселях) */
    mapSize: {x: 64, y: 64},
    /** @type {Tileset[]} */
    tilesets: [],
    imgLoadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,
    view: {
        x: 0, y: 0,
        w: document.getElementById("gameCanvas").width,
        h: document.getElementById("gameCanvas").height},

    /**
     * Загружает JSON карты с сервера
     * @param {string} path - Путь к JSON файлу карты
     */
    loadMap(path) {
        var request = new XMLHttpRequest();

        request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    mapManager.parseMap(this.responseText);
                } else {
                    console.error('MapManager: Ошибка загрузки:', this.status, this.statusText);
                }
            }
        };

        request.onerror = function () {
            console.error('MapManager: Сетевая ошибка');
        };

        request.open("GET", path, true);
        request.send();
    },

    /**
     * Парсит JSON данные карты и инициализирует менеджер карты
     * @param {string} tilesJSON - JSON строка с данными карты в формате Tiled
     */
    parseMap(tilesJSON) {
        try {
            this.mapData = JSON.parse(tilesJSON);
        } catch (e) {
            console.error('MapManager: Ошибка парсинга JSON:', e);
            return;
        }

        let tileLayerCount = 0;

        for (var i = 0; i < this.mapData.layers.length; i++) {
            var layer = this.mapData.layers[i];
            if (layer.type === tileLayerType) {
                this.tLayer[this.tLayerCount++] = layer;
                tileLayerCount++;
                if (layer.name === "walls") {
                    this.wallsLayer = layer;
                    this.wallsIndices = [...new Set(this.wallsLayer.data)].filter(i => i !== 0);
                }
            }
        }

        // Установка размеров
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var tileset = this.mapData.tilesets[i];

            var img = new Image();
            img.onload = function () {
                mapManager.imgLoadCount++;

                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;
                }
            };

            img.onerror = function () {
                console.error('MapManager: Ошибка загрузки изображения тайлсета');
                mapManager.imgLoadCount++;
                // Продолжаем даже при ошибке загрузки изображения
                if (mapManager.imgLoadCount === mapManager.mapData.tilesets.length) {
                    mapManager.imgLoaded = true;
                }
            };

            img.src = tileset.image;

            var t = this.mapData.tilesets[i];
            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x), // в тайлах
                yCount: Math.floor(t.imageheight / this.tSize.y), // в тайлах
            };
            this.tilesets.push(ts);
        }

        this.jsonLoaded = true;
    },

    /**
     * Парсит JSON данные сущностей и инициализирует сущностей менеджера игры, в том числе игрока
     */
    parseEntities() {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            console.log('MapManager: Ресурсы еще не загружены, повторная попытка через 100мс');
            setTimeout(function () { mapManager.parseEntities(); }, 100);
        } else {
            for (var i = 0; i < this.mapData.layers.length; i++) {
                var layer = this.mapData.layers[i];
                if (
                    layer.type === objectLayerType &&
                    (layer.name === "ice" || layer.name === "level" + gameManager.level)
                ) {
                    var entities = layer.objects;
                    for (var j = 0; j < entities.length; j++) {
                        var entity = entities[j];
                        try {
                            gameManager.addEntityWithInfo(
                                entity.type,
                                entity.name,
                                entity.x,
                                entity.y,
                                entity.width,
                                entity.height,
                            );
                        } catch (e) {
                            console.error(`MapManager: Ошибка при создании сущности [${entity.gid}] ${entity.type}:`, e);
                        }
                    }
                }
            }
        }
    },

    //TODO: добавить отдельно отрисовку слоя background и остальных

    /**
     * Отрисовывает карту на canvas контексте
     * @param {CanvasRenderingContext2D} ctx - Контекст canvas для отрисовки
     */
    draw(ctx) {
        if (!mapManager.imgLoaded || !mapManager.jsonLoaded) {
            setTimeout(function () { mapManager.draw(ctx); }, 100);
        } else {
            for (var k = 0; k < this.tLayer.length; k++) {
                var layer = this.tLayer[k];
                for (var i = 0; i < layer.data.length; i++) {
                    if (layer.data[i] !== 0) {
                        var tile = this.getTile(layer.data[i]);
                        // координаты тайла на карте
                        var pX = (i % this.xCount) * this.tSize.x;
                        var pY = Math.floor(i / this.xCount) * this.tSize.y;
                        if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
                            continue;
                        }
                        // координаты тайла в видимой зоне
                        pX -= this.view.x;
                        pY -= this.view.y;

                        ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y,
                            pX, pY, this.tSize.x, this.tSize.y);
                    }
                }
            }
        }
    },

    /**
     * Возвращает true, если объект находится в видимой зоне, иначе false
     * @param {number} x - X-координата объекта на карте (в пикселях)
     * @param {number} y - Y-координата объекта на карте (в пикселях)
     * @param {number} width - ширина объекта (в пикселях)
     * @param {number} height - ширина объекта (в пикселях)
     * @return {boolean} Видимость объекта
     */
    isVisible(x, y, width, height) {
        return !(
            x + width < this.view.x || // объект левее видимой области
            y + height < this.view.y || // объект выше видимой области
            x > this.view.x + this.view.w || // объект правее видимой области
            y > this.view.y + this.view.h // объект ниже видимой области
        );

    },

    /**
     * @typedef {Object} TileInfo
     * @property {HTMLImageElement} img - Изображение тайлсета
     * @property {number} px - X-координата тайла в изображении (в пикселях)
     * @property {number} py - Y-координата тайла в изображении (в пикселях)
     */

    /**
     * Возвращает информацию о тайле по его индексу
     * @param {number} tileIndex - Индекс тайла на карте
     * @returns {TileInfo} Объект с информацией о тайле
     */
    getTile(tileIndex) {
        var tile = {
            img: null,
            px: 0,
            py: 0,
        };
        var tileset = this.getTileset(tileIndex);
        if (!tileset) return tile;

        tile.img = tileset.image;
        // индекс тайла в изображении
        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x; // в пикселях
        tile.py = y * this.tSize.y; // в пикселях
        return tile;
    },

    /**
     * Возвращает информацию о тайлсете по индексу тайла
     * @param {number} tileIndex - Индекс тайла на карте
     * @returns {Tileset|null} Объект с информацией о тайлсете
     */
    getTileset(tileIndex) {
        for (var i = mapManager.tilesets.length - 1; i >= 0; i--) {
            if (mapManager.tilesets[i].firstgid <= tileIndex) {
                return mapManager.tilesets[i];
            }
        }
        return null;
    },

    /**
     * Находит индекс тайла по его координатам на карте
     * @param {number} x - X-координата тайла на карте (в пикселях)
     * @param {number} y - Y-координата тайла на карте (в пикселях)
     * @return {number} индекс тайла
     */
    getTilesetWallIndex(x, y) {
        var tile_x = Math.floor(x / this.tSize.x);
        var tile_y = Math.floor(y / this.tSize.y);
        const index = tile_y * this.xCount + tile_x;
        return this.wallsLayer.data[index];
    },

    /**
     * Определяет, если тайл является стеной
     * @param {number} x - X-координата тайла на карте (в пикселях)
     * @param {number} y - Y-координата тайла на карте (в пикселях)
     * @return {boolean} true, если тайл является стеной, false иначе
     */
    isTileWall(x, y) {
        var index = this.getTilesetWallIndex(x, y);
        return this.wallsIndices.includes(index);
    },

    /**
     * Центрирует видимую область относительно передвижений игрока
     * @param x - X-координата игрока на карте в пикселях
     * @param y - Y-координата игрока на карте в пикселях
     */
    centerAt(x, y) {
        if (x < this.view.w / 2)
            this.view.x = 0;
        else if (x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - this.view.w / 2;

        if (y < this.view.h / 2)
            this.view.y = 0;
        else if (y > this.mapSize.y - this.view.h / 2)
            this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - this.view.h / 2;
    },
};
