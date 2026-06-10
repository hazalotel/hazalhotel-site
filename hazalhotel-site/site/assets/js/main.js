AOS.init({
    once: true,
});

if ($(document).scrollTop() > 10) {
    $('body').addClass('sticky');
  } 
  $(document).on('scroll', function() {
    if ($(document).scrollTop() > 10) {
        $('body').addClass('sticky');
    } 
    else{
        $('body').removeClass('sticky');
    }
  });

  $(".topMenuBtn").click(function(){
    $("body").toggleClass("topMenuOpen");
});

if($(window).width() < 820){
  var topMenuNav = $(".topMenu>ul>li>a");
  topMenuNav.click(function () {
      if (!$(this).hasClass("selected")) {
          topMenuNav.parent().find(".subMenu").slideUp();
          topMenuNav.removeClass("selected");
          $(this).next().slideDown();
          $(this).addClass("selected");
      } else {
          $(this).next().slideUp();
          topMenuNav.removeClass("selected");
      }
  });

  $(".headerLang").insertAfter('.topMenu>ul');

  $(".headerLang>strong").click(function(){
      $(".headerLang").toggleClass('open');
  });

}

$(".topMenu>ul>li>ul").wrap('<div class="subMenu">');
$(".subMenu").parent().addClass("open");



$('.homeSlide').owlCarousel({
  loop:true,
  margin:0,
  nav:true,
  dots:true,
  animateOut: 'fadeOut',
  autoplay:false,
  smartSpeed:800,
  responsive:{
      0:{
          items:1,
          nav:false,
      },
      600:{
          items:1,
          nav:false,
      },
      1000:{
          items:1,
      }
  }
});


$('.campaignSlide').owlCarousel({
    loop:true,
    dots:true,
    autoplay:false,
    smartSpeed:800,
    responsive:{
        0:{
            items:1,
        },
        600:{
            items:2,
            margin:20
        },
        1000:{
            items:3,
            margin:40
        }
    }
  });


$('.homeRoomSlide').owlCarousel({
    loop:true,
    dots:false,
    autoplay:false,
    smartSpeed:800,
    autoWidth:true,
    responsive:{
        0:{
            items:1,
            autoWidth:false,
            margin:20,
            dots:true,
        },
        600:{
            items:2,
            autoWidth:true,
            dots:true,
        },
        1000:{
            items:3,
        }
    }
  });



  var discoverNav = $('.homeDiscoverySlide');

  discoverNav.owlCarousel({
    loop:true,
    dots:true,
    autoplay:false,
    smartSpeed:800,
    mouseDrag:false,
    autoHeight:true,
    items:1,
    responsive:{
        0:{
            margin:10,
        },
        600:{
            margin:10,
        },
        1000:{
            margin:10,
        }
    }
  });

discoverNav.owlCarousel();
$('.navSlideBtn .next').click(function() {
    discoverNav.trigger('next.owl.carousel');
});
$('.navSlideBtn .prev').click(function() {
    discoverNav.trigger('prev.owl.carousel', [300]);
});


$('.roomDetailSlide').owlCarousel({
    loop:true,
    dots:false,
    nav:true,
    center:true,
    autoplay:false,
    smartSpeed:800,
    autoWidth:true,
    responsive:{
        0:{
            items:1,
            autoWidth:false,
            nav:false,
            dots:true,
        },
        600:{
            items:2,
            autoWidth:true,
        },
        1000:{
            items:3,
        }
    }
  });

  $('.commentSlide').owlCarousel({
    loop:true,
    dots:true,
    autoplay:false,
    autoHeight:true,
    smartSpeed:800,
    items:1,
  });


  $('.otherRoomSlide').owlCarousel({
    loop:false,
    dots:false,
    autoplay:false,
    smartSpeed:800,
    responsive:{
        0:{
            items:1,
            margin:20,
            dots:true,
        },
        600:{
            items:2,
            dots:true,
            margin:30
        },
        1000:{
            items:2,
            margin:40
        }
    }
  });


  $('.activitiesSlide').owlCarousel({
    loop:true,
    nav:true,
    dots:false,
    autoplay:false,
    smartSpeed:800,
    items:1,
  });




  $('.resGallerySlide').owlCarousel({
    loop:false,
    margin:0,
    dots:true,
    smartSpeed:800,
    mouseDrag:false,
    touchDrag:false,
    responsive:{
        0:{
            items:1,
            dots:true,
        },
        600:{
            items:1,
            dots:true,
        },
        1000:{
            items:1,
        }
    }
  });


  $(document).ready(function(){
	$(window).scroll(function(){
  		$('.lazy').each(function(){
					if( $(this).offset().top < ($(window).scrollTop() + $(window).height() + 300) )
          {          		   
              $(this).attr('src', $(this).attr('data-src'));
              $(this).removeAttr( "data-src" );
          }
		});
  		$('.lazyBg').each(function(){
					if( $(this).offset().top < ($(window).scrollTop() + $(window).height() + 300) )
          {          		   
              $(this).attr('style', $(this).attr('data-style'));
              $(this).removeAttr( "data-style" );
          }
		});
  })
});