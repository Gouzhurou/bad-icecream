import {
    DownStr,
    eventsManager,
    FireStr,
    LeftStr,
    RightStr,
    UpStr
} from "../managers/eventsManager.js";
import {mapManager} from "../managers/mapManager.js";
import {spriteManager} from "../managers/spriteManager.js";
import {infoManager} from "../managers/infoManager.js";
import {userManager} from "./userManager.js";

import {Player} from '../entities/Player.js';
import {GreenMonster} from "../entities/GreenMonster.js";
import {Money} from "../entities/Money.js";
import {Ice} from "../entities/Ice.js";

export const IceType = "Ice";
export const PlayerType = "Player";
export const GreenMonsterType = "GreenMonster";
export const MoneyType = "Money";

export var gameManager = {
    /** @type {Object<string, Entity>} - эталонные объекты, которые используются для
     * создания объектов, размещающихся на карте */
    factory: {},

    /** @type {Entity[]} - список сущностей на карте в текущий момент */
    entities: [],

    /** @type {Player} - объект, хранящий игрока */
    player: null,

    /** @type {boolean} - true, если игрок находится в процессе выстрела */
    hasFire: false,

    /** @type {CanvasRenderingContext2D} - Контекст canvas для отрисовки */
    ctx: null,

    /** @type {Entity[]} - список объектов, которых нужно удалить позже */
    laterKill: [],

    /** @type {number} - текущий уровень */
    levelNumber: 1,

    /** @type {number} - текущее количество уровней в игре */
    levelCount: 0,

    /** @type {number} - считает максимальный бонус, который можно получить на уровне */
    maxLevelBonus: 0,

    /** @type {number} - frames per second */
    FPS: 10,

    /** @type {boolean} - идентификатор начала уровня */
    isLevelStarting: true,

    /** @type {number} - количество секунд для отображения надписи уровня */
    levelDisplaySeconds: 2,

    /** @type {number} - количество кадров для отображения надписи уровня */
    levelDisplayFrames: 0,

    /** @type {number} - счетчик кадров отображения уровня */
    levelDisplayCounter: 0,

    /** @type {number} - количество объектов с типом Ice */
    iceCounter: 0,

    /** @type {number|null} - идентификатор интервала */
    intervalId: null,

    /** @type {boolean} - Показывает, включено ли меню */
    isMenuActive: true,

    /**
     * Добавляет сущность в игру
     * @param {string} type - тип сущности
     * @param {string} name - имя сущности
     * @param {number} x - X-координата сущности (в пикселях)
     * @param {number} y - Y-координата сущности (в пикселях)
     * @param {number} width - ширина сущности (в пикселях)
     * @param {number} height - высота сущности (в пикселях)
     */
    addEntityWithInfo(type, name, x, y, width, height) {
        if (!this.factory[type])
        {
            console.warn(`GameManager: Фабрика для типа "${type}" не найдена`);
            return;
        }
        let obj = new this.factory[type];
        obj.name = name;
        obj.pos_x = x;
        obj.pos_y = y;
        obj.size_x = width;
        obj.size_y = height;

        this.addEntityWithEntity(obj);

        if (type === PlayerType) {
            this.initPlayer(obj);
        }
    },

    /**
     * Добавляет сущность в игру
     * @param {Entity} entity - сущность
     */
    addEntityWithEntity(entity) {
        if (entity.name.includes(IceType)) {
            gameManager.iceCounter++;
        }
        if (entity.name.includes(MoneyType)) {
            gameManager.maxLevelBonus += entity.bonus;
        }

        this.entities.push(entity);
    },

    /**
     * Находит сущности, с которыми имеется столкновение
     * @param obj - объект
     * @param x - X-координата, определяющая местоположение объекта
     * @param y - Y-координата, определяющая местоположение объекта
     * @return {Array[Object]} - Массив объектов, с которыми имеется столкновение (не учитывая сам объект)
     */
    getEntitiesTouchingObject(obj, x, y) {
        let entities = this.getEntitiesAtXY(x, y, obj.size_x, obj.size_y);
        entities = entities.filter(entity =>
            entity.name !== obj.name
        );
        return entities;
    },

    /**
     * Находит сущностей, находящихся в блоке с координатами (x; y) и размерами (width; height)
     * @param {number} x - X-координата блока на карте (в пикселях)
     * @param {number} y - Y-координата блока на карте (в пикселях)
     * @param {number} width - ширина блока (в пикселях)
     * @param {number} height - высота блока (в пикселях)
     * @return {Array[Entity]} - массив сущностей, касающихся блока с координатами (x; y)
     */
    getEntitiesAtXY(x, y, width, height) {
        let entities = [];
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            if (
                entity.name.includes(MoneyType) && entity.isDead ||
                entity.pos_x + entity.size_x <= x ||
                entity.pos_y + entity.size_y <= y ||
                entity.pos_x >= x + width ||
                entity.pos_y >= y + height
            ) {
                continue;
            }
            entities.push(entity);
        }
        return entities;
    },

    /**
     * Получает все объекты с типом Ice в блоке с координатами (x: y) и размерами (width: height)
     * @param {number} x - X-координата блока (в пикселях)
     * @param {number} y - Y-координата блока (в пикселях)
     * @param {number} width - ширина блока (в пикселях)
     * @param {number} height - высота блока (в пикселях)
     * @return {Array[Entity]} - массив объектов Entity с типом Ice
     */
    getIceAtXY(x, y, width, height) {
        var ices = this.getEntitiesAtXY(x, y, width, height);
        ices = ices.filter(entity => entity.name.includes(IceType));
        return ices;
    },

    /**
     * Проверяет, имеют ли все сущности тип Money
     * @param entities - массив сущностей
     * @return {boolean} - true, если все сущности имеют тип Money
     */
    allAreMoney(entities) {
        return entities.every(entity => entity.name.includes(MoneyType));
    },

    /**
     * Инициализирует canvas элемент
     * @param {CanvasRenderingContext2D} ctx - контекст canvas для отрисовки
     */
    initContext(ctx) {
        console.log('GameManager: Инициализация контекста canvas');
        this.ctx = ctx;
    },

    /**
     * Инициализирует игрока
     * @param {Player} obj - объект игрока
     */
    initPlayer(obj) {
        console.log('GameManager: Инициализация игрока', obj);
        this.player = obj;
    },

    /**
     * Добавление объекта в кандидаты на удаление
     * @param {Entity} obj - объект для удаления
     */
    kill(obj) {
        this.laterKill.push(obj);
    },

    /**
     * Выполняет все необходимые действия для начала следующего уровня.
     */
    startNextLevel() {
        this.levelNumber++;
        this.isLevelStarting = true;
        this.clearLevel();
        mapManager.parseEntities();
    },

    /**
     * Полная очистка уровня со сбросом счетчиков
     */
    clearLevel() {
        this.player = null;
        this.hasFire = false;

        this.entities.forEach(entity => {
            if (entity.cleanup) {
                entity.cleanup();
            }
        });
        this.entities.length = 0;

        this.laterKill.length = 0;
        this.iceCounter = 0;
        this.maxLevelBonus = 0;
    },

    /**
     * Запускает повтор уровня
     */
    runLevel() {
        this.isMenuActive = false;
        this.isLevelStarting = true;
        this.clearLevel();
        mapManager.parseEntities();
    },

    /**
     * Обновление игры на каждом такте
     */
    update() {
        if (this.player === null) {
            console.warn('GameManager: Игрок не инициализирован, пропуск обновления');
            return;
        }

        if (this.player.points === this.maxLevelBonus) {
            userManager.updateLevelProgress(this.levelNumber, this.player.points);
            if (this.levelNumber === this.levelCount) {
                this.menu();
                return;
            }
            this.startNextLevel();
        }

        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action[UpStr])  {
            this.player.direction_y = -1;
            this.player.direction_x = 0;
            this.player.move_y = -1;
        }
        if (eventsManager.action[DownStr]) {
            this.player.direction_y = 1;
            this.player.direction_x = 0;
            this.player.move_y = 1;
        }
        if (eventsManager.action[LeftStr]) {
            this.player.direction_y = 0;
            this.player.direction_x = -1;
            this.player.move_x = -1;
        }
        if (eventsManager.action[RightStr]) {
            this.player.direction_y = 0;
            this.player.direction_x = 1;
            this.player.move_x = 1;
        }
        if (eventsManager.action[FireStr] && !this.hasFire) {
            this.hasFire = true;
            this.player.fire();
        }
        if (!eventsManager.action[FireStr] && this.hasFire) {
            this.hasFire = false;
        }

        // Обновление сущностей
        this.entities.forEach(entity => {
            try {
                entity.update();
            } catch (e) {
                console.error(`GameManager: Ошибка при обновлении сущности ${entity.name}:`, e);
            }
        });

        // Удаление сущностей
        if (this.laterKill.length > 0) {
            this.laterKill.forEach(entity => {
                const index = this.entities.indexOf(entity);
                if (index > -1) {
                    this.entities.splice(index, 1);
                } else {
                    console.warn('GameManager: Попытка удалить несуществующую сущность');
                }
            });
            this.laterKill.length = 0;
        }

        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        mapManager.draw(this.ctx);
        this.draw(this.ctx);
        infoManager.drawPoints(this.ctx, this.player.points);
        infoManager.drawButtons(this.ctx);
        if (this.isLevelStarting) {
            infoManager.drawLevel(this.ctx, this.levelNumber);
            this.levelDisplayCounter++;
            if (this.levelDisplayCounter === this.levelDisplayFrames) {
                this.levelDisplayCounter = 0;
                this.isLevelStarting = false;
            }
        }
    },

    /**
     * Отображение игры на каждом такте
     * @param {CanvasRenderingContext2D} ctx - Контекст canvas для отрисовки
     */
    draw(ctx) {
        for (let i = 0; i < this.entities.length; i++) {
            try {
                if (this.entities[i].name !== PlayerType) this.entities[i].draw(ctx);
            } catch (e) {
                console.error(`GameManager: Ошибка при отображении сущности ${i}:`, e);
            }
        }
        this.player.draw(ctx);
    },

    /**
     * Загрузка данных игры
     * @param {HTMLCanvasElement} canvas
     */
    loadAll(canvas) {
        console.log('GameManager: Начало загрузки всех ресурсов игры');

        // TODO: изменить содержимое файлов, один файл - один уровень
        // путь из index.html
        mapManager.loadMap("/assets/maps/map.tmj");
        spriteManager.loadAtlas(
            "/assets/images/atlas.json",
            "/assets/images/atlas.png"
        );

        gameManager.levelDisplayFrames = gameManager.FPS * gameManager.levelDisplaySeconds;

        gameManager.factory[PlayerType] = Player;
        gameManager.factory[GreenMonsterType] = GreenMonster;
        gameManager.factory[MoneyType] = Money;
        gameManager.factory[IceType] = Ice;

        mapManager.parseEntities();
        eventsManager.setup(canvas);
        infoManager.setup();
    },

    /**
     * Меню
     */
    menu() {
        this.isMenuActive = true;
        this.stopUpdates();
        infoManager.drawMenu(this.ctx);
    },

    /**
     * Пауза
     */
    pause() {
        if (this.intervalId) {
            this.stopUpdates();
            infoManager.drawPause(this.ctx);
        } else {
            this.runUpdates();
        }
    },

    /**
     * Завершает обновления игры
     */
    stopUpdates() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    },

    /**
     * Начинает обновления игры
     */
    runUpdates() {
        this.intervalId = setInterval(() => updateWorld(), 100);
    },

    /**
     * Запуск игры
     */
    play() {
        this.menu();
    },
};

function updateWorld() {
    gameManager.update();
}
