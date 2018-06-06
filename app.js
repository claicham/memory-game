document.addEventListener('DOMContentLoaded', function () {
  const setup = document.querySelector('.setup');
  const gameArea = document.querySelector('.game');
  const results = document.querySelector('.result');
  const resetGame = document.querySelector('.reset-game');
  const restartGame = document.querySelector('.restart');
  let currentDifficulty = '';
  let difficultyAsNum = 0;
  let timer = 0;
  const timeText = document.querySelector('.time');
  let seconds;

  const tilesSource = [
    [1, 'icon-android'],
    [2, 'icon-angular'],
    [3, 'icon-apple'],
    [4, 'icon-bower'],
    [5, 'icon-css3'],
    [6, 'icon-github'],
    [7, 'icon-google'],
    [8, 'icon-gulp'],
    [9, 'icon-html5'],
    [10, 'icon-javascript'],
    [11, 'icon-npm'],
    [12, 'icon-sass'],
    [13, 'icon-slack']
  ];
  let movesTaken = 0;
  let matchedItems = 0;

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

  function createTiles() {
    const tilesContainer = document.querySelector('.tiles');
    const shuffled = shuffleArray(tilesSource);
    const tilesArray = shuffleArray(shuffled.slice(0, (difficultyAsNum / 2)).map(function (tile) {
      return [tile, tile];
    }).reduce(function (a, b) {
      return a.concat(b);
    }));

    tilesContainer.innerHTML = '';

    tilesArray.forEach(function (element, index) {
      const tile = `<li class="tile item${tilesArray[index][0]}" data-item="${tilesArray[index][0]}" data-unique="${index}"><span class="icon ${tilesArray[index][1]}"></span></li>`;
      tilesContainer.innerHTML += tile;
    });
  }


  function startGame() {

    setup.classList.add('hide');
    gameArea.classList.remove('hide');
    gameArea.classList.add(`level-${currentDifficulty}`);
    gameArea.style.height = `${window.innerHeight - 104}px`;
    setup.style.height = `${window.innerHeight - 104}px`;
    results.style.height = `${window.innerHeight - 104}px`;

    createTiles(difficultyAsNum);

    matchTiles();
    clearTimer(true);
    gameTimer();
  }

  function matchTiles() {
    const tiles = document.querySelector('.tiles');
    let matches = [];

    tiles.addEventListener('click', function (e) {
      if (!e.target.classList.contains('selected') || (!e.target.classList.contains('selected') && !e.target.classList.contains('matched'))) {
        e.target.classList.add('selected', 'flip');
        matches.push([e.target.dataset.item, e.target.dataset.unique]);

        if (matches.length === 2) {
          checkMatches(matches);
          matches = [];
        }
      }
    });

    function checkMatches(matches) {
      movesTaken += 1;
      if (matches[0][0] === matches[1][0]) {
        const matched = document.querySelectorAll(`[data-item='${matches[0][0]}']`);
        for (let i = 0; i < matched.length; i++) {
          window.setTimeout(function () {
            matched[i].classList.add('matched');
          }, 400);
        }
        matchedItems += 1;

        if (matchedItems === (difficultyAsNum / 2)) {
          clearTimer(false);
          window.setTimeout(function () {
            completeGame();
          }, 1400);
        }

      } else {
        const item1 = document.querySelector(`[data-unique='${matches[0][1]}']`);
        const item2 = document.querySelector(`[data-unique='${matches[1][1]}']`);

        window.setTimeout(function () {
          item1.classList.remove('selected', 'flip');
          item2.classList.remove('selected', 'flip');
        }, 500);
      }

      updateStats();
    }
  }

  function updateStats() {
    const movesSpan = document.querySelector('.moves');
    const matchesSpan = document.querySelector('.matches');

    movesSpan.innerHTML = movesTaken;
    matchesSpan.innerHTML = matchedItems;
  }

  function completeGame() {
    gameArea.classList.add('hide');
    results.classList.remove('hide');

    const resultsText = document.querySelector('.results-text');
    const markup = `You completed the game in ${movesTaken} moves with a time of ${timer} seconds!`;
    rateUser();
    resultsText.innerHTML = markup;
  }

  function rateUser() {
    const stars = document.querySelector('.stars');
    let multiplier = difficultyAsNum / 4;
    if (movesTaken <= (difficultyAsNum / 2) + multiplier) {
      stars.innerHTML = '<span class="three"></span>';
    } else if (movesTaken <= (difficultyAsNum / 2) + (multiplier * 2)) {
      stars.innerHTML = '<span class="two"></span>';
    } else if (movesTaken <= (difficultyAsNum / 2) + (multiplier * 3)) {
      stars.innerHTML = '<span class="one"></span>';
    } else {
      stars.innerHTML = '';
    }
  }

  function gameTimer() {
    seconds = setInterval(function () {
      timer++;
      updateTimerText();
    }, 1000);
  }

  function clearTimer(clearCurrentTime) {
    clearInterval(seconds);
    if (clearCurrentTime) {
      timer = 0;
    }
  }

  function updateTimerText() {
    timeText.innerHTML = `Timer: ${timer}s`;
  }

  function reset() {
    setup.classList.remove('hide');
    gameArea.classList.add('hide');
    results.classList.add('hide');
    gameArea.classList.remove(`level-${currentDifficulty}`);
    movesTaken = 0;
    matchedItems = 0;
    currentDifficulty = '';
    timer = 0;
    updateTimerText();
    updateStats();
    init();
  }

  function init() {
    const startButtons = document.querySelector('.game-start');
    startButtons.addEventListener('click', function (e) {
      currentDifficulty = e.target.dataset.level;
      difficultyAsNum = currentDifficulty === 'easy' ? 8 : (currentDifficulty === 'medium' ? 12 : 16);
      startGame(e.target.dataset.level);
    });
  }
  init();

  resetGame.addEventListener('click', reset);
  restartGame.addEventListener('click', reset);
});