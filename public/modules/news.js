function getNews() {
    $.get('/news/bloomberg', function(data) {
        $("#articleImage1").attr("src",data["articles"][0]["urlToImage"]);
        $("#articleImage2").attr("src",data["articles"][1]["urlToImage"]);
        $("#articleImage3").attr("src",data["articles"][2]["urlToImage"]);
        $("#articleImage4").attr("src",data["articles"][3]["urlToImage"]);
        document.getElementById("articleTitle1").innerHTML = data["articles"][0]["title"];
        document.getElementById("articleTitle2").innerHTML = data["articles"][1]["title"];
        document.getElementById("articleTitle3").innerHTML = data["articles"][2]["title"];
        document.getElementById("articleTitle4").innerHTML = data["articles"][3]["title"];
    });
}