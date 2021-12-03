"use strict"
//color variables for chart
let maincolor = '#212121'

let fahrenheit_factorial;
let fahrenheit_multiple;
let temp_symbol;


unit_converter('c')




// Global letiables
const openWeatherapi = '11ef10ae8365daf4d40f72cb0bab30ad';
//const weatherbitapi = '1a2afe170f33471f93d89f73c1f45558'
//Fetch auto location
let user_location = {};
function unit_converter(para){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    alert("Geolocation is not supported by this browser.");
  }

    if(para === 'c'){
      fahrenheit_factorial = 273.15;
      fahrenheit_multiple = 1
      temp_symbol = '°c';
    }else{
      fahrenheit_factorial = 459.67;
      fahrenheit_multiple = 1.8
      temp_symbol = '°F'
  }
 

  function showPosition(position) {
    
    user_location.lat = position.coords.latitude;
    user_location.lon = position.coords.longitude

    oneCall(user_location.lat, user_location.lon) //Current and Daily data
    windy_api(user_location.lat,user_location.lon) // Radar Data
    pollution_forecast_call(user_location.lat,user_location.lon); // Air Quality Data

    /// Reverse GeoDecoding for displaying name in section 2/////
   // geoDecoding_reverse(user_location.lat, user_location.lon)
    covid_data_func(`${user_location.lon},${user_location.lat}`, true)
    
  }
}

//Onecall Function for current and daily data =>

