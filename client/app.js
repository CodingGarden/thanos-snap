const API_KEY = 'your-api-key-here';
const charactersElement = document.querySelector('.characters');
const snapElement = document.querySelector('#snap');
const thanosElement = document.querySelector('#thanos');
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
  thanosElement.addEventListener('click', thanosClick);
}

getCharacterData()
  .then(addCharactersToPage);

function thanosClick() {
  introSound.play();
  thanosElement.removeEventListener('click', thanosClick);
  snapElement.style.opacity = '1';

  setTimeout(() => {
    introSound.pause();
    snapSound.play();
    snapElement.style.opacity = '0';

    setTimeout(() => {
      funeralSound.play();
      balanceUniverse();
    }, 2000);

  }, 4000);
}

function balanceUniverse() {
  const characters = [...document.querySelectorAll('.character')];

  let leftToDie = Math.floor(characters.length / 2);
  console.log('Balancing universe, begin killing', leftToDie, 'characters');
  
  kill(characters, leftToDie);
}

function kill(characters, leftToDie) {
  if (leftToDie > 0) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const [characterChosen] = characters.splice(randomIndex, 1);

    characterChosen.style.transform = 'scale(0)';
    characterChosen.classList.remove('alive');
    characterChosen.classList.add('dead');

    console.log('Killing...', characterChosen.querySelector('h3').textContent);

    setTimeout(() => {
      kill(characters, leftToDie - 1);
    }, 1000);
  } else {
    document.querySelectorAll('.dead').forEach(character => {
      charactersElement.removeChild(character);
    });
    theTruth.style.opacity = '1';
  }
}