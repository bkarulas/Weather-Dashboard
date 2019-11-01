//Search the Current Weather for the city inputed
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
//The array is for every 3 hours, so we had to search for the 5 days at 12:00pm
  function searchFiveDays(cityId) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id="+cityId+"&appid=05e23075e882fced18dcc8b62be741f4&units=metric";
    $.ajax({
      url: queryURL,
      method: "GET"

    }).then(function(response) {
      var fullForcast = response.list;
      var day = moment().add(1,'days').format("YYYY-MM-DD") + " 12:00:00";
      var dayIndex = [];
      for (var i=0; i < 9; i++){
        //find the first day at 12:00pm and captures the array number
        if (day == fullForcast[i].dt_txt){
          var dayIndexNum = i;
        }
      }
      //Then grabs the next 5 days
      for (var c=0; c<5; c++){
        dayIndex.push(dayIndexNum);
        //12:00pm happens every 8th array element
        dayIndexNum += 8;
      }
      displayFiveDays(dayIndex, response.list);
    });
    $("<h2>Five Day Forcast</h2>").appendTo("#fiveDayTitle")
  }

  function displayFiveDays(dayIndex, response){
    for (var i=0; i< dayIndex.length; i++){
      num = dayIndex[i]
      var date = (response[num].dt_txt.split(" ")[0]);
      var img = response[num].weather[0].icon;
      var temp = response[num].main.temp;
      var humidity = response[num].main.humidity;
      $("#fiveDayDiv").attr("class","row").append(fiveDayBlock(date, img, temp, humidity));
    }
  }

  //function to create the Blocks for each day
  function fiveDayBlock(day, img, temp, hum){
    var dayBlock = $("<div>").attr("class","dayBlock col-2");
    dayBlock.append($("<label>").text(day), $("<img>").attr("src","https://openweathermap.org/img/wn/"+img+".png"), $("<p>").text("Temp: " + temp + "°C"), $("<p>").text("Humidity: "+ hum+"%"));
    return dayBlock;
}

  //Search Button
  $("#searchBtn").on("click", function(event) {
    event.preventDefault();
    var inputCity = $("#searchCity").val().trim(); 
    searchWeatherCurrent(inputCity);
  });

  //Search if press enter
  $("#searchCity").on("keypress", function(event){
    if(event.which == 13){
      var inputCity = $("#searchCity").val().trim(); 
      searchWeatherCurrent(inputCity);
    }
  });
