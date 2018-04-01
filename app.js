const tilesSource = [[1, 'one'], [2, 'two'], [3, 'three'], [4, 'four'], [5, 'five'], [6, 'six'], [7, 'seven'], [8, 'eight']];

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function createTiles(difficulty) {
	const tilesContainer = document.querySelector('.tiles');
	const shuffled = shuffleArray(tilesSource);
	const tilesArray = shuffleArray(shuffled.splice(0, (difficulty / 2)).map(function(item) {
    									return [item, item];
										}).reduce(function(a, b) { return a.concat(b) }));

	tilesArray.forEach( function(element, index) {
		const tile = `<li class="tile item${tilesArray[index][0]}" data-item="${tilesArray[index][0]}">${tilesArray[index][1]}</li>`;
		tilesContainer.innerHTML += tile;
	});
}


function startGame(level) {
	const setup = document.querySelector('.setup');
	const gameArea = document.querySelector('.game');
	const difficulty = (level === 'easy' ? 8 : (level === 'medium' ? 12 : 16));

	setup.classList.add('hide');
	gameArea.classList.remove('hide');
	gameArea.classList.add(`level-${level}`);

	createTiles(difficulty);

	const tiles = Array.from(document.querySelectorAll('.tile'));
	console.log(tiles);	
}

function init () {
	const startButtons = Array.from(document.querySelectorAll('.game-start'));
	for (let i = 0; i < startButtons.length; i++)
  	startButtons[i].addEventListener('click', function() {
    	startGame(startButtons[i].dataset.level);
  });
}


document.addEventListener("DOMContentLoaded", function(event) {
	init();
});