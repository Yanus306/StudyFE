// OpenWeatherMap API에 필요한 정보
const API_KEY = '4e75c2d4ab5ec7883740b215fb01afec';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const description = document.getElementById('description');
const img = document.getElementById('weatherIcon');
const area = document.getElementById('area');

// 개별 온도 요소들
const tempEl = document.getElementById('temp');
const feelsLikeEl = document.getElementById('feels_like');
const tempMinEl = document.getElementById('temp_min');
const tempMaxEl = document.getElementById('temp_max');

// 알림창 및 가이드 요소
const alertBox = document.getElementById('weather-alert');
const clothingBox = document.getElementById('clothing-guide');

// API로부터 날씨 데이터를 받아와 각 요소에 해당하는 데이터를 할당하고 표시
async function getWeather(url) {
    await fetch(url)
        .then((response) => response.json())
        .then((data) => {
            // 지역 및 날씨 설명
            area.innerText = data.name; // '검색 지역:' 문구를 빼서 더 미니멀하게 가공
            description.innerText = data.weather[0].description;

            // 날씨 아이콘 이미지 url
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; // 화질을 위해 @2x 추가
            img.src = iconUrl;

            // ================== ✨ 날씨별 맞춤 문구 (웨더 경고창) ==================
            const weatherMain = data.weather[0].main.toLowerCase();
            let alertMessage = "";

            if (weatherMain.includes('clear')) {
                alertMessage = "현재 날씨가 맑습니다!! ☀️";
            } else if (weatherMain.includes('clouds')) {
                alertMessage = "현재 날씨는 흐리네요... ☁️";
            } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
                alertMessage = "현재 비가 오고있으니 우산을 챙깁시다! 🌧️";
            } else if (weatherMain.includes('snow')) {
                alertMessage = "온세상에 하얀눈이..! ❄️";
            } else if (weatherMain.includes('thunderstorm')) {
                alertMessage = "천둥 번개가 치고 있어요 ⚡";
            } else {
                alertMessage = "오늘도 좋은 하루 보내세요! 😊";
            }

            if (alertBox) {
                alertBox.innerText = alertMessage;
                alertBox.style.display = "block";
            }

            // 온도를 화면에 표시 (현재 온도는 숫자만 크게 강조할 거라 단위를 바로 붙임)
            tempEl.innerHTML = `${Math.round(data.main.temp)}°C`;
            feelsLikeEl.innerHTML = `체감 온도: ${data.main.feels_like}°C`;
            tempMinEl.innerHTML = `최저 기온: ${data.main.temp_min}°C`;
            tempMaxEl.innerHTML = `최고 기온: ${data.main.temp_max}°C`;

            // ================== ✨ 체감 온도별 옷차림 가이드 ==================
            const feelsLikeTemp = data.main.feels_like;
            let clothingMessage = "";

            if (feelsLikeTemp >= 28) {
                clothingMessage = "👕 더운날씨네요.. 반팔과 반바지를 추천합니다!";
            } else if (feelsLikeTemp >= 25 && feelsLikeTemp < 28) {
                clothingMessage = "👕 신선한 날씨예요. 반팔 혹은 얇은 셔츠를 추천합니다!";
            } else if (feelsLikeTemp >= 20 && feelsLikeTemp < 25) {
                clothingMessage = "🧥 25도 아래라 쌀쌀할 수 있으니 가벼운 겉옷을 추천드려요!";
            } else if (feelsLikeTemp >= 15 && feelsLikeTemp < 20) {
                clothingMessage = "🧥 가벼운 자켓이나 가디건, 셔츠를 겹쳐 입으세요.";
            } else if (feelsLikeTemp >= 10 && feelsLikeTemp < 15) {
                clothingMessage = "🧥 쌀쌀한 날씨예요. 코트나 니트가 필요해요.";
            } else {
                clothingMessage = "❄️ 많이 추우니 패딩이나 두꺼운 코트를 입으세요!";
            }

            if (clothingBox) {
                clothingBox.innerText = clothingMessage;
                clothingBox.style.display = "block";
            }
        })
        .catch((error) => {
            console.error("데이터를 가져오는 중 에러 발생:", error);
            if (alertBox) {
                alertBox.innerText = "도시 이름을 확인해 주세요! ❌";
                alertBox.style.display = "block";
            }
            if (clothingBox) clothingBox.style.display = "none";
        });
}

function getWeatherUrl(city, key = API_KEY) {
    return `${BASE_URL}?q=${city}&appid=${key}&units=metric&lang=kr`;
}

window.onload = function () {
    getWeather(getWeatherUrl('seoul'));
};

function search() {
    const cityName = document.querySelector('#cityName').value;
    if (cityName.trim() === "") return;
    getWeather(getWeatherUrl(cityName));
    document.querySelector('#cityName').value = null;
}

const input = document.querySelector('#cityName');
input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        search();
    }
});