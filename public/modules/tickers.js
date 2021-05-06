/**
 * Set interval to push new data points periodically
 */
// set up the chart to update every 10 seconds

function generateChartDataETH() {
    var data = [];
    var day = 0;
    var firstDate = new Date();
    var chartData = [];
    for (day = 0; day < 50; day++) {
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + day);

        chartData.push({
            "date": newDate,
            "price": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        });
    }

    return chartData;
}

/**
 * Create the chart
 */
var chartETH = AmCharts.makeChart("ethChart", {
    "type": "serial",
    "theme": "light",
    "dataProvider": generateChartDataBTC(),
    "categoryField": "date",
    "categoryAxis": {
        "gridAlpha": 0,
        "axisAlpha": 0,
        "startOnAxis": true
    },
    "valueAxes": [{
        "gridAlpha": 0,
        "axisAlpha": 0
    }],
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "autoMargins": false,
    "marginLeft": 0,
    "marginRight": 5,
    "marginTop": 0,
    "marginBottom": 0,
    "graphs": [{
        "valueField": "price",
        "bulletField": "bullet",
        "lineColor": "#00B2FF"
    }]
});

/**
 * Set interval to push new data points periodically
 */
// set up the chart to update every second
setInterval(function () {
    var firstDate;
    var day;
    // normally you would load new datapoints here,
    // but we will just generate some random values
    // and remove the value from the beginning so that
    // we get nice sliding graph feeling

    // remove datapoint from the beginning
    chartETH.dataProvider.shift();
    $.get('/ticker/eth', function(data) {
        document.getElementById("ethPrice").innerHTML = String("$"+JSON.stringify(data["result"]["price"]["last"]));
        var change = String(Math.sign(JSON.stringify(data["result"]["price"]["change"]["absolute"])));
        if (change == "1") {
            document.getElementById("ethLabel").className = document.getElementById("ethLabel").className.replace("label label-danger", 'label label-success');            
        } else {
            document.getElementById("ethLabel").className = document.getElementById("ethLabel").className.replace("label label-success", 'label label-danger');
        }
        // add new one at the end
        day++;
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + day);
        chartETH.dataProvider.push({
            date: newDate,
            price: JSON.stringify(data["result"]["price"]["last"])
        });
        chartETH.validateData();
    });
    
}, 10000);


/**
 * Set interval to push new data points periodically
 */
// set up the chart to update every 10 seconds

function generateChartDataLTC() {
    var data = [];
    var day = 0;
    var firstDate = new Date();
    var chartData = [];
    for (day = 0; day < 50; day++) {
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + day);

        chartData.push({
            "date": newDate,
            "price": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        });
    }

    return chartData;
}

/**
 * Create the chart
 */
var chartLTC = AmCharts.makeChart("ltcChart", {
    "type": "serial",
    "theme": "light",
    "dataProvider": generateChartDataLTC(),
    "categoryField": "date",
    "categoryAxis": {
        "gridAlpha": 0,
        "axisAlpha": 0,
        "startOnAxis": true
    },
    "valueAxes": [{
        "gridAlpha": 0,
        "axisAlpha": 0
    }],
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "autoMargins": false,
    "marginLeft": 0,
    "marginRight": 5,
    "marginTop": 0,
    "marginBottom": 0,
    "graphs": [{
        "valueField": "price",
        "bulletField": "bullet",
        "lineColor": "#00B2FF"
    }]
});

/**
 * Set interval to push new data points periodically
 */
// set up the chart to update every second
setInterval(function () {
    var firstDate;
    var day;
    // normally you would load new datapoints here,
    // but we will just generate some random values
    // and remove the value from the beginning so that
    // we get nice sliding graph feeling

    // remove datapoint from the beginning
    chartLTC.dataProvider.shift();
    $.get('/ticker/ltc', function(data) {
        document.getElementById("ltcPrice").innerHTML = String("$"+JSON.stringify(data["result"]["price"]["last"]));
        var change = String(Math.sign(JSON.stringify(data["result"]["price"]["change"]["absolute"])));
        if (change == "1") {
            document.getElementById("ltcLabel").className = document.getElementById("ltcLabel").className.replace("label label-danger", 'label label-success');            
        } else {
            document.getElementById("ltcLabel").className = document.getElementById("ltcLabel").className.replace("label label-success", 'label label-danger');
        }
        // add new one at the end
        day++;
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + day);
        chartLTC.dataProvider.push({
            date: newDate,
            price: JSON.stringify(data["result"]["price"]["last"])
        });
        chartLTC.validateData();
    });
    
}, 10000);

/**
 * Set interval to push new data points periodically
 */
// set up the chart to update every 10 seconds

function generateChartDataBTC() {
    var data = [];
    var day = 0;
    var firstDate = new Date();
    var chartData = [];
    for (day = 0; day < 50; day++) {
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + day);

        chartData.push({
            "date": newDate,
            "price": [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        });
    }

    return chartData;
}

/**
 * Create the chart
 */
var chartBTC = AmCharts.makeChart("btcChart", {
    "type": "serial",
    "theme": "light",
    "dataProvider": generateChartDataBTC(),
    "categoryField": "date",
    "categoryAxis": {
        "gridAlpha": 0,
        "axisAlpha": 0,
        "startOnAxis": true
    },
    "valueAxes": [{
        "gridAlpha": 0,
        "axisAlpha": 0
    }],
    "chartCursor": {
        "cursorPosition": "mouse"
    },
    "autoMargins": false,
    "marginLeft": 0,
    "marginRight": 5,
    "marginTop": 0,
    "marginBottom": 0,
    "graphs": [{
        "valueField": "price",
        "bulletField": "bullet",
        "lineColor": "#00B2FF"
    }]
});

/**
 * Set interval to push new data points periodically
 */
// set up the chart to update every second
setInterval(function () {
    var day;
    var firstDate;
    // normally you would load new datapoints here,
    // but we will just generate some random values
    // and remove the value from the beginning so that
    // we get nice sliding graph feeling

    // remove datapoint from the beginning
    chartBTC.dataProvider.shift();
    $.get('/ticker/btc', function(data) {
        document.getElementById("btcPrice").innerHTML = String("$"+JSON.stringify(data["result"]["price"]["last"]));
        var change = String(Math.sign(JSON.stringify(data["result"]["price"]["change"]["absolute"])));
        if (change == "1") {
            document.getElementById("btcLabel").className = document.getElementById("btcLabel").className.replace("label label-danger", 'label label-success');
        } else if (change = "-1") {
            document.getElementById("btcLabel").className = document.getElementById("btcLabel").className.replace("label label-success", 'label label-danger');
        }
        // add new one at the end
        day++;
        var newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + day);
        chartBTC.dataProvider.push({
            date: newDate,
            price: JSON.stringify(data["result"]["price"]["last"])
        });
        chartBTC.validateData();
    });
    
}, 10000);