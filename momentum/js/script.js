let lang = "en";
localStorage.getItem("lang")
  ? (lang = localStorage.getItem("lang"))
  : (lang = "en");

let d = document.querySelector(".date");
let time = document.querySelector(".time");
let date = new Date();

function showTime() {
  setInterval(() => {
    let date = new Date();
    let currentTime = date.toLocaleTimeString([], { hour12: false });
    time.textContent = currentTime;
  }, 1000);
}
showTime();

function showDate(lang) {
  let d = document.querySelector(".date");
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "PST",
  };
  let currentDate = date.toLocaleDateString(lang, options);
  if (lang === "en") {
    currentDate = new Date().toLocaleDateString("en-US", options);
  } else if (lang === "uk") {
    currentDate = new Date().toLocaleDateString("Uk-UK", options);
  }
  d.textContent = currentDate;
}
showDate(lang);

// Greeting

const greeting = document.querySelector(".greeting");
const hours = date.getHours();
const hour = new Date().getHours(lang);
// const greetingIndex = Math.trunc(hour / 6);

function showGreeting(lang) {
  const greetingLang = [
    {
      en: "Good morning,",
      uk: "Доброго ранку,",
    },
    {
      en: "Good afternoon,",
      uk: "Доброго дня,",
    },
    {
      en: "Good evening,",
      uk: "Доброго вечора! Ми з України!",
    },
  ];

  if (date.getHours() >= 0 && date.getHours() < 12) {
    greeting.innerHTML = greetingLang[0][lang];
  } else if (date.getHours() >= 12 && date.getHours() <= 16) {
    greeting.innerHTML = greetingLang[1][lang];
  } else if (date.getHours() >= 17 && date.getHours() <= 24) {
    greeting.innerHTML = greetingLang[2][lang];
  }
}
showGreeting(lang);

const placeholderLang = [
  {
    en: "your name here",
    uk: "Ваше імя",
  },
];

function setPlaceholderText(lang) {
  const nameInput = document.querySelector(".name");
  nameInput.placeholder = placeholderLang[0][lang];
}
setPlaceholderText(lang);

const yourName = document.querySelector(".name");

function setLocalStorageName() {
  localStorage.setItem("name", yourName.value);
}
window.addEventListener("beforeunload", setLocalStorageName);

function getLocalStorageName() {
  if (localStorage.getItem("name")) {
    yourName.value = localStorage.getItem("name");
  }
}
window.addEventListener("load", getLocalStorageName);

//Weather

const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const weatherDescription = document.querySelector(".weather-description");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const city = document.querySelector(".city");

const weatherTranslation = [
  {
    en: "Wind speed",
    uk: "Швидкість вітру",
  },
  {
    en: "m/s",
    uk: "м/с",
  },
  {
    en: "Humidity",
    uk: "Вологість",
  },
  {
    en: "Enter City",
    uk: "Ваше місто",
  },
];