function oneCall(parameter1, parameter2){
    fetch('https://api.openweathermap.org/data/2.5/' + 'onecall' + '?lat=' + parameter1 + '&lon='+ parameter2 +'&appid=' + openWeatherapi)
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      //Display date on section 2 top corner
      document.getElementById('today_date_sec2').innerHTML = unix_convert(json.current.dt, true)

      //Display icon
      document.getElementById('img_data_sec2').src = `current_icons/${json.current.weather[0].icon}.png`
      
      //Function letiables
        let hourlyTemp = [];
        let hourly_temp_time = [];
        for(let i=0;i<18;i++){
          hourly_temp_time.push(unix_convert(json.hourly[i].dt));
         ( hourlyTemp.push(Math.round(json.hourly[i].temp * fahrenheit_multiple)-  fahrenheit_factorial))
        }
       
console.log(json)
     
        
      //Manipulate section 2 row values
        document.getElementById('today_temp').innerHTML =  Math.round((json.current.temp * fahrenheit_multiple) -fahrenheit_factorial) + `<sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('max_temp_r1').innerHTML = `${Math.round((json.daily[0].temp.max * fahrenheit_multiple) - fahrenheit_factorial) } <sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('min_temp_r1').innerHTML = Math.round((json.daily[0].temp.min * fahrenheit_multiple) - fahrenheit_factorial) + `<sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('feels_like_r2').innerHTML = Math.round((json.current.feels_like * fahrenheit_multiple) -fahrenheit_factorial) + `<sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('humidity_r2').innerHTML = Math.round(json.current.humidity) + '%'


        document.getElementById('max_temp_r1_1').innerHTML = `${Math.round((json.daily[0].temp.max * fahrenheit_multiple) - fahrenheit_factorial) } <sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('min_temp_r1_1').innerHTML = Math.round((json.daily[0].temp.min * fahrenheit_multiple) - fahrenheit_factorial) + `<sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('feels_like_r2_1').innerHTML = Math.round((json.current.feels_like * fahrenheit_multiple) -fahrenheit_factorial) + `<sup class="symbol">${temp_symbol}</sup>`;
        document.getElementById('humidity_r2_1').innerHTML = Math.round(json.current.humidity) + '%'
       
       
       //main weather details feeding
       document.getElementById('weatherdetails_data_main').innerHTML =`
       <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-sunrise-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Sunrise</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${unix_convert(json.current.sunrise)}</p></div>
                            <div class="propertyname2"><p class="propertyname_para">Sunrise</p></div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-sunset-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Sunset</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${unix_convert(json.current.sunset)}</p></div>
                            <div class="propertyname2"><p class="propertyname_para">Sunset</p></div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-humidity-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Humidity</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${json.current.humidity}<span class ='data_units'>%</span></p></div>
                            <div class="propertyname2"><p class="propertyname_para">Humidity</p></div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-wind-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Windspeed</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${Math.round(json.current.wind_speed * 3.6 *10)/10}<span class ='data_units'>K/h</span></p></div>
                            <div class="propertyname2"><p class="propertyname_para">Wind</p></div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-pressure-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Pressure</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${Math.round(json.current.pressure * 0.0009869233)}<span class ='data_units'>atm</span></p></div>
                            <div class="propertyname2"><p class="propertyname_para">Pressure</p></div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-ozone-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">UVI</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${json.current.uvi}</p></div>
                            <div class="propertyname2"><p class="propertyname_para">UVI</p></div>
                        </div>
                    </div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-cloud-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Cloud%</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${json.current.clouds}<span class ='data_units'>%</span></p></div>
                            <div class="propertyname2"><p class="propertyname_para">Cloud</p></div>
                        </div>
                    </div>
                    <div class="info_content">
                       
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-dew-point-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Dew point </p></div>
                            <div class="tooltip" id="deskver"><i class="fa fa-info-circle"></i>
                                <span class="tooltiptext">The dew point is the temperature to which air must be cooled to become saturated with water vapor</span>
                              </div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${Math.round(((json.current.dew_point * fahrenheit_multiple) - fahrenheit_factorial)*10)/10}<span class ='data_units'><sup>${temp_symbol}</sup></span></p></div>
                            <div class="propertyname2"><p class="propertyname_para">Dewpoint</p>  <div class="tooltip"><i class="fa fa-info-circle"></i>
                                <span class="tooltiptext">The dew point is the temperature to which air must be cooled to become saturated with water vapor</span>
                              </div></div>
                          
                        </div>
                    </div></div>
                    <div class="box">
                        <div class="icon">
                            <img class="icon_img" src="icon_white/icons8-view-50.png" alt="Cloudy">
                            <div class="propertyname1"><p class="propertyname_para">Visibility</p></div>
                        </div>
                        <div class="textcontent">
                            <div class="contentvalue"><p class="contentvalue_para">${json.current.visibility/1000}<span class ='data_units'>Km</span></p></div>
                            <div class="propertyname2"><p class="propertyname_para">Visibility</p></div>
                        </div>
                    </div>
       
       `
        
      //For next 7 days of week from current date
        let weekDays =[];
        let dailyTemp = [];
        let weekday_for_bar = [];
        
        for(let y=0;y<7;y++){

       //For Weekly day and data dynamic manipulation
          let date = new Date();
          date.setDate(date.getDate() + y);
          //object to string
          let string_converted_date = date.toString();
          weekDays.push(string_converted_date.split(' ')[0])


          
          //Days for bar chart
          weekday_for_bar.push(weekDays[y])

          //For daily temp forecast
          dailyTemp.push(Math.round((json.daily[y].temp.day * fahrenheit_multiple) -  fahrenheit_factorial));

          //Changing accordian Days dynamically
          document.getElementById(`week_day_DOM${y+1}`).innerHTML =  weekDays[y]
          
          //Changing accordion data
          document.getElementById(`day_data${y+1}`).innerHTML = ` 

          <div class="short_data_acc">
            <div class="short_data_row1">
              <p>Min Temp: <span id="min_temp_sd_r1">${Math.round((json.daily[y].temp.min * fahrenheit_multiple) - fahrenheit_factorial)+ `<sup class="symbol">${temp_symbol}</sup>`}</span> 
              <p>Feels Like: <span id="feels_like_sd_r1">${Math.round((json.daily[y].feels_like.day * fahrenheit_multiple) - fahrenheit_factorial)+ `<sup class="symbol">${temp_symbol}</sup>`}</span></p>
              <p>Rain%:  <span id="rain_sd_r1" >${Math.round(json.daily[y].pop*100) + `%`}</span></p>
              <p class="hide">Sunrise : <span id="sunrise_sd_r1" >${unix_convert(json.daily[y].sunrise)}</span></p>
              
              
          </div>
          <div class="short_data_row2">
              <p>Max Temp:  <span id="max_temp_sd_r2">${Math.round((json.daily[y].temp.max * fahrenheit_multiple) - fahrenheit_factorial)+ `<sup class="symbol">${temp_symbol}</sup>`}</span></p>
              <p>Humidity:  <span id="humidity_sd_r2">${json.daily[y].humidity}</span></p>
              <p>UVI: <span id="uvi_sd_r2">${json.daily[y].uvi}</span></p>
              <p class="hide">Sunset: ${'&nbsp &nbsp &nbsp'}  <span id="sunset_sd_r2">${unix_convert(json.daily[y].sunset)}</span></p>
          </div>
      </div>`
        }

        //  Generating bar chart
        genChart(dailyTemp, weekday_for_bar, 'bar', 'dailyTempChart', true)
  

//////////OLd code to display next 18 hours in hourly graph /////////////
//          //For next 18 hours from current time
//            let next_18_hours = []
//              for(let i=0; i<18;i++){
//                let date = new Date();
//                let time = date.getHours() + i;
//                 next_18_hours.push(time)
//                 console.log(new Date())
//              }
//
//              console.log(next_18_hours)
//
//          //  This function is to remove time above 24 hour
//                 let next_18_hours_consolidated = [];
//                 next_18_hours.forEach(function(time){
//                   if(time < 24){
//                     next_18_hours_consolidated.push(time);
//                  }else if(time >= 24){
//                    //Above 24 hour time
//                      next_18_hours_consolidated.push(time - 24)
//                   }else{
//                     console.log('Nothing Happen')
//                   }
//                 })
//  ////////////////////////////////////////////////////////////////////////////



        //Generating hourly forecast [18 hr]
         genChart(hourlyTemp, hourly_temp_time , 'line', 'hourlyTempChart', false)
          
    }); 
        //Generate doughnut chart
         air_pollution_data_array(parameter1,parameter2) 
         
}

