

function searchWeatherCurrent(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=05e23075e882fced18dcc8b62be741f4";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      //current day
      var today = moment().format('l');
      //icon number
      var imgNum = response.weather[0].icon;
      //icon
      var img = $("<img>").attr("src","https://openweathermap.org/img/wn/"+imgNum+".png");
      //rounds the temp
      var temp = Math.round(response.main.temp);
      var cityName = $("<h2>").text(response.name + " ("+today+") ").append(img);
      var cityTemp = $("<h6>").text("Temp:  "+temp+"°C");
      var cityHumidity = $("<h6>").text("Humidity:  "+response.main.humidity+"%");
      var cityWindSpeed = $("<h6>").text("Wind Speed:  "+response.wind.speed + "KPH");
      //calls the functon for the UV index
      searchUVIndex(response.coord.lon, response.coord.lat);
      $("#cityDiv").empty();
      $("#cityDiv").append(cityName, cityTemp, cityHumidity, cityWindSpeed);
      //calls the function for the 5 dya forcast
      searchFiveDays(response.id);
    });
  }

  //UV Index Function
  function searchUVIndex (lon, lat){
      var queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid=05e23075e882fced18dcc8b62be741f4&lat="+lat+"&lon="+lon
      $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
          //gets the UVIndex
          uvIndex = response.value;
          var cityUVIndex = $("<h6>").text("UV Index: "+uvIndex);
          $("#uvDiv").empty();
          $("#uvDiv").append(cityUVIndex);
      });
  }

//Five Day Forcast
  function searchFiveDays(cityId) {
    console.log("City ID= "+ cityId);
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid=05e23075e882fced18dcc8b62be741f4&units=metric";
    $.ajax({
      url: queryURL,
      method: "GET"

    }).then(function(response) {
      var fullForcast = response.list;
      console.log(fullForcast);
      var day = moment().add(1,'days').format("YYYY-MM-DD") + " 12:00:00";
      var dayIndex = [];
      for (var i=0; i < 9; i++){
        if (day == fullForcast[i].dt_txt){
          console.log("This is true at index: ",i);
          var dayIndexNum = i;
          for (var c=0; c<5; c++){
            dayIndex.push(dayIndexNum);
            dayIndexNum += 8;
          }//for with c
        }//if
      }//for with i
      displayFiveDays(dayIndex, response.list);
    });//then
  }

  function displayFiveDays(dayIndex, response){
    console.log("NEW RESPONCE", response);
    for (var i=0; i< dayIndex.length; i++){
      num = dayIndex[i]
      console.log(num);
      var date = (response[num].dt_txt.split(" ")[0]);
      var img = response[num].weather[0].icon;
      var temp = response[num].main.temp;
      var humidity = response[num].main.humidity;
      console.log(date, img, temp, humidity);
      $("#fiveDayDiv").append(fiveDayCard(date, img, temp, humidity));
    }
 
  }

  //function to create the card
  function fiveDayCard(day, img, temp, hum){
    var dayCard = $("<div>").attr("class","dayCard col-2");    
    dayCard.append($("<label>").text(day), $("<img>").attr("src","https://openweathermap.org/img/wn/"+img+".png"), $("<p>").text("Temp: " + temp + "°C"), $("<p>").text("Humidity: "+ hum+"%"));

    return dayCard;
}

  //Search Button
  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var inputCity = $("#searchCity").val().trim(); 
    searchWeatherCurrent(inputCity);
    
    //searchWeatherFiveDays(inputCity);
    console.log("Inputcity = "+ inputCity);
  });