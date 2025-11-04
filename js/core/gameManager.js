import {eventsManager} from "../managers/eventsManager";
import {mapManager} from "../managers/mapManager";
import {spriteManager} from "../managers/spriteManager";
import {Player} from '../entities/Player';
import {GreenMonster} from "../entities/GreenMonster";
import {Money} from "../entities/Money";

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
        this.ctx = ctx;
    },

    /**
     * Инициализирует игрока
     * @param {Player} obj - объект игрока
     */
    initPlayer(obj) {
        this.player = obj;
    },

    /**
     * Добавление объекта в кандидаты на удаление
     * @param obj
     */
    kill(obj) {
        this.laterKill.push(obj);
    },

    /**
     * Обновление игры на каждом такте
     */
    update() {
        if (this.player === null) {
            return;
        }

        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventsManager.action["up"]) this.player.move_y = -1;
        if (eventsManager.action["down"]) this.player.move_y = 1;
        if (eventsManager.action["left"]) this.player.move_x = -1;
        if (eventsManager.action["right"]) this.player.move_x = 1;
        if (eventsManager.action["fire"]) this.player.fire();

        this.entities.forEach((entity) => {
            try {
                entity.update();
            } catch (e) {}
        });

        this.laterKill.forEach(entity => {
            var index = this.entities.indexOf(entity);
            if (index > -1) {
                this.entities.splice(index, 1);
            }
        });
        this.laterKill.length = 0;

        mapManager.draw(this.ctx);
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(this.ctx);
    },

    /**
     * Отображение игры на каждом такте
     * @param {CanvasRenderingContext2D} ctx - Контекст canvas для отрисовки
     */
    draw(ctx) {
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(ctx);
        }
    },

    /**
     * Загрузка данных игры
     */
    loadAll() {
        mapManager.loadMap("../map.tmj");
        spriteManager.loadAtlas(
            "../../assets/images/atlas.json",
            "../../assets/images/atlas.png"
        );

        gameManager.factory["Player"] = Player;
        gameManager.factory["GreenMonster"] = GreenMonster;
        gameManager.factory["Money"] = Money;

        mapManager.parseEntities();
        mapManager.draw(this.ctx);
        eventsManager.setup();
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
