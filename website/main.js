const selectPlayerUrl = 'player-select.html';
const selectDungeonmasterUrl = 'world-select.html';

document.getElementById('role-select-player').addEventListener('click', () => {
    window.location = selectPlayerUrl;
});

document.getElementById('role-select-dungeonmaster').addEventListener('click', () => {
    window.location = selectDungeonmasterUrl;
});