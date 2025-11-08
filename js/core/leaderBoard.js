import { userManager } from './userManager.js';

document.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
});

/**
 * Загружает и отображает таблицу рекордов
 */
function loadLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    const topPlayers = userManager.getTopUsers(10);
    const currentPlayer = userManager.getCurrentUser();

    if (topPlayers.length === 0) {
        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 40px; color: #6c757d;">
                    🎮 Пока нет рекордов!<br>
                    <small>Будьте первым, кто установит рекорд!</small>
                </td>
            </tr>
        `;
        return;
    }

    let leaderboardHTML = '';

    topPlayers.forEach((player, index) => {
        const rank = index + 1;
        const isCurrentPlayer = currentPlayer && player.name === currentPlayer.name;
        const rowClass = isCurrentPlayer ? 'current-player' : '';
        const rankClass = `rank-${rank}`;

        const medal = getMedalEmoji(rank);
        const completedLevels = Object.values(player.levels || {}).filter(level => level.completed).length;
        const totalLevels = 2;

        leaderboardHTML += `
            <tr class="${rowClass} ${rank <= 3 ? rankClass : ''}">
                <td class="player-rank">
                    ${medal} ${rank}
                </td>
                <td>
                    ${player.name}
                    ${isCurrentPlayer ? ' 👤' : ''}
                </td>
                <td class="player-score">
                    ${player.totalScore.toLocaleString()}
                </td>
                <td>
                    ${completedLevels}/${totalLevels}
                </td>
            </tr>
        `;
    });

    leaderboardBody.innerHTML = leaderboardHTML;
}

/**
 * Возвращает emoji медали для места
 * @param {number} rank - место
 * @returns {string} emoji медали
 */
function getMedalEmoji(rank) {
    switch(rank) {
        case 1: return '🥇';
        case 2: return '🥈';
        case 3: return '🥉';
        default: return '';
    }
}