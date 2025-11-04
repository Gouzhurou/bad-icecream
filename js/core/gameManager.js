import {eventsManager} from "../managers/eventsManager.js";
import {mapManager} from "../managers/mapManager.js";
import {spriteManager} from "../managers/spriteManager.js";
import {Player} from '../entities/Player.js';
import {GreenMonster} from "../entities/GreenMonster.js";
import {Money} from "../entities/Money.js";

export var gameManager = {
    /** @type {Object<string, Entity>} - эталонные объекты, которые используются для
     * создания объектов, размещающихся на карте */
    factory: {},

    /** @type {Entity[]} - список сущностей на карте в текущий момент */
    entities: [],

    /** @type {Player} - объект, хранящий игрока */
    player: null,

    /** @type {CanvasRenderingContext2D} - Контекст canvas для отрисовки */
    ctx: null,

    /** @type {Entity[]} - список объектов, которых нужно удалить позже */
    laterKill: [],

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
        console.log(`GameManager: Добавление объекта в очередь на удаление: ${obj.name || 'Unknown'}`);
        this.laterKill.push(obj);
    },

    /**
     * Обновление игры на каждом такте
     */
    update() {
        if (this.player === null) {
            console.warn('GameManager: Игрок не инициализирован, пропуск обновления');
            return;
        }

        // Логирование управления
        const prevMoveX = this.player.move_x;
        const prevMoveY = this.player.move_y;

        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action["up"]) this.player.move_y = -1;
        if (eventsManager.action["down"]) this.player.move_y = 1;
        if (eventsManager.action["left"]) this.player.move_x = -1;
        if (eventsManager.action["right"]) this.player.move_x = 1;
        if (eventsManager.action["fire"]) this.player.fire();

        if (this.player.move_x !== prevMoveX || this.player.move_y !== prevMoveY) {
            console.log(`GameManager: Движение игрока - X: ${this.player.move_x}, Y: ${this.player.move_y}`);
        }

        // Обновление сущностей
        console.log(`GameManager: Обновление ${this.entities.length} сущностей`);
        this.entities.forEach(entity => {
            try {
                entity.update();
            } catch (e) {
                console.error(`GameManager: Ошибка при обновлении сущности ${entity.name}:`, e);
            }
        });

        // Удаление сущностей
        if (this.laterKill.length > 0) {
            console.log(`GameManager: Удаление ${this.laterKill.length} сущностей`);
            this.laterKill.forEach(entity => {
                var index = this.entities.indexOf(entity);
                if (index > -1) {
                    console.log(`GameManager: Удаление сущности ${entity.name || 'Unknown'} с индексом ${index}`);
                    this.entities.splice(index, 1);
                } else {
                    console.warn('GameManager: Попытка удалить несуществующую сущность');
                }
            });
            this.laterKill.length = 0;
        }

        // Отрисовка
        console.log('GameManager: Отрисовка карты и сущностей');
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        mapManager.draw(this.ctx);
        this.draw(this.ctx);
    },

    /**
     * Отображение игры на каждом такте
     * @param {CanvasRenderingContext2D} ctx - Контекст canvas для отрисовки
     */
    draw(ctx) {
        console.log(`GameManager: Отрисовка ${this.entities.length} сущностей`);
        for (var i = 0; i < this.entities.length; i++) {
            try {
                if (this.entities[i].name !== "Player") this.entities[i].draw(ctx);
            } catch (e) {
                console.error(`GameManager: Ошибка при отрисовке сущности ${i}:`, e);
            }
        }
        this.player.draw(ctx);
    },

    /**
     * Загрузка данных игры
     */
    loadAll() {
        console.log('GameManager: Начало загрузки всех ресурсов игры');

        mapManager.loadMap("./js/map.tmj");
        spriteManager.loadAtlas(
            "./assets/images/atlas.json",
            "./assets/images/atlas.png"
        );

        console.log('GameManager: Регистрация фабрик объектов');
        gameManager.factory["Player"] = Player;
        gameManager.factory["GreenMonster"] = GreenMonster;
        gameManager.factory["Money"] = Money;

        console.log('GameManager: Парсинг entities с карты');
        mapManager.parseEntities();

        console.log('GameManager: Первоначальная отрисовка карты');
        mapManager.draw(this.ctx);

        console.log('GameManager: Настройка менеджера событий');
        eventsManager.setup();

        console.log('GameManager: Все ресурсы загружены');
    },

    /**
     * Запуск игры
     */
    play() {
        setInterval(updateWorld, 100);
    },
};

function updateWorld() {
    gameManager.update();
}
