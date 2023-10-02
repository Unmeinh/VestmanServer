const months = [];
const endDate = new Date(); // current date
const startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 5, 1);

let currentDate = new Date(startDate);

while (currentDate <= endDate) {
    console.log(currentDate.toISOString());
    console.log(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString());
    months.push(currentDate.toLocaleString('default', { month: '2-digit', year: 'numeric' }));
    currentDate.setMonth(currentDate.getMonth() + 1);
}

console.log(months);

var options = {
    series: [{
        name: 'Net Profit',
        data: [44, 57, 61, 63, 60, 66]
    }, {
        name: 'Revenue',
        data: [76, 85, 101, 87, 114, 94]
    }, {
        name: 'Free Cash Flow',
        data: [35, 36, 26, 45, 52, 41]
    }],
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: months,
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "$ " + val + " thousands"
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chartColumn"), options);
chart.render();