import {userManager} from "./userManager.js";

document.addEventListener('DOMContentLoaded', function() {
    const userNameInput = document.getElementById('userName');
    const startGameButton = document.getElementById('startGame');
    const errorMessage = document.getElementById('errorMessage');

    userNameInput.focus();

    startGameButton.addEventListener('click', startGame);

    userNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });

    function startGame() {
        const userName = userNameInput.value.trim();

        if (!userName) {
            showError('Имя не может быть пустым!');
            return;
        }

        if (userName.length < 2) {
            showError('Имя должно содержать минимум 2 символа!');
            return;
        }

        if (userName.length > 20) {
            showError('Имя не может быть длиннее 20 символов!');
            return;
        }

        userManager.saveUser(userName);

        window.location.href = 'index.html';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        userNameInput.focus();
    }

    userNameInput.addEventListener('input', function() {
        errorMessage.style.display = 'none';
    });
});