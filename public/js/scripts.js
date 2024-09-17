document.getElementById('toggleButton').addEventListener('click', function () {
    var button = document.getElementById('toggleButton');
    var icon = document.getElementById('lightbulbIcon');
    if (button.innerText === "Off") {
        button.innerText = "On";
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        icon.setAttribute('fill', 'Yellow');
    } else {
        button.innerText = "Off";
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        icon.setAttribute('fill', 'grey');
    }
});

document.getElementById('toggleButton2').addEventListener('click', function () {
    var button = document.getElementById('toggleButton2');
    var icon = document.getElementById('lightbulbIcon2');
    if (button.innerText === "Off") {
        button.innerText = "On";
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        icon.setAttribute('fill', 'Yellow');
    } else {
        button.innerText = "Off";
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        icon.setAttribute('fill', 'grey');
    }
});

document.getElementById('toggleButton3').addEventListener('click', function () {
    var button = document.getElementById('toggleButton3');
    var icon = document.getElementById('lightbulbIcon3');
    if (button.innerText === "Off") {
        button.innerText = "On";
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        icon.setAttribute('fill', 'Yellow');
    } else {
        button.innerText = "Off";
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        icon.setAttribute('fill', 'grey');
    }
});

document.getElementById('toggleButton4').addEventListener('click', function () {
    var button = document.getElementById('toggleButton4');
    var icon = document.getElementById('lightbulbIcon4');
    if (button.innerText === "Off") {
        button.innerText = "On";
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        icon.setAttribute('fill', 'Yellow');
    } else {
        button.innerText = "Off";
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        icon.setAttribute('fill', 'grey');
    }
});

document.getElementById('toggleButton5').addEventListener('click', function () {
    var button = document.getElementById('toggleButton5');
    var icon = document.getElementById('lightbulbIcon5');
    if (button.innerText === "Off") {
        button.innerText = "On";
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        icon.setAttribute('fill', 'Yellow');
    } else {
        button.innerText = "Off";
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        icon.setAttribute('fill', 'grey');
    }
});

document.getElementById('toggleButton6').addEventListener('click', function () {
    var button = document.getElementById('toggleButton6');
    var icon = document.getElementById('lightbulbIcon6');
    if (button.innerText === "Off") {
        button.innerText = "On";
        button.classList.remove('btn-primary');
        button.classList.add('btn-success');
        icon.setAttribute('fill', 'Yellow');
    } else {
        button.innerText = "Off";
        button.classList.remove('btn-success');
        button.classList.add('btn-primary');
        icon.setAttribute('fill', 'grey');
    }
});

// Fetch weather data from API
fetch('https://api.weatherapi.com/v1/current.json?key=382aee71609c41c497e144945241609&q=Melbourne')
    .then(response => response.json())
    .then(data => {
        document.getElementById('temperature').textContent = data.current.temp_c + "°C";
        document.getElementById('weather-condition').textContent = data.current.condition.text;
        document.getElementById('wind-speed').textContent = data.current.wind_kph + " km/h";

        document.getElementById('weather-icon').src = "https:" + data.current.condition.icon;
    })
    .catch(error => {
        console.log(error);
    });

// Temperature gauge
function drawTemperatureGauge(temperature) {
    const canvas = document.getElementById('temperatureGauge');
    const ctx = canvas.getContext('2d');
    const radius = (canvas.height / 2) * 0.9;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // outer circle
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#282626';
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ccc';
    ctx.stroke();

    // temperature arc
    const startAngle = 1.5 * Math.PI;
    const endAngle = startAngle + (temperature - 16) / (30 - 16) * 2 * Math.PI;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius - 10, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255, 99, 132, 1)';
    ctx.lineWidth = 10;
    ctx.stroke();

    // temperature text
    ctx.font = '28px Arial';
    ctx.fontWeight = 'bolder';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${temperature}°C`, canvas.width / 2, canvas.height / 2);
}

// Update the temperature value and gauge when slider is adjusted
document.getElementById('tempSlider').addEventListener('input', function () {
    const temperature = this.value;
    document.getElementById('tempValue').textContent = temperature;
    drawTemperatureGauge(temperature);
});

// Initialize the gauge with the default temperature
drawTemperatureGauge(22);
