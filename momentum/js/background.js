const bodyElement = document.querySelector("body");
const prev = document.querySelector(".slide-prev");
const next = document.querySelector(".slide-next");

let randomNumber = getRandomIntInclusive();
const timeOfDay = getTimeOfDay();
const backgroundSelect = document.getElementById("background-sel");
const selectedOption = backgroundSelect.value;
const tagInput = document.querySelector(".image-tag-input");
const image = new Image();
let tag = timeOfDay || tagInput.value.trim();

function getRandomIntInclusive(min = 1, max = 20) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
getRandomIntInclusive();

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 0 && hours < 12) {
    return "morning";
  } else if (hours >= 12 && hours <= 16) {
    return "afternoon";
  } else if (hours >= 17 && hours <= 24) {
    return "evening";
  }
}
getTimeOfDay();

function getLocalStorageImg() {
  if (localStorage.getItem("selectedOption")) {
    backgroundSelect.value = localStorage.getItem("selectedOption");
  }
  if (localStorage.getItem("tagInput")) {
    tagInput.value = localStorage.getItem("tagInput");
  }
}

window.addEventListener("load", function() {
  getLocalStorageImg();
});

backgroundSelect.addEventListener('change', function() {
  setBg()
  localStorage.setItem('selectedOption', backgroundSelect.value);
});

tagInput.addEventListener('change', function() {
  setBg()
  localStorage.setItem('tagInput', tagInput.value);
});


function setBg() {
  const img = new Image();
  const timeOfDay = getTimeOfDay();
  let bgNum = randomNumber.toString().padStart(2, "0");

  img.src = `https://raw.githubusercontent.com/Tanyaa-a/momentum_photos/assets/images/${timeOfDay}/${bgNum}.jpg`;

  img.onload = () => {
    document.body.style.backgroundImage = `url(https://raw.githubusercontent.com/Tanyaa-a/momentum_photos/assets/images/${timeOfDay}/${bgNum}.jpg)`;
  };
}
setBg();

// tagInput.value.addEventListener("keydown", function(e) {
//   if (e.key === "Enter") {
//     e.preventDefault();
//     tag = e.target.value;
//   }
// });
// tagInput.addEventListener("keydown", function(e) {
//   if (e.key === "Enter") {
//     e.preventDefault();
//     tag = e.target.value;
//     if (backgroundSelect.value === "git") {
//       setBg();
//     } else if (backgroundSelect.value === "flickr") {
//       fetchFlickrPhoto(tag);
//     } else if (backgroundSelect.value === "unsplash") {
//       getPicsUnsplash(tag);
//     }
//   }
// });


// backgroundSelect.addEventListener
//   ("change", function () {
//   const selectedOption = backgroundSelect.value;

//   console.log("Selected option:", selectedOption);
//   console.log("Tagi:", tag);

//   if (selectedOption === "git") {
//     console.log("Calling setBg"); // Add this
//     setBg();
//   } else if (selectedOption === "unsplash") {
//     console.log("Calling getPicsUnsplash"); // Add this
//     getPicsUnsplash(tag);
//   } else if (selectedOption === "flickr") {
//     console.log("Calling fetchFlickrPhoto"); // Add this
//     fetchFlickrPhoto(tag);
//   }
// });



// The new function to fetch image based on the selected background option and the tag
function fetchImage() {
  if (backgroundSelect.value === "git") {
    setBg();
  } else if (backgroundSelect.value === "flickr") {
    fetchFlickrPhoto(tag);
  } else if (backgroundSelect.value === "unsplash") {
    getPicsUnsplash(tag);
  }
}

// The keydown event listener for the tagInput
tagInput.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    tag = e.target.value;
    fetchImage();
  }
});

// The change event listener for the backgroundSelect
backgroundSelect.addEventListener("change", function () {
  fetchImage();
});


document.querySelector(".slide-prev").addEventListener("click", function() {
  if (randomNumber === 1) {
    randomNumber = 20;
  } else {
    randomNumber--;
  }

  if (backgroundSelect.value === "git") {
    setBg();
  } else if (backgroundSelect.value === "flickr") {
    fetchFlickrPhoto(tag);
  } else if (backgroundSelect.value === "unsplash") {
    getPicsUnsplash(tag);
  }
});

document.querySelector(".slide-next").addEventListener("click", function() {
  if (randomNumber === 20) {
    randomNumber = 1;
  } else {
    randomNumber++;
  }

  if (backgroundSelect.value === "git") {
    setBg();
  } else if (backgroundSelect.value === "flickr") {
    fetchFlickrPhoto(tag);
  } else if (backgroundSelect.value === "unsplash") {
    getPicsUnsplash(tag);
  }
});

//Getting background image from APIs

async function getPicsUnsplash(tag) {
  url = `https://api.unsplash.com/photos/random?query=${tag}&client_id=_vrajOhpkeRmlTTVzv31VBoLLYutmg9XIyd8Ad9p0-Y`;

  const res = await fetch(url);
  const data = await res.json();
  console.log(data);

  try {
    image.src = data.urls.regular;
  } catch {
    if (res.status === 403) {
      alert(
        "Failed to fetch photo from Flickr API."
      );
    }
    if (res.status === 404) {
      alert(
        "No photos found for the given tag."
      );
    }
    tag = "";
    tagInput.value = "";
  }

  image.onload = () => {
    bodyElement.style.backgroundImage = `url('${data.urls.regular}')`;
  };
}


async function fetchFlickrPhoto(tag) {
  const apiKey = "33186ace97305656ba11210440900694";

  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${tag}&extras=url_l&format=json&nojsoncallback=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch photo from Flickr API.");
    }

    const data = await response.json();
    photos = data.photos.photo;
    currentIndex = getRandomIntInclusive(0, photos.length - 1);
    if (photos.length > 0 && photos[currentIndex].url_l) {
      bodyElement.style.backgroundImage = `url('${photos[currentIndex].url_l}')`;
    } else {
      alert("No photos found for the given tag.");
    }
  } catch (error) {
    alert(error);
  }
}


