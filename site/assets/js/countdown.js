var tarih =  "May 30 2022 00:00:00 GMT+0300";

(function($) {
	$.fn.countdown = function(options, callback) {

      //custom 'this' selector
      var thisEl = $(this);

      //array of custom settings
      var settings = { 
      	'date': null,
      	'format': null
      };

      //append the settings array to options
      if(options) {
      	$.extend(settings, options);
      }

      //main countdown function
      var countdown_proc = function () {

      	var eventDate = Date.parse(settings['date']) / 1000;
      	var currentDate = Math.floor($.now() / 1000);

      	if(eventDate <= currentDate && new Date() < new Date(tarih)) {
			
					callback.call(this);
			
      	};

      	var seconds = eventDate - currentDate;

        var days = Math.floor(seconds / (60 * 60 * 24)); //calculate the number of days
        seconds -= days * 60 * 60 * 24; //update the seconds variable with no. of days removed

        var hours = Math.floor(seconds / (60 * 60));
        seconds -= hours * 60 * 60; //update the seconds variable with no. of hours removed

        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60; //update the seconds variable with no. of minutes removed

        //conditional Ss
        if (days == 1) { thisEl.find(".timeRefDays").text("GÜN"); } else { thisEl.find(".timeRefDays").text("GÜN"); }
        if (hours == 1) { thisEl.find(".timeRefHours").text("SAAT"); } else { thisEl.find(".timeRefHours").text("SAAT"); }
        if (minutes == 1) { thisEl.find(".timeRefMinutes").text("DAKİKA"); } else { thisEl.find(".timeRefMinutes").text("DAKİKA"); }
        if (minutes == 1) { thisEl.find(".timeRefSeconds").text("SANİYE"); } else { thisEl.find(".timeRefSeconds").text("SANİYE"); }

        //logic for the two_digits ON setting
        if(settings['format'] == "on") {
        	days = (String(days).length >= 2) ? days : "0" + days;
        	hours = (String(hours).length >= 2) ? hours : "0" + hours;
        	minutes = (String(minutes).length >= 2) ? minutes : "0" + minutes;
        	seconds = (String(seconds).length >= 2) ? seconds : "0" + seconds;
        }

        //update the countdown's html values.
        if(!isNaN(eventDate)) {
        	thisEl.find(".days").text(days);
        	thisEl.find(".hours").text(hours);
        	thisEl.find(".minutes").text(minutes);
        	thisEl.find(".seconds").text(seconds);
        } else { 
        	
        	clearInterval(interval); 
        }
    }

      //run the function
      countdown_proc();

      //loop the function
      interval = setInterval(countdown_proc, 1000);

  }
}) (jQuery);

if (new Date() < new Date(tarih))
	{
		$('.countdownHeader').css("display","inline-flex");
    $('body').addClass("countdownOpen");
	}
  else {
    $('body').removeClass("countdownOpen");
  }

//Call countdown plugin
$(".countdown").countdown(
	
	{
  date: tarih,
  format: "on" 
});
	

$(".countdownHeader .close").click(function(){
  localStorage.setItem("countdown", "disable");
  $('body').removeClass("countdownOpen");
  $('.countdownHeader').css("display","none");
});
if (localStorage.getItem("countdown")) {
$('body').removeClass("countdownOpen");
$('.countdownHeader').css("display","none");
}