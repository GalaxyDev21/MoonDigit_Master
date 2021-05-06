function searchTix(tix) {
    $.get('/robinhood/fundamentals/'+tix.split(":")[0], function(data) {
        $("#tixSearch").modal()
        document.getElementById("tixTitle").innerHTML = tix.split(":")[0];
        document.getElementById("tixDesc").innerHTML = data["description"].substring(0,900)+"...<b><i>(continued)</i></b>";    
        document.getElementById("tixCEO").innerHTML = data["ceo"];
        document.getElementById("tixFounded").innerHTML = data["year_founded"];
        document.getElementById("tixHQ").innerHTML = data["headquarters_city"]+", "+data["headquarters_state"];
        document.getElementById("tixHigh").innerHTML = data["high"];
        document.getElementById("tixLow").innerHTML = data["low"];
        document.getElementById("tix52Low").innerHTML = data["low_52_weeks"];
        document.getElementById("tix52High").innerHTML = data["high_52_weeks"];
    });
}