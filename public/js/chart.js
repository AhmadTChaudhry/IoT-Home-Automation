// Function to parse CSV data
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

// Function to aggregate data by week
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

// Function to create the chart
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

// Function to create the electricity usage chart
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

// Function to create the gas usage chart
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