async function getWeather(lang) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lang}&appid=8b40d91988f55e89c8907090f5932d55&units=metric`;
  const res = await fetch(url);
  const data = await res.json();

  if(data.cod == '404') {
    alert(data.message); // or handle error differently
    return;
  }

  weatherIcon.className = "weather-icon owf";
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `${
    weatherTranslation[0][lang]
  } : ${data.wind.speed.toFixed(0)} ${weatherTranslation[1][lang]}`;
  humidity.textContent = `${
    weatherTranslation[2][lang]
  } : ${data.main.humidity.toFixed(0)}%`;
}

function setCity(event) {
  if (event.code === "Enter") {
    getWeather(lang);
  }
}

document.addEventListener("click", getWeather(lang));
city.addEventListener("keypress", setCity);

function setLocalStorageCity() {
  localStorage.setItem("city", city.value);
}
window.addEventListener("beforeunload", setLocalStorageCity);
city.addEventListener("change", setLocalStorageCity);
function getLocalStorageCity() {
  if (localStorage.getItem("city")) {
    city.value = localStorage.getItem("city");
    getWeather(lang);
  }
}
window.addEventListener("load", getLocalStorageCity);


// Quotes

async function getQuotes(lang) {
  const quote = document.querySelector(".quote");
  const author = document.querySelector(".author");
  const quotes = "js/quotes.json";
  const res = await fetch(quotes);
  const datum = await res.json();
  let quoteNum = getRandomIntInclusive(0, datum.quotes.length - 1);
  quote.textContent = `"${datum.quotes[quoteNum][lang].text}"`;
  author.textContent = datum.quotes[quoteNum][lang].author;
}
getQuotes(lang);

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const changeQuote = document.querySelector(".change-quote");
changeQuote.addEventListener("click", function () {
  getQuotes(lang);
});


//simple audioplayer

import playList from "./playList.js";


const playListContainer = document.querySelector(".play-list");
playList.forEach((el) => {
  const li = document.createElement("li");
  li.classList.add("play-item");
  li.textContent = `${el.title} / ${el.duration}`;
  playListContainer.append(li);
});

const player = document.querySelector(".player");
const play = document.querySelector(".play");
const playPrev = document.querySelector(".play-prev");
const playNext = document.querySelector(".play-next");
const playItem = document.querySelector(".play-item");

const currentTrackTitle = document.querySelector(".track-title");
let playNum = 0;
currentTrackTitle.textContent = playList[playNum].title;

const musicTrack = playListContainer.childNodes;


let isPlay = false;
const audio = new Audio();
let pauseTime = 0;

function playAudio() {
  audio.src = playList[playNum].src;
  audio.currentTime = 0;
  play.classList.toggle("pause");
  musicTrack[playNum].classList.toggle("item-active");
  
  if (!isPlay) {
    audio.play();
    currentTrackTitle.textContent = playList[playNum].title;
    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
  }
}
play.addEventListener("click", playAudio);

playPrev.addEventListener("click", function () {
  let pauseTime = 0;
  musicTrack[playNum].classList.remove("item-active");

  audio.src = playList[playNum].src;
  playNum === 0 ? (playNum = playList.length - 1) : playNum--;
  isPlay = false;
  play.classList.remove("pause");
  playAudio();
  currentTrackTitle.textContent = playList[playNum].title;
});

function nextTrack() {
  audio.currentTime = 0;
  musicTrack[playNum].classList.remove('item-active');
  playNum === playList.length - 1 ? playNum = 0 : playNum++;
  isPlay = false;
  play.classList.remove('pause');
  playAudio();
}

playNext.addEventListener('click', nextTrack);



musicTrack.forEach((el, index) => {
  el.addEventListener("click", function () {
    if (playNum === index && isPlay === true) {
      isPlay = true;
    } else {
      isPlay = false;
      play.classList.remove("pause");
      musicTrack[playNum].classList.remove("item-active");
    }
    playNum = index;
    playAudio();
  });
});

const currentTrackProgress = document.querySelector(".current-track-progress");
const currentTrackTime = document.querySelector(".current-track-time");

function TrackProgress() {
  currentTrackProgress.style.width =
    (Math.floor(audio.currentTime) * 100) / Math.floor(audio.duration) + "%";
  currentTrackTime.textContent = `${String(
    Math.floor(audio.currentTime / 60)
  )}:${String(Math.floor(audio.currentTime % 60)).padStart(2, "0")} / ${
    playList[playNum].duration
  }`;
  if (currentTrackProgress.style.width === "100%") {
    currentTrackProgress.style.width = 0;
    nextTrack();
  }
}
setInterval(TrackProgress, 1000);

const currentTrackScale = document.querySelector(".current-track-scale");
currentTrackScale.addEventListener("click", function (currentDuration) {
  audio.currentTime =
    (currentDuration.offsetX /
      parseInt(window.getComputedStyle(currentTrackScale).width)) *
    audio.duration;
});

//volume slider

audio.volume = 0.5;
const volumeBtn = document.querySelector(".volume-icon");
const volumeBar = document.querySelector(".volume-bar");
const volumeProgress = document.querySelector(".volume-progress");

volumeBtn.addEventListener("click", function () {
  if (audio.muted === false) {
    audio.muted = true;
    volumeProgress.style.width = 0;
     volumeBtn.classList.remove("volume-icon-on");
     volumeBtn.classList.add("volume-icon");
  } else {
    audio.muted = false;
    volumeProgress.style.width = audio.volume * 100 + "%";
   volumeBtn.classList.remove("volume-icon");
    volumeBtn.classList.add("volume-icon-on");
  }
});

volumeBar.addEventListener("click", function (changeVolume) {
  audio.muted = false;
  audio.volume =
    changeVolume.offsetX / parseInt(window.getComputedStyle(volumeBar).width);
  volumeProgress.style.width = audio.volume * 100 + "%";
});

//language

const languageSwitcher = document.getElementById("lang");
languageSwitcher.addEventListener("change", function () {
  lang = languageSwitcher.value;

  if (lang === "en") {
    city.value = "San Francisco";
    city.placeholder = "city";
  } else {
    city.value = "Сан Франциско";
    city.placeholder = "Місто";
  }
  loadSettings(lang);
  getWeather(lang);
  getQuotes(lang);
  showDate(lang);
  showGreeting(lang);
  setPlaceholderText(lang);
});

//settings

const settingsTranslation = [
  {
    en: "Settings",
    uk: "Налаштування",
  },
  {
    en: "Language",
    uk: "Мова",
  },
  {
    en: "Background",
    uk: "Фон",
  },
  {
    en: "Tags",
    uk: "Тег",
  },
  {
    en: "Show",
    uk: "Віджети",
  },
  {
    en: "Time",
    uk: "Час",
  },
  {
    en: "Date",
    uk: "Дата",
  },
  {
    en: "Greeting",
    uk: "Привітання",
  },
  {
    en: "Weather",
    uk: "Погода",
  },
  {
    en: "Audio",
    uk: "Плеєр",
  },
  {
    en: "Quotes",
    uk: "Цитати",
  },
  {
    en: "ToDo",
    uk: "Перелік справ",
  },
  {
    en: "Today",
    uk: "Сьогодні",
  },
  {
    en: "Done",
    uk: "Зроблено",
  },
  {
    en: "New Todo",
    uk: "Нова справа",
  },
  {
    en: "Add your tag for photo",
    uk: "Додайте фото для тегу",
  }
  
];

const todoButton = document.querySelector(".todo-button");
const settingsContainer = document.querySelector(".settings-container");
const settingButtonName = document.querySelector(".settings-button-name");
const settingTitle = document.querySelector(".setting-title");
const languageSelect = document.querySelector(".lang-title");
const setBackground = document.querySelector(".background-select");
const setTags = document.querySelector(".tags");
const tagInputText = document.querySelector(".image-tag-input");
const showTitle = document.querySelector(".show-title");
const inputTime = document.querySelector(".input-label-time");
const inputDate = document.querySelector(".input-label-date");
const inputWeather = document.querySelector(".input-label-weather");
const inputQuotes = document.querySelector(".input-label-quotes");
const inputGreeting = document.querySelector(".input-label-greeting");
const inputPlayer = document.querySelector(".input-label-audio");
const inputTodo = document.querySelector(".input-label-todo");
const selectDone = document.querySelector(".done");
const selectToday = document.querySelector(".today-done");
const todoNew = document.querySelector(".todo-new");
 


function loadSettings(lang) {
  settingButtonName.textContent = settingsTranslation[0][lang];
  settingTitle.textContent = settingsTranslation[0][lang];
  languageSelect.textContent = settingsTranslation[1][lang];
  setBackground.textContent = settingsTranslation[2][lang];
  setTags.textContent = settingsTranslation[3][lang];
  showTitle.textContent = settingsTranslation[4][lang];
  inputTime.textContent = settingsTranslation[5][lang];
  inputDate.textContent = settingsTranslation[6][lang];
  inputWeather.textContent = settingsTranslation[8][lang];
  inputQuotes.textContent = settingsTranslation[10][lang];
  inputGreeting.textContent = settingsTranslation[7][lang]
  inputPlayer.textContent = settingsTranslation[9][lang];
  inputTodo.textContent = settingsTranslation[11][lang];
  todoButton.textContent = settingsTranslation[11][lang];
  selectDone.textContent = settingsTranslation[13][lang];
  selectToday.textContent = settingsTranslation[12][lang];
  todoNew.placeholder = settingsTranslation[14][lang];
  tagInputText.placeholder = settingsTranslation[15][lang];
}
loadSettings(lang);

//checkbox

const checkboxTime = document.getElementById('checkbox-time');
const checkboxDate = document.getElementById('checkbox-date');
const checkboxGreeting = document.getElementById('checkbox-greeting');
const checkboxWeather = document.getElementById('checkbox-weather');
const checkboxPlayer = document.getElementById('checkbox-audio');
const checkboxQuote = document.getElementById('checkbox-quotes');
const checkboxTodo = document.getElementById('checkbox-todo');
const greetingContainer = document.querySelector('.greeting-container');
const weatherContainer = document.querySelector('.weather');
const audioPlayer = document.querySelector('.player');
const quotesContainer = document.querySelector('.quotes');
const todoContainer = document.querySelector(".todolist");
const buttonSettings = document.querySelector(".settings-button-name");
checkboxTime.addEventListener('change', function() {
  checkboxTime.checked ? time.style.opacity = '1' : time.style.opacity = '0';
});
checkboxDate.addEventListener('change', function() {
  checkboxDate.checked ? d.style.opacity = '1' : d.style.opacity = '0';
});
checkboxGreeting.addEventListener('change', function() {
  checkboxGreeting.checked ? greetingContainer.style.opacity = '1' : greetingContainer.style.opacity = '0';
});
checkboxWeather.addEventListener('change', function() {
  checkboxWeather.checked ? weatherContainer.style.opacity = '1' : weatherContainer.style.opacity = '0';
});
checkboxPlayer.addEventListener('change', function() {
  checkboxPlayer.checked ? audioPlayer.style.opacity = '1' : audioPlayer.style.opacity = '0';
});
checkboxQuote.addEventListener('change', function() {
  checkboxQuote.checked ? quotesContainer.style.opacity = '1' : quotesContainer.style.opacity = '0';
});
checkboxTodo.addEventListener('change', function() {
  if (!checkboxTodo.checked) {
    todoButton.style.opacity = '0';
    todoContainer.style.opacity = '0';
  } else {
    todoButton.style.opacity = '1';
    todoContainer.style.opacity = '1';
   }
});

function setLocalStorageChekbox() {
  localStorage.setItem('checkboxTime', checkboxTime.checked);
  localStorage.setItem('checkboxDate', checkboxDate.checked);
  localStorage.setItem('checkboxGreeting', checkboxGreeting.checked);
  localStorage.setItem('checkboxWeather', checkboxWeather.checked);
  localStorage.setItem('checkboxPlayer', checkboxPlayer.checked);
  localStorage.setItem('checkboxQuotes', checkboxQuote.checked);
  localStorage.setItem('checkboxTodo', checkboxTodo.checked);
}
window.addEventListener('beforeunload', setLocalStorageChekbox);

function loadCheckbox(checkbox, value) {
  if (localStorage.getItem(value)) {
    checkbox.checked = localStorage.getItem(value) === 'false' ? false : true;
  }
}

loadCheckbox(checkboxTime, 'checkboxTime');
loadCheckbox(checkboxDate, 'checkboxDate');
loadCheckbox(checkboxGreeting, 'checkboxGreeting');
loadCheckbox(checkboxWeather, 'checkboxWeather');
loadCheckbox(checkboxPlayer, 'checkboxPlayer');
loadCheckbox(checkboxQuote, 'checkboxQuote');
loadCheckbox(checkboxTodo, 'checkboxTodo');


buttonSettings.addEventListener('click', function() {
  settingsContainer.classList.toggle('show-time');
});


// todo list

const todoShow = document.querySelector(".todolist-container");
  todoButton.addEventListener("click", function() {
    todoShow.classList.toggle("hidden");
});

const newTodo = document.querySelector('.todo-new');
const listTodo = document.querySelector('.todo-list');
const todoSelect = document.querySelector('.todo-select');

newTodo.addEventListener('change', function () {
  if (todoSelect.value === 'today' && newTodo.value !== '') {
      const li = document.createElement('li');
      const div = document.createElement('div');
      const input = document.createElement('input');
      const label = document.createElement('label');
      const button = document.createElement('button');
      li.classList.add('checkbox-item-todo');
      div.classList.add('action-group');
      input.classList.add('checkbox-new-todo');
      input.type = 'checkbox';
      input.id = newTodo.value;
      label.classList.add('checkbox-text-todo');
      label.textContent = newTodo.value;
      label.htmlFor = newTodo.value;
      button.classList.add('btn-todo-del');
      listTodo.append(li);
      li.append(label);
      li.append(div);
      div.append(input);
      div.append(button);

      // Add event listener to checkbox to toggle strikethrough class
      input.addEventListener('change', function() {
          label.classList.toggle('strikethrough');
      });

      const todoDel = document.querySelectorAll('.btn-todo-del');
      const checkboxItemTodo = document.querySelectorAll('.checkbox-item-todo');
      todoDel.forEach((el, index) => {
          el.addEventListener('click', () => {
              checkboxItemTodo[index].remove();
          });
      });

      // Clear the input field after adding the task.
      newTodo.value = '';
  }
});

todoSelect.addEventListener('change', function () {
	const checkboxNewTodo = document.querySelectorAll('.checkbox-new-todo')
	const checkboxItemTodo = document.querySelectorAll('.checkbox-item-todo')

	checkboxNewTodo.forEach((el, index) => {
		if (todoSelect.value === 'done' && el.checked === false) {
			checkboxItemTodo[index].classList.add('hidden-reverse')
		} else if (todoSelect.value === 'today') {
			checkboxItemTodo[index].classList.remove('hidden-reverse')
		}
  })
  newTodo.value = '';
})

