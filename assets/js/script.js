function searchWeatherCurrent(city) {
    console.log("City = "+ city);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=05e23075e882fced18dcc8b62be741f4";
    $.ajax({
      url: queryURL,
      method: "GET"

    }).then(function(response) {
      console.log("Current Day ",response);
      var temp = Math.round(response.main.temp);
      var cityName = $("<h2>").text(response.name + " ("+(moment().format('l')+")"));
      var cityTemp = $("<h6>").text("Temp:  "+temp+"°C");
      var cityHumidity = $("<h6>").text("Humidity:  "+response.main.humidity+"%");
      var cityWindSpeed = $("<h6>").text("Wind Speed:  "+response.wind.speed + "KPH");
      var cityUVIndex = $("<h6>").text("UV Index: ??????");

      $("#cityDiv").empty();
      $("#cityDiv").append(cityName, cityTemp, cityHumidity, cityWindSpeed, cityUVIndex);
    });
  }

  function searchWeatherFiveDays(city) {
    console.log("City = "+ city);
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&units=metric&cnt=5&appid=05e23075e882fced18dcc8b62be741f4";
    $.ajax({
      url: queryURL,
      method: "GET"

    }).then(function(response) {
      console.log("5 Days ",response);
      for (var i=0; i<5; i++){
          temp = 
      }

    });
  }


  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var inputCity = $("#searchCity").val().trim(); 
    searchWeatherCurrent(inputCity);
    searchWeatherFiveDays(inputCity);
    console.log("Inputcity = "+ inputCity);
  });