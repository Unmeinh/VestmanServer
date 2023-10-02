var listProduct = document.currentScript.getAttribute('products');
listProduct = JSON.parse(listProduct)
let quantitySolds = [];
let names = [];
for (let i = 0; i < listProduct.length; i++) {
    const p = listProduct[i];
    quantitySolds.push(p.quantitySold);
    names.push(p.name_product);
}

var options = {
    series: [{
        data: quantitySolds
    }],
    chart: {
        type: 'bar',
        height: names.length * 70
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: true
    },
    xaxis: {
        categories: names,
    }
};

var chart = new ApexCharts(document.querySelector("#chartBar"), options);
chart.render();