////////////////////////////////Functions///////////////////////////////


     ///Air poLUTTION ARRAY
     function air_pollution_data_array(parameter1,parameter2){
      //Array of all pollutants
      const air_comp = [
        /* 'Carbon monoxide (CO)',
        'Nitrogen monoxide (NO)', 
        'Nitrogen dioxide (NO2)',*/ 
        'Ozone (O3)',
        'PM10',
        'PM2.5',
        'Sulphur dioxide (SO2)',
        'Ammonia (NH3)'
      ];
      //Array of concentration
          let air_comp_val = [];
          
           fetch('https://api.openweathermap.org/data/2.5/air_pollution?lat='+ parameter1 +'&lon='+ parameter2 +'&appid='+ openWeatherapi)
                //Old one=>     fetch('https://api.weatherbit.io/v2.0/current/airquality?lat='+ parameter1 +'&lon='+ parameter2 +'&key='+ weatherbitapi)
              .then(function(response) {
                return response.json();
              })
              .then(function(json) {
               
                let json_let = json.list[0].components
                //Old one let json_let = json.data[0]
                air_comp_val.push(
                 // json_let.co,
                 // json_let.no,
                  //json_let.no2,
                  json_let.o3,
                  json_let.pm10,
                  json_let.pm2_5,
                  json_let.so2,
                  json_let.nh3,
                
                  
                  );
          
          
                  gen_doughchart(air_comp,air_comp_val,"airquality_compo")
                  console.log(json);

                  let air_quality_content = document.getElementById('airquality_content_id');
                  let aqi_index = json.list[0].main.aqi;
                  console.log(aqi_index)

                  if(aqi_index === 1){
                    air_quality_content.innerHTML = `
                    <h4>Good</h4>
                    <p> The air is clear—perfect for outdoor activities! 
                    Pollution levels are under the recommended exposure thresholds set by the World Health Organization (WHO) 
                    for one year of pollution exposure.</p>
                    <br><h6>Based on Current Pollutants*</p>
                    `
                  }else if(aqi_index === 2){
                    air_quality_content.innerHTML = `
                    <h4>Fair</h4>
                    <p> Air quality is considered acceptable, though over the recommended WHO threshold for one year.
                    This means that, unless you have these kinds of conditions all year round, you shouldn't be experiencing adverse health effects.
                     However, there may be certain health concerns for people with specific sensitivities.
                      Always consult your physician!</p>
                    <br><h6>Based on Current Pollutants*</p>
                   
                    `
                  }else if(aqi_index === 3){
                    air_quality_content.innerHTML = `
                    <h4>Moderate</h4>
                    <p> The air is highly polluted—above twenty-four-hour exposure recommendations from the World Health Organisation. 
                    Everyone may start to feel adverse health effects, and those with sensitivities should take care when performing outdoor activities.
                   </p>
                    <br><h6>Based on Current Pollutants*</p>
                    `
                  }else if(aqi_index === 4){
                    air_quality_content.innerHTML  =`
                    <h4>Poor</h4>
                    <p> Everyone may start to experience more serious health effects at these levels, and long term exposure constitutes a real health risk.
                    Levels have exceeded the recommended WHO exposure threshold for one hour.
                   </p>
                    <br><h6>Based on Current Pollutants*</p>
                    
                     `
                  }else if(aqi_index === 5){
                    air_quality_content.innerHTML  =`
                    <h4>Very Poor</h4>
                    <p> Everyone may start to experience more serious health effects at these levels, and long term exposure constitutes a real health risk.
                    Levels have exceeded the recommended WHO exposure threshold for one hour.
                   </p>
                    <br><h6>Based on Current Pollutants*</p>
                    
                     `
                  }
          
            });
        }

        
    /////To generate Dough Chart
       function gen_doughchart(parameter1,parameter2,parameter3){
        let ctx = document.getElementById(parameter3).getContext("2d");
      
        let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
gradientStroke.addColorStop(0, '#fc575e');
gradientStroke.addColorStop(1, '#f7b42c');

//let gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
let gradientFill = ctx.createLinearGradient(0,500,0,100);
gradientFill.addColorStop(1, "rgba(252, 87, 95, 0.7)");
gradientFill.addColorStop(0, "rgba(247, 180, 44, 0.8)");

          
             let xValues = parameter1;
             let yValues = parameter2;
             let barColors = [
                      
              gradientFill,
              gradientFill,
              gradientFill,
              gradientFill,
              gradientFill,
            
              
             // 'rgba(55, 178, 247, 0.1)',
             // 'rgba(55, 178, 247, 0.3)',
             // 'rgba(55, 178, 247, 0.5)',
             // 'rgba(55, 178, 247, 0.7)',
             // 'rgba(55, 178, 247, 0.9)'
             ];
             
             //rgb(247,179,45)
             //rgb(249,140,65)
             //rgb(250,121,76)
             //rgb(252,90,92)
             //rgb(253,87,95)

             let xyz = new Chart(ctx, {
               type: "doughnut",
               data: {
                 labels: xValues,
                 datasets: [{
                   backgroundColor: barColors,
                   borderColor: gradientStroke,
                   data: yValues
                 }]
               },
               options: {
                 title: {
                   display: true,
                 },
                 legend: {
                   display: true,
                   position: 'right',
                   align: 'middle',
                   labels: {
                     boxWidth: 15,
                     fontSize: 18,
                   
                     generateLabels: function (chart) {
                       let data = chart.data;
                       if (data.labels.length && data.datasets.length) {
                           return data.labels.map(function (label, i) {
                               let meta = chart.getDatasetMeta(0);
                               let ds = data.datasets[0];
                               let arc = meta.data[i];
                               let custom = arc && arc.custom || {};
                               let getValueAtIndexOrDefault = Chart.helpers.getValueAtIndexOrDefault;
                               let arcOpts = chart.options.elements.arc;
                               let fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
                               let stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
                               let bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);
             
                           
                               let value = chart.config.data.datasets[arc._datasetIndex].data[arc._index];
             
                               return {
                                 
                                   text: label + " : " + value + ' μg/m3',
                                   fillStyle: fill,
                                   strokeStyle: stroke,
                                   lineWidth: bw,
                                   hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                   index: i
                               };
                           });
                       } else {
                           return [];
                       }
                   }
                   }
                 },
                 plugins: {
                   datalabels: {
                       display: false,
                   },
               }
               
               }
               
             });
             xyz.update();  
             if (window.matchMedia("(max-width: 768px)").matches) {
               xyz.options.legend.position = 'bottom';
               xyz.options.legend.labels.fontSize = 12;
               xyz.update();
             }
          xyz.clear()
      }

    /////For reverse geo decoding

    ///////For User Manual Search

    

    document.body.addEventListener('keydown',function(e){
       if(e.code === 'Enter'){
          btnclicked()
       }
    });
    document.getElementById('close_popup').addEventListener('click',function(e){
      document.getElementById('popup').style.display='none'
    })
    
      function btnclicked(){
        let search1 = document.getElementById('place').value
        let search2 = document.getElementById('place2').value
    
        let user_input_city;
        if( search2 === ''){
          user_input_city = search1
        }else{
          user_input_city =  search2
        }
    
        covid_data_func(user_input_city)
        

        ////To get user lat and long from string
        fetch('https://api.openweathermap.org/geo/1.0/' + 'direct' + '?q=' + user_input_city +  '&appid=' + openWeatherapi)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          console.log(json)
     //https://api.mapbox.com/geocoding/v5/mapbox.places/newyork.json?access_token=pk.eyJ1IjoiYXNzc3Nzc3Nzc3Nzc3MiLCJhIjoiY2t3Z3JtdGJtMDg5ZDJxb3cyNjZiM3IwOCJ9.iw12YCJIds8snJUnN_Sa5Q

          document.getElementById('s_c').innerHTML = json[0].name + ',&nbsp'+json[0].country; ///To change section 2 Place name
          oneCall(json[0].lat,json[0].lon ); ///To get current a daily data 
          windy_api(json[0].lat, json[0].lon); ///For radar
          pollution_forecast_call(json[0].lat, json[0].lon);  ///For pollution data
          document.getElementById('popup').style.display='none'
        })
        .catch((err) => {
          console.log('Error:', err.name);
          console.log(typeof(err.stack))

          if(err.name === 'TypeError'){
            document.getElementById('sec11').addEventListener('mousedown',function(e){
              console.log(e.button)
              if(e.button === 0){
                document.getElementById('popup').style.display='none'
              }
            })
            document.getElementById('popup').style.display='block'
            document.getElementById('popup-content').innerHTML=`
            <p class='popup-content-err-message'>Can't find any result for the query,<span> ${search1}${search2}</span></p>
            <p class = 'popup-content-try-again'>Please check the input query and try again</p>

            `
          
          }
    
        
        });
        
      }

    

    /////To genrate both bar and line chart
     function genChart(parameter1, parameter2,parameter3,parameter4,parameter5){

        let ctx = document.getElementById(parameter4).getContext("2d");
      
        let gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
gradientStroke.addColorStop(0, '#fc575e');
gradientStroke.addColorStop(1, '#f7b42c');

//let gradientFill = ctx.createLinearGradient(500, 0, 100, 0);
let gradientFill = ctx.createLinearGradient(0,500,0,100);
gradientFill.addColorStop(1, "rgba(252, 87, 95, 0.6)");
gradientFill.addColorStop(0, "rgba(247, 180, 44, 0.8)");

        
        let xValues = parameter2 //['Mon','Tue','wed','Thu','Fri','Sat','Sun','Mon','Tue','wed','Thu','Fri','Mon','Tue','wed','Thu','Fri','Sat'];
        let yValues = parameter1
        
        new Chart(ctx, { ///For chart id
          type: parameter3,
          data: {
            labels: xValues,
            datasets: [{
              borderColor: gradientStroke,
              pointBorderColor: gradientStroke,
              pointBackgroundColor: gradientStroke,
              pointHoverBackgroundColor: gradientStroke,
              pointHoverBorderColor: gradientStroke,
              pointBorderWidth: 8,
              pointHoverRadius: 15,
              pointHoverBorderWidth: 1,
              pointRadius: 1,
              fill: true,
             backgroundColor: gradientFill,
              borderWidth: 3,
              data: yValues
            },

          
          ]
          },
        
          options: {
            legend: {display: false},
            scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true,
                   
                },
                gridLines: {
                  color: "rgba(255,255,255,0.1)",
                  zeroLineColor: "rgba(255,255,255,1)",
          
                  
                }

            }],

            xAxes: [{
              gridLines: {
                zeroLineColor: "rgba(255,255,255,1)",
                color: "rgba(255,255,255,0.1)",
                 
              },
              ticks: {
                
              }
          }]
              
            },
            plugins: {
              datalabels: {
                  display: parameter5
              },
          }
          }
        });
    }
      

    ///Unix to normal time converter function 
    function unix_convert(time, parameter2){
      let unix_timestamp = time
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let date = new Date(unix_timestamp * 1000);
      // Hours part from the timestamp
      let hours = date.getHours();
      // Minutes part from the timestamp
      let minutes = "0" + date.getMinutes();
      // Seconds part from the timestamp
      //let seconds = "0" + date.getSeconds();
      
    
      const string_converted = date.toString().split(" ")
      
      if(parameter2){
        let formattedTime =  string_converted[0] + ','+' '+ string_converted[1] + ' '+ string_converted[2] //+ ' '+ hours + ':' + minutes.substr(-2)// + ':' + seconds.substr(-2);
        return formattedTime
      }else{
        let formattedTime =  hours + ':' + minutes.substr(-2)// + ':' + seconds.substr(-2);
        return formattedTime
      }
    }


    ////For Pollution Forecast data     
      function pollution_forecast_call(parameter1,parameter2){
       fetch('https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=' + parameter1 + '&lon='+ parameter2 +  '&appid=' + openWeatherapi)
       //Old one =>  fetch('https://api.weatherbit.io/v2.0/forecast/airquality?lat=' + parameter1 + '&lon='+ parameter2 +  '&key=' + weatherbitapi)
       .then(function(response) {
         return response.json();
       })
       .then(function(json) {


        console.log(json)

         let eight_hr_time = [];
         let air_fore_co =[];
         let air_fore_o3 =[];
         let air_fore_pm2_5 =[];
         let air_fore_pm10 =[];
         let air_fore_SO2 =[];
         let air_fore_NH3 =[];

         
        

         'Ozone (O3)',
        'PM10',
        'PM2.5',
        'Sulphur dioxide (SO2)',
        'Ammonia (NH3)'
       
       //For 6 hour inteval in data
         for(let u=0;u<10;u++){
           let i = u*4

            eight_hr_time.push(unix_convert(json.list[i].dt))
            air_fore_co.push(json.list[i].components.co/10)
            air_fore_o3.push(json.list[i].components.o3)
            air_fore_pm2_5.push(json.list[i].components.pm2_5)
            air_fore_pm10.push(json.list[i].components.pm10);
            air_fore_SO2.push(json.list[i].components.so2);
            air_fore_NH3.push(json.list[i].components.nh3);



            //Old one = >
           // eight_hr_time.push(unix_convert(json.data[i].ts))
           // air_fore_co.push(json.data[i].co/10)
           // air_fore_o3.push(json.data[i].o3)
           // air_fore_pm2_5.push(json.data[i].pm25)
           // air_fore_pm10.push(json.data[i].pm10);

           
         }
         //To call function to generate pollution chart
         gen_chart_airquality_multi(eight_hr_time,  air_fore_o3 ,air_fore_pm10 , air_fore_pm2_5, air_fore_SO2 ,air_fore_NH3)
       });
    }

    ///For pollution chart generation
     function gen_chart_airquality_multi(parameter1,parameter2,parameter3,parameter4){
         let xValues = parameter1;
         let abc =  new Chart("airquality_multi", {
           type: "line",
           data: {
             labels: xValues,
             datasets: [ { 
               data: parameter2,
               label: 'Ozone o3',

               borderColor: "rgba(256, 256, 256, 0.8)",
               fill: false
             },{ 
               data: parameter3,
               label: 'PM 10',
               borderColor: "rgba(252, 87, 95, 0.8)",
               fill: false
             }, { 
               data: parameter4,
               label: 'PM 2.5',
               borderColor: "rgba(247, 180, 44, 0.9)",
               fill: false
             }
             
           ]
           },
           options: {
             legend: {
               display: true,
               labels: {
                 boxWidth: 15,
                 fontSize: 15,
               }
             },

             scales: {
              yAxes: [{
                ticks: {
                    beginAtZero: true,
                   
                },
                gridLines: {
                  color: "rgba(255,255,255,0.1)",
                  zeroLineColor: "rgba(255,255,255,1)",
          
                  
                }

            }],

            xAxes: [{
              gridLines: {
                zeroLineColor: "rgba(255,255,255,1)",
                color: "rgba(255,255,255,0.1)",
                 
              },
              ticks: {
                
              }
          }]
              
            },
           },
         });

        ///To make it responsive in mobile
         if (window.matchMedia("(max-width: 768px)").matches) {
           abc.options.legend.position = 'bottom';
           abc.options.legend.labels.fontSize = 10;
           abc.update();
         }

         abc.clear();
    }

    ///Windy Radar
     function windy_api(parameter1,parameter2){


        //*****[NEED TO CHANGED IN FUTURE] ,to replace hard code with 
        //      already created function 'geoDecoding_reverse' 
        fetch('https://api.openweathermap.org/geo/1.0/' + 'reverse' + '?lat=' + parameter1 + '&lon='+ parameter2 +  '&appid=' + openWeatherapi)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
               // Initialize Windy API
          windyInit(options, windyAPI => {
           // windyAPI is ready, and contain 'map', 'store',
           // 'picker' and other usefull stuff
       
           const { map } = windyAPI;
           // .map is instance of Leaflet map
       
            L.popup()
             .setLatLng([parameter1, parameter2])
             .setContent(json[0].local_names.en)
             .openOn(map);
               });
          });
       
         ////////// Windy App //////////
           const options = {
           // Required: API key
           key: 'gHF8mMuTokQ5MDr0FmXRR129Kbwr91nO', // REPLACE WITH YOUR KEY !!!
       
           // Put additional console output
           verbose: false,
       
           // Optional: Initial state of the map
           lat: parameter1,
           lon: parameter2,
           zoom: 7,
       };
    }
             


