// Parse CSV data
function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentLine[j];
        }
        result.push(obj);
    }
    return result;
}

// Aggregate data by week
function aggregateByWeek(data) {
    const weeklyData = {};
    data.forEach(row => {
        const date = new Date(row['Date']);
        const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() - 1) / 7)}`;
        if (!weeklyData[week]) {
            weeklyData[week] = { electricity: 0, gas: 0 };
        }
        weeklyData[week].electricity += parseFloat(row['Electricity Usage (kWh)']);
        weeklyData[week].gas += parseFloat(row['Gas Usage (m³)']);
    });
    return Object.keys(weeklyData).map(week => ({
        week,
        electricity: weeklyData[week].electricity,
        gas: weeklyData[week].gas
    }));
}

// Create chart
function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    const weeklyData = aggregateByWeek(data);
    const weeks = weeklyData.map(row => row.week);
    const electricityUsage = weeklyData.map(row => row.electricity);
    const gasUsage = weeklyData.map(row => row.gas);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: electricityUsage,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Gas Usage (m³)',
                    data: gasUsage,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'Week'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Usage'
                    }
                }
            }
        }
    });
}

// Create electricity usage chart
function createElectricityChart(data) {
    const ctx = document.getElementById('electricityChart').getContext('2d');
    const weeks = data.map(row => row.week);
    const electricityUsage = data.map(row => row.electricity);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Electricity Usage (kWh)',
                    data: electricityUsage,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'Week'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Electricity Usage (kWh)'
                    }
                }
            }
        }
    });
}

// Create gas usage chart
function createGasChart(data) {
    const ctx = document.getElementById('gasChart').getContext('2d');
    const weeks = data.map(row => row.week);
    const gasUsage = data.map(row => row.gas);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: weeks,
            datasets: [
                {
                    label: 'Gas Usage (m³)',
                    data: gasUsage,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: false,
                        text: 'Week'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Gas Usage (m³)'
                    }
                }
            }
        }
    });
}

// Fetch the CSV data and create the chart
fetch('/data/usage.csv')
    .then(response => response.text())
    .then(data => {
        const parsedData = parseCSV(data);
        const weeklyData = aggregateByWeek(parsedData);
        createChart(parsedData);
        createElectricityChart(weeklyData);
        createGasChart(weeklyData);
    })
    .catch(error => console.error('Error fetching the CSV data:', error));

// Electricity and Gas prices (in AUD)
const ELECTRICITY_PRICE = 0.25; // AUD per kWh
const GAS_PRICE = 0.1; // AUD per m³

// Variable to store the chart instance
let priceChartInstance = null;

// Calculate price based on usage
function calculatePrice(data) {
    return data.map(row => ({
        date: row['Date'],
        electricity: parseFloat(row['Electricity Usage (kWh)']),
        gas: parseFloat(row['Gas Usage (m³)']),
        electricityPrice: parseFloat(row['Electricity Usage (kWh)']) * ELECTRICITY_PRICE,
        gasPrice: parseFloat(row['Gas Usage (m³)']) * GAS_PRICE
    }));
}

// Filter data by date range
function filterDataByDateRange(data, startDate, endDate) {
    return data.filter(row => {
        const rowDate = new Date(row['Date']);
        return rowDate >= startDate && rowDate <= endDate;
    });
}

// Create the price chart and display total prices
function createPriceChart(data) {
    const ctx = $('#priceChart')[0].getContext('2d');
    const dates = data.map(row => row.date);
    const electricityPrice = data.map(row => row.electricityPrice);
    const gasPrice = data.map(row => row.gasPrice);

    // Calculate total prices
    const totalElectricityPrice = electricityPrice.reduce((acc, curr) => acc + curr, 0);
    const totalGasPrice = gasPrice.reduce((acc, curr) => acc + curr, 0);

    // Destroy the existing chart instance if it exists
    if (priceChartInstance) {
        priceChartInstance.destroy();
    }

    // Create a new chart instance
    priceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Electricity Price (AUD)',
                    data: electricityPrice,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Gas Price (AUD)',
                    data: gasPrice,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (AUD)'
                    }
                }
            }
        }
    });

    // Display the total electricity and gas prices on the page
    $('#totalPrice').html(`
        <p>Total Electricity Price: <strong>${totalElectricityPrice.toFixed(2)} AUD</strong></p>
        <p>Total Gas Price: <strong>${totalGasPrice.toFixed(2)} AUD</strong></p>
        <p>Total Combined Price: <strong>${(totalElectricityPrice + totalGasPrice).toFixed(2)} AUD</strong></p>
    `);
}


// Fetch data using jQuery AJAX
function fetchDataAndCreateChart(startDate, endDate) {
    $.ajax({
        url: '/data/usage.csv',
        method: 'GET',
        success: function (data) {

            const parsedData = parseCSV(data);
            const filteredData = filterDataByDateRange(parsedData, startDate, endDate);
            const calculatedData = calculatePrice(filteredData);
            createPriceChart(calculatedData);
        },
        error: function (error) {
            console.error('Error fetching the CSV data:', error);
        }
    });
}

// Use jQuery for form submission and filtering

$(document).ready(function () {

    $('#filterForm').submit(function (e) {
        e.preventDefault();

        const startDate = new Date($('#startDate').val());
        const endDate = new Date($('#endDate').val());

        fetchDataAndCreateChart(startDate, endDate);
    });
});
