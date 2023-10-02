var months = document.currentScript.getAttribute('months');
months = JSON.parse(months)

var options = {
    title: {
        text: 'Number of customers by month',
        align: 'left',
        style: {
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: 'Arial, Helvetica, sans-serif',
            color: '#263238'
        },
    },
    colors: [
        'rgb(255, 215, 0)'
    ],
    series: [{
        name: "Customer",
        data: [10, 41, 35, 51, 49, 62]
    }],
    chart: {
        height: 350,
        type: 'line',
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'straight'
    },
    grid: {
        row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
        },
    },
    xaxis: {
        categories: months
    }
};

var chart = new ApexCharts(document.querySelector("#lineChart"), options);
chart.render();