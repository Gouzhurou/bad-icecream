/**
 * @typedef {Object} Sprite
 * @property {string} name - Название спрайта
 * @property {number} x - X-координата спрайта в изображении (в пикселях)
 * @property {number} y - Y-координата спрайта в изображении (в пикселях)
 * @property {number} w - Ширина спрайта (в пикселях)
 * @property {number} h - Высота спрайта (в пикселях)
 */

/**
 * Объект для управления спрайтами
 * @namespace
 */
export var spriteManager = {
    /** @type {HTMLImageElement} Изображение спрайт-листа */
    image: new Image(),
    /** @type {Sprite[]} Массив спрайтов */
    sprites: [],
    /** @type {boolean} Флаг загрузки изображения */
    imgLoaded: false,
    /** @type {boolean} Флаг загрузки JSON данных */
    jsonLoaded: false,

    /**
     * Загружает JSON атласа с сервера
     * @param {string} atlasPath - Путь к JSON атласу
     * @param {string} imgPath - Путь к изображению
     */
    loadAtlas(atlasPath, imgPath) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                spriteManager.parseAtlas(request.responseText);
            }
        }
        request.open("GET", atlasPath, true);
        request.send();
        this.loadImg(imgPath);
    },

    /**
     * Парсит JSON данные атласа и инициализирует спрайты
     * @param {string} atlasJSON - JSON строка с данными атласа в формате TexturePacker
     */
    parseAtlas(atlasJSON) {
        var atlas = JSON.parse(atlasJSON);
        for (var name in atlas.frames) {
            var frame = atlas.frames[name].frameNumber;
            /** @type {Sprite} */
            var sprite = {
                name: name,
                x: frame.x,
                y: frame.y,
                w: frame.w,
                h: frame.h,
            };
            this.sprites.push(sprite);
        }
        this.jsonLoaded = true;
    },

    /**
     * Загружает изображение спрайт-листа
     * @param {string} path - Путь к изображению
     */
    loadImg(path) {
        this.image.onload = function () {
            spriteManager.imgLoaded = true;
        }
        this.image.src = path;
    },

    /**
     * Отображение спрайта
     * @param {CanvasRenderingContext2D} ctx - Контекст canvas для отрисовки
     * @param {string} name - имя спрайта для отображения
     * @param {number} x - X-координата на карте для отображения спрайта (в пикселях)
     * @param {number} y - Y-координата на карте для отображения спрайта (в пикселях)
     */
    drawSprite(ctx, name, x, y) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () { spriteManager.drawSprite(ctx, name, x, y); }, 100);
        } else {
            /** @type {Sprite} */
            var sprite = this.getSprite(name);
            if(!mapManager.isVisible(x, y, sprite.w, sprite.h)) {
                return;
            }
            // получение координат в видимой области
            x -= mapManager.view.x;
            y -= mapManager.view.y;
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        }
    },

    /**
     * Получает спрайт по имени
     * @param {string} name - имя спрайта
     * @return {Sprite|null}
     */
    getSprite(name) {
        return this.sprites.find(sprite => sprite.name === name) || null;
    },
};
