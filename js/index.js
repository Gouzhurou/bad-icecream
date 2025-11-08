import { userManager } from './core/userManager.js';
import { gameManager } from './core/gameManager.js';

if (!userManager.isPlayerLoggedIn()) {
    window.location.href = 'login.html';
} else {
    initializeGame();
}

function initializeGame() {
    const user = userManager.getCurrentUser();
    const userNameDisplay = document.getElementById('userNameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userNameDisplay) {
        const playerRank = userManager.getCurrentUserRank();
        const rankText = playerRank > 0 ? ` (Место: ${playerRank})` : '';
        userNameDisplay.textContent = `Игрок: ${user.name}${rankText}`;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            userManager.logout();
            window.location.href = 'login.html';
        });
    }

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    gameManager.initContext(ctx);
    gameManager.loadAll(canvas);
    gameManager.play();
}