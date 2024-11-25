const gallery = document.getElementById('gallery');
const galleryContainer = document.getElementById('gallery-container');
const fetchBtn = document.getElementById('fetch-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');

const timerDisplay = document.getElementById('timer');
let timerInterval;
let timeSpent = 0;

function updateTimer(){
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer(){
    timerInterval = setInterval(() => {
        timeSpent++;
        updateTimer();
    }, 1000);
}

function stopTimer(){
    clearInterval(timerInterval);
}

document.addEventListener('visibilitychange', () => {
    if(document.hidden){
        stopTimer();
    }else{
        startTimer();
    }
});

window.addEventListener('load', () => {
    if(!document.hidden){
        startTimer();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const savedImages = JSON.parse(localStorage.getItem('galleryImages')) || [];
    if (savedImages.length > 0) {
        savedImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            gallery.appendChild(img);
        });
    } else {
        console.log('Галерея порожня.');
    }
});


function saveGalleryToLocalStorage(){
    const images = Array.from(gallery.querySelectorAll('img')).map(img => img.src);
    localStorage.setItem('galleryImages', JSON.stringify(images));
}

fetchBtn.addEventListener('click', async () => {
    try{
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();

        if(data.status === "success"){
            const img = document.createElement('img');
            img.src = data.message;
            gallery.appendChild(img);
            saveGalleryToLocalStorage();
        } else{
            alert("Не вдалося завантажити зображення.");
        }
    } catch(error){
        console.error("Помилка Fetch API:", error);
        alert("Щось пішло не так. Перевірте консоль");
    }
});

fullscreenBtn.addEventListener("click", () => {
    if (galleryContainer.requestFullscreen) {
        galleryContainer.requestFullscreen()
            .then(() => {
                galleryContainer.classList.add("fullscreen-active");
            })
            .catch((err) =>
                console.error("Помилка при вході в повноекранний режим:", err)
            );
    }
});

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
        galleryContainer.classList.remove("fullscreen-active");
    }
});


if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const locationDiv = document.getElementById('location');
        locationDiv.textContent = `${latitude.toFixed(4)}${longitude.toFixed(4)}`;

        navigator.geolocation.watchPosition((position) => {
            const newLatitude = position.coords.latitude;
            const newLongitude = position.coords.longitude;
            locationDiv.textContent = `${newLatitude.toFixed(4)}${newLongitude.toFixed(4)}`;
        });
    }, (error) => {
        alert("Не вдалося отримати ваше місцезнаходження.")
    });
} else{
    alert("Geolocation API не підтримується вашим браузером.");
}