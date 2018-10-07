const API_KEY = 'your-api-key-here';
const charactersElement = document.querySelector('.characters');
const snapElement = document.querySelector('#snap');
const thanosElement = document.querySelector('#thanos');
const clickThanosElement = document.querySelector('#clickThanos');
const theTruth = document.querySelector('#the-truth');

const introSound = document.querySelector('#intro-sound');
const snapSound = document.querySelector('#snap-sound');
const funeralSound = document.querySelector('#funeral-sound');

const charactersURL = 'https://gateway.marvel.com/v1/public/events/29/characters?limit=100&apikey=' + API_KEY;

function getCharacterData() {
  if (localStorage.characterData) {
    return Promise.resolve(JSON.parse(localStorage.characterData));
  }

  return fetch(charactersURL)
    .then(response => response.json())
    .then(data => {
      localStorage.characterData = JSON.stringify(data);
      return data;
    });
}

const hiddenCharacters = {
  1009652: true,
  1009165: true,
  1009726: true,
  1009299: true
};

function addCharactersToPage(characterData) {
  charactersElement.innerHTML = '';
  characterData.data.results.forEach(result => {
    if (!hiddenCharacters[result.id]) {
      const characterImage = result.thumbnail.path + '/standard_medium.jpg';
      const characterElement = document.createElement('div');
      characterElement.style.transform = 'scale(1)';
      characterElement.className = 'character alive';

      const imageElement = document.createElement('img');
      imageElement.src = characterImage;
      characterElement.appendChild(imageElement);

      const characterName = result.name.replace(/\(.*\)/, '');
      const characterNameElement = document.createElement('h3');
      characterNameElement.textContent = characterName;
      characterElement.appendChild(characterNameElement);

      charactersElement.appendChild(characterElement);
    }
  });
  thanosElement.classList.add('hover');
  thanosElement.addEventListener('click', thanosClick);
  clickThanosElement.style.display = '';
}

getCharacterData()
  .then(addCharactersToPage);

function thanosClick() {
  clickThanosElement.style.display = 'none';
  thanosElement.classList.remove('hover');
  introSound.play();
  thanosElement.removeEventListener('click', thanosClick);
  snapElement.style.opacity = '1';
  charactersElement.style.opacity = '0.2';

  setTimeout(() => {
    introSound.pause();
    snapSound.play();
    snapElement.style.opacity = '0';

    setTimeout(() => {
      funeralSound.play();
      balanceUniverse();
    }, 2000);
  }, 5000);
}

function balanceUniverse() {
  const characters = [...document.querySelectorAll('.character')];

  let leftToDie = Math.floor(characters.length / 2);
  console.log('Balancing universe, begin killing', leftToDie, 'characters');
  charactersElement.style.opacity = '1';
  kill(characters, leftToDie);
}

function kill(characters, leftToDie) {
  if (leftToDie > 0) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const [characterChosen] = characters.splice(randomIndex, 1);

    characterChosen.style.opacity = '0.2';
    characterChosen.classList.remove('alive');
    characterChosen.classList.add('dead');

    console.log('Killing...', characterChosen.querySelector('h3').textContent);

    setTimeout(() => {
      characterChosen.style.transform = 'scale(0)';
      characterChosen.style.width = '0px';
      characterChosen.style.height = '0px';
      kill(characters, leftToDie - 1);
    }, 1300);
  } else {
    theTruth.style.opacity = '1';
    fadeOutFuneralMusic();
  }
}

function fadeOutFuneralMusic() {
  if (funeralSound.volume > 0) {
    const newVolume = funeralSound.volume - 0.1;
    funeralSound.volume = +newVolume.toFixed(1);
    setTimeout(() => {
      fadeOutFuneralMusic();
    }, 800);
  } else {
    funeralSound.pause(); 
  }
}