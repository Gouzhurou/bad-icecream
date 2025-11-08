/**
 * Менеджер для работы с данными игроков
 */
export class userManager {
    static STORAGE_KEY = 'users';
    static CURRENT_USER_KEY = 'currentUser';

    /**
     * Сохраняет или обновляет пользователя
     * @param {string} userName - имя пользователя
     * @returns {Object} данные пользователя
     */
    static saveUser(userName) {
        const users = this.getAllUsers();
        let user = users.find(p => p.name.toLowerCase() === userName.toLowerCase());

        if (!user) {
            user = {
                name: userName,
                levels: {},
                totalScore: 0,
                createdAt: new Date().toISOString(),
                lastPlayed: new Date().toISOString()
            };
            users.push(user);
        } else {
            user.lastPlayed = new Date().toISOString();
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(this.CURRENT_USER_KEY, userName);

        return user;
    }

    /**
     * Получает всех пользователей
     * @returns {Array} массив пользователей
     */
    static getAllUsers() {
        const playersJSON = localStorage.getItem(this.STORAGE_KEY);
        return playersJSON ? JSON.parse(playersJSON) : [];
    }

    /**
     * Получает текущего пользователя
     * @returns {Object|null} данные текущего пользователя
     */
    static getCurrentUser() {
        const userName = localStorage.getItem(this.CURRENT_USER_KEY);
        if (!userName) return null;

        const users = this.getAllUsers();
        return users.find(p => p.name === userName) || null;
    }

    /**
     * Обновляет прогресс уровня для текущего пользователя
     * @param {number} levelNumber - номер уровня
     * @param {number} score - количество очков
     * @param {boolean} completed - пройден ли уровень
     */
    static updateLevelProgress(levelNumber, score, completed = true) {
        const user = this.getCurrentUser();
        if (!user) return;

        const users = this.getAllUsers();
        const userIndex = users.findIndex(p => p.name === user.name);

        if (userIndex === -1) return;

        users[userIndex].levels[levelNumber] = {
            score: score,
            completed: completed,
            completedAt: completed ? new Date().toISOString() : null
        };

        users[userIndex].totalScore = Object.values(users[userIndex].levels)
            .reduce((total, level) => total + (level.score || 0), 0);

        users[userIndex].lastPlayed = new Date().toISOString();

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    }

    /**
     * Выход из текущего аккаунта
     */
    static logout() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
    }

    /**
     * Проверяет, авторизован ли пользователь
     * @returns {boolean}
     */
    static isPlayerLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    /**
     * Получает топ пользователей по очкам
     * @param {number} limit - количество игроков
     * @returns {Array} массив топ игроков
     */
    static getTopUsers(limit = 10) {
        const players = this.getAllUsers();

        return players
            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, limit);
    }

    /**
     * Получает позицию текущего пользователя в рейтинге
     * @returns {number} позиция в рейтинге (начиная с 1) или 0 если не в топе
     */
    static getCurrentUserRank() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return 0;

        const topUsers = this.getTopUsers(100);
        const playerIndex = topUsers.findIndex(p => p.name === currentUser.name);

        return playerIndex !== -1 ? playerIndex + 1 : 0;
    }

    /**
     * Получает статистику по всем пользователям
     * @returns {Object} общая статистика
     */
    static getGlobalStats() {
        const users = this.getAllUsers();
        const totalUsers = users.length;
        const totalScore = users.reduce((sum, user) => sum + user.totalScore, 0);
        const averageScore = totalUsers > 0 ? Math.round(totalScore / totalUsers) : 0;

        return {
            totalPlayers: totalUsers,
            totalScore: totalScore,
            averageScore: averageScore,
            topScore: users.length > 0 ? Math.max(...users.map(p => p.totalScore)) : 0
        };
    }
}