//////////////////////////Ui Features///////////////////////////

    //////////Accordion////////////
      let acc = document.getElementsByClassName("accordion");
      for (let m = 0; m < acc.length; m++) {
        acc[m].addEventListener("click", function() {
          this.classList.toggle("active");
          let panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          } 
        });
     }

     function nav_generator(para1,para2,para3){
      let el = document.getElementById(para1);
      let el2 = document.getElementById(para2);
      let el3 = document.getElementById(para3);
     
      if(el.classList.contains('inactive')){
        el3.style.display = 'none'
        el2.style.display = 'block'
        el.classList.toggle('active_nav');
        el.classList.remove('inactive');
        el.style.display = 'block'
     
      }else{
       el.classList.toggle('inactive');
       el.classList.remove('active_nav');
       el.style.display = 'none'
       el3.style.display = 'block'
       el2.style.display = 'none'
      }
     }


/* Only register a service worker if it's supported */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

//Function to retreive covid data

 function covid_data_func (parameter1, parameter2){
          
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${parameter1}.json?access_token=pk.eyJ1IjoiYXNzc3Nzc3Nzc3Nzc3MiLCJhIjoiY2t3Z3JtdGJtMDg5ZDJxb3cyNjZiM3IwOCJ9.iw12YCJIds8snJUnN_Sa5Q`)
        .then(function(response){
          return response.json();
        })
        .then(function(json){

          if(parameter2 === true){
          document.getElementById('s_c').innerHTML =json.features[0].context[2].text + ',&nbsp'+json.features[0].context[4].text
          }
           console.log(json)
          let mapbox_api_place_name;
          let mapbox_api_country_name;

          if(json.features[0].place_type[0] === 'country' ){
            mapbox_api_place_name = json.features[0].text;
            mapbox_api_country_name = json.features[0].text;
            console.log('country')
          }else if(json.features[0].place_type[0] === 'region'){
            mapbox_api_place_name = json.features[0].text;
            mapbox_api_country_name = json.features[0].context[0].text;
            console.log('region')
          }else if(json.features[0].place_type[0] === 'locality'){
            mapbox_api_place_name = json.features[0].context[2].text;
            mapbox_api_country_name = json.features[0].context[3].text;
          }else if(json.features[0].place_type[0] === 'poi'){
            mapbox_api_place_name = json.features[0].context[3].text;
            mapbox_api_country_name = json.features[0].context[4].text;
          }
          else{
            mapbox_api_place_name = json.features[0].context[1].text;
            mapbox_api_country_name = json.features[0].context[2].text;
            console.log('state')

            
          }
        
      
   

          let d = new Date();
         
         console.log(d.getFullYear() + '-'+ (d.getUTCMonth()+1)+'-'+d.getDate())
          fetch(`https://api.covid19api.com/live/country/${mapbox_api_country_name}/status/confirmed/date/${d.getFullYear() + '-'+(d.getMonth()+1)+'-'+(d.getDate()-2)}`)
          .then(function(response) {
            return response.json();
          })
          .then(function(json) {

            console.log(json)

            let covid_cases_data_consolidated ={}
            let covid_cases_data_active=[]
            let covid_cases_data_confirmed=[]
            let covid_cases_data_deaths=[]
            for(let i = 0; i < json.length; i++){
              if(json[i].Province === mapbox_api_place_name || json[i].Country === mapbox_api_place_name ){
                covid_cases_data_active.push(json[i].Active)
                covid_cases_data_confirmed.push(json[i].Confirmed)
                covid_cases_data_deaths.push(json[i].Deaths)

                covid_cases_data_consolidated.state  = json[i].Province
                covid_cases_data_consolidated.country  = json[i].Country
              
        
              }

                 }
       
              
               

           covid_cases_data_consolidated.active  = covid_cases_data_active[1]
           covid_cases_data_consolidated.confirmed  = covid_cases_data_confirmed[1]
           covid_cases_data_consolidated.deaths  = covid_cases_data_deaths[1]
           covid_cases_data_consolidated.active_change  = covid_cases_data_active[1] - covid_cases_data_active[0]
           covid_cases_data_consolidated.confirmed_change  = covid_cases_data_confirmed[1] - covid_cases_data_confirmed[0]
           covid_cases_data_consolidated.deaths_change  = covid_cases_data_deaths[1] - covid_cases_data_deaths[0]
           

           console.log(covid_cases_data_consolidated.confirmed_change)
           console.log(Math.sign(covid_cases_data_consolidated.active_change))
           console.log(covid_cases_data_active)
      
       
           function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function sign_converter(parameter){
          if( 1 === Math.sign(parameter)){
           return '+'+Math.abs(parameter)
          }else if(-1 === Math.sign(parameter)){
            return'-'+Math.abs(parameter)
          }else{
            return Math.abs(parameter)
          }
        }

           document.getElementById('covid_data_table').innerHTML =`
           

           <div class="table_header">
                 <p>DATA For:<span> ${covid_cases_data_consolidated.state}</span></p>
                 <p>Last updated: <span>${d.getFullYear() + '-'+(d.getMonth()+1)+'-'+(d.getDate()-1)}</span></p>
             </div>
             <div class="cards_collection">
                <div class="cards">
                    <div class="card_header">Confirmed</div>
                    <div class="card_top_sec">${ numberWithCommas(covid_cases_data_consolidated.confirmed)}</div>
                    <div class="card_data_change">${sign_converter(covid_cases_data_consolidated.confirmed_change)}</div>
                </div>
                <div class="cards">
                    <div class="card_header">Active</div>
                    <div class="card_top_sec">${numberWithCommas(covid_cases_data_consolidated.active)}</div>
                    <div class="card_data_change">${sign_converter(covid_cases_data_consolidated.active_change)}</div>
                </div>
                <div class="cards">
                    <div class="card_header">Deaths</div>
                    <div class="card_top_sec">${numberWithCommas(covid_cases_data_consolidated.deaths)}</div>
                    <div class="card_data_change">${sign_converter(covid_cases_data_consolidated.deaths_change)}</div>
                </div>
             </div>
           `
          })
          

         
        

         
        })
        }


       