$(document).ready(function() {
  
  var sayac1=$("#counterInput1").val();
  var sayac2=$("#counterInput2").val();
  
  $("#adultPlus").click(function(){
  if(sayac1 == 8){
    $("#counterInput1").val("8");
  }else{
  sayac1++;
  $("#counterInput1").val(sayac1);
  }
  });
  $("#adultMinus").click(function(){
  if(sayac1 == 1){
    $("#counterInput1").val("1");
  }else{
    sayac1--;
  $("#counterInput1").val(sayac1);
  }
  });

  $("#childPlus").click(function(){
    if(sayac2 <= 4){sayac2++;}
    if(sayac2 > 4){ sayac2 == 4}
    if(sayac2 == 1){
      $("#counterInput2").val("1");
      $(".childAgeCol").slideDown();
      $("#child1").slideDown();
    }
    if(sayac2 == 2){
      $("#counterInput2").val("2");
      $(".childAgeCol").slideDown();
      $("#child2").slideDown();
    }
    if(sayac2 == 3){
      $("#counterInput2").val("3");
      $(".childAgeCol").slideDown();
      $("#child3").slideDown();
    }
    if(sayac2 == 4){
      $("#counterInput2").val("4");
      $(".childAgeCol").slideDown();
      $("#child4").slideDown();
    }
    });
    $("#childMinus").click(function(){
    if(sayac2 > 0){
    sayac2--;
    }
    if(sayac2 == 3){
      $("#counterInput2").val("3");
      $(".childAgeCol").slideDown();
      $("#child4").slideUp();
    }
    if(sayac2 == 2){
      $("#counterInput2").val("2");
      $(".childAgeCol").slideDown();
      $("#child3").slideUp();
    }
    if(sayac2 == 1){
      $("#counterInput2").val("1");
      $(".childAgeCol").slideDown();
      $("#child2").slideUp();
    }
    if(sayac2 == 0){
      $("#counterInput2").val("0");
      $(".childAgeCol").slideUp();
      $("#child1").slideUp();
    }
    });
	
    $(".childClose").click(function(){
    $(".childAgeCol").slideUp();
    });


    $(function() {
    
      var dateSelect     = $('#flight-datepicker');
      var dateDepart     = $('#startDate');
      var dateReturn     = $('#endDate');
      var spanDateFormat = 'dd.mm.yyyy';
      var today = new Date();
      var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

      
      if($(window).width() > 600){
        var applyMobile = true;
      }
      else {
        var applyMobile = false;
      }

     
  
      dateSelect.daterangepicker({

          parentEl: "#rezForm",
          autoUpdateInput: true,
          "autoApply": applyMobile,
          "startDate": today,
          "endDate": tomorrow,
          "minDate": today,
          "drops": "auto",
          locale: {
              cancelLabel: 'Temizle',
              "daysOfWeek": [
              "Pa",
              "Pzt",
              "Sal",
              "Çar",
              "Per",
              "Cum",
              "Cmt"
          ],
          "monthNames": [
              "Ocak",
              "Şubat",
              "Mart",
              "Nisan",
              "Mayıs",
              "Haziran",
              "Temmuz",
              "Ağustos",
              "Eylül",
              "Ekim",
              "Kasım",
              "Aralık"
          ],
          "firstDay":1
          }
      });
    
      dateSelect.on('apply.daterangepicker', function(ev, picker) {
  
          $(dateDepart).val(picker.startDate.format('DD.MM.YYYY'));
          $(dateReturn).val( picker.endDate.format('DD.MM.YYYY') );
          
          var start= new Date(picker.startDate.format('YYYY-MM-DD'));
          var end=   new Date(picker.endDate.format('YYYY-MM-DD'));
          var diff = new Date(end - start)
          days =    Math.floor(diff/1000/60/60/24); 
          $("#night").val(days);
      
      
         var gun1=start.getDay();
         var gun2=end.getDay();
        
         var gunler= ['Pazar', 'Pazartesi', 'Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
         $('.dateDay1').html(gunler[gun1]);            
         $('.dateDay2').html(gunler[gun2]); 
		 
		 
		 
	  $(".submit").click(function(){
		
		$(dateDepart).val(picker.startDate.format('YYYY-MM-DD'));
        $(dateReturn).val( picker.endDate.format('YYYY-MM-DD') );

	  
	if($("#child1").val() != ""){   var c1 = $("#child1").val();}
	else{ var c1 = ""; }  
	  
	if($("#child2").val() != ""){   var c2 = ","+$("#child2").val();}
	else{ var c2 = "";}  
	  
	if($("#child3").val() != ""){   var c3 = ","+$("#child3").val();}
	else{ var c3 = ""; }  
	  
	if($("#child4").val() != ""){   var c4 = ","+$("#child4").val();}
	else{ var c4 = ""; }  
	
	var start = $("#startDate").val();
	var end = $("#endDate").val();
	var yetiskin = $("#counterInput1").val();
	var cocuk = $("#counterInput2").val();
	var cocukYas = c1+c2+c3+c4;
     url = "https://hazalhotel.istbooking.com/search?search=%7B%22checkin_date%22:%22"+start+"%22,%22checkout_date%22:%22"+end+"%22,%22day_count%22:"+days+",%22room_count%22:1,%22total_adult%22:"+yetiskin+",%22total_child%22:0,%22rooms%22:%5B%7B%22adult_count%22:"+yetiskin+",%22guest_count%22:2,%22child_count%22:"+cocuk+",%22child_ages%22:%5B"+cocukYas+"%5D%7D%5D,%22guest_rooms%22:%7B%220%22:%7B%22adult_count%22:"+yetiskin+",%22guest_count%22:"+yetiskin+",%22child_count%22:"+yetiskin+",%22child_ages%22:%5B"+cocukYas+"%5D%7D%7D%7D";
	  
	  
	  
	  
      window.location.replace(url, "_blank");
      //window.open(url, '_blank');
	
      
    });
		 
		 
          
      });


      $('.applyBtn').html("TAMAM");
                
        var girisdate = new Date();
        var cikisdate = new Date();
        girisdate.setDate(girisdate.getDate());
        cikisdate.setDate(cikisdate.getDate()+ 1);
          function addZero(i) {
            if (i < 10) { i = "0" + i;	}
            return i;
          }
        $("#startDate").val(addZero(girisdate.getDate()) + "." + addZero(girisdate.getMonth() + 1) + "." + girisdate.getFullYear());
        $("#endDate").val(addZero(cikisdate.getDate()) + "." + addZero(cikisdate.getMonth() + 1) + "." + cikisdate.getFullYear());
  
        
        daterangeDays();
  
  
        function daterangeDays(){
  
          var gun1=girisdate.getDay();
          var gun2=cikisdate.getDay();
          var gunler= ['Pazar', 'Pazartesi', 'Salı','Çarşamba','Perşembe','Cuma','Cumartesi'];
          $('.dateDay1').html(gunler[gun1]);            
          $('.dateDay2').html(gunler[gun2]); 
  
      }
    
    });
    

    
		
    


  
  $("#tcKimlik").show();
  $("#firmaUnvani").hide();
  $("#faturaAdresi").hide();
  $("#vergiDairesi").hide();
  $("#vergiNo").hide();

  $("#pasaportNo").hide();


    $('input[name*=faturaTur]').on('change', function () {
      if ($('input:radio[id=faturaSahis]').is(':checked')) {
        $("#firmaUnvani").hide();
        $("#faturaAdresi").hide();
        $("#vergiDairesi").hide();
        $("#vergiNo").hide();
        $("#tcKimlik").show();
        $("#tcKimlikCheckList").show(); 
        $('input:checkbox[id=tcKimlikCheck]').prop('checked', false).removeAttr('checked');
      }
      if ($('input:radio[id=faturaFirma]').is(':checked')) {
        $("#tcKimlik").hide();
        $("#firmaUnvani").show();
        $("#faturaAdres").show();
        $("#vergiDairesi").show();
        $("#vergiNo").show();
        $("#tcKimlikCheckList").hide();
        $("#pasaportNo").hide();
        $('input:checkbox[id=tcKimlikCheck]').prop('checked', false).removeAttr('checked');
      }
      if ($('input[type="radio"]').is(':checked')) {
        $(".resInvoiceTab label").removeClass("active");
        $(this).parent().addClass("active");
      }
    });



    $('input[name*=tcKimlikCheck]').on('change', function () {

      if ($('input:checkbox[id=tcKimlikCheck]').is(':checked')) {
        $("#tcKimlik").hide();
        $("#pasaportNo").show();
      } else {
        $("#tcKimlik").show();
        $("#pasaportNo").hide();
      }


    });

    

var $creditCard;

$('.js-input-cart-number').on('keyup change', function () {
    $creditCard = $(this);
    $('.credit-card-box .number').html($creditCard.val());
});

$('.js-card-holder').on('keyup change', function () {
    $creditCard = $(this);
    $('.credit-card-box .card-holder div').html($creditCard.val());
});

$('.js-card-holder').on('keyup change', function () {
    $creditCard = $(this);
    $('.credit-card-box .card-holder div').html($creditCard.val());
});

$('.js-card-expiration-month, .js-card-expiration-year').change(function () {
    var m = $('#card-expiration-month option').index($('#card-expiration-month option:selected'));
    var y = $('#card-expiration-year').val().substr(2, 2);
    m = (m < 10) ? '0' + m : m;
    $('.card-expiration-date div').html(m + '/' + y);
})

$('.js-card-ccv').on('focus', function () {
    $('.credit-card-box').addClass('hover');
}).on('blur', function () {
    $('.credit-card-box').removeClass('hover');
}).on('keyup change', function () {
    $('.ccv div').html($(this).val());
});



$(document).on("input", "#CartNo, #Cvv", function () {
  $(this).attr('inputmode', 'numeric');
  this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1')
});


$(document).on("input", "#CartName", function () {
  this.value = this.value.replace(/^[0-9]+$/,'');
});


function profileTabs(){

   var requestsNotesBtn =  $(".requestsAndNotes").fadeOut();

    $("#requestsAndNotes").click(function(){
      $(this).toggleClass("open");
      $(requestsNotesBtn).toggle();
    });


    var personalInfoForm =  $("#personalInfoForm").fadeOut();

    
    $("#personalInfo").click(function(){
      $(this).toggleClass("open");
      $(personalInfoForm).toggle();
    });



}

profileTabs();







});
    

if($(window).width() <= 800){
  $(".reservationDetailColSm").insertBefore(".reservationDetailColXl");
}



$("#installTable").click(function() {
  $(".installTableFancy").fadeIn()
  $("body").addClass("hidden")
});

$(".installTableFancy .close").click(function() {
      $(".installTableFancy").fadeOut()
      $("body").removeClass("hidden")
});