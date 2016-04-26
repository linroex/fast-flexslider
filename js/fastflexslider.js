
$(document).ready(function() {
  slider = Slider.init($('.slides'), $(".flex-control-paging"));

  $('#slider a.flex-next').click(function(e){
    e.preventDefault();
    slider.next_slide();
  });

  $('#slider a.flex-prev').click(function(e){
    e.preventDefault();
    slider.prev_slide();
  });

  $('.flex-control-paging li a.flex-paging-a').click(function(e) {
    e.preventDefault();
    index = $('.flex-control-paging li a.flex-paging-a').index(e.target) + 1;
    slider.go_index(index, 0.6);
  });

  setInterval(function(){
    slider.next_slide();
  }, 6000);

})

var Slider = {

  init: function(slides, paging_control) {
    
    var slider = {};
    var width = slides.find('li').eq(0).css('width').replace('px', '');
    var slider_size = slides.find('li').size();
    var current_index = 1;

    var first_slide = slides.find('li').first();
    var last_slide = slides.find('li').last();

    slider.lock = false;

    slider.move = function(pixel) {
      var defer = $.Deferred();

      slides.css('transform','translateX(-' + pixel + 'px)');

      slides.one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(){
        defer.resolve();
      });

      setTimeout(function(){
        if(defer.state() == 'pending') {
          defer.resolve();
          console.log('force interrupt');  
        }
      }, 700);

      return defer.promise();
    }

    slider.set_nav = function(index) {
      if (this.is_last(index)) {
        index = 1;
      } else if(this.is_first(index)) {
        index = slider_size;
      }

      index -= 1;


      paging_control.find('li a').removeClass('flex-active')
      paging_control.find('li a').eq(index).addClass('flex-active');  
    }

    slider.set_speed = function(speed = 0) {
      slides.css('transition-duration', speed + 's');
    }

    slider.next_slide = function() {
      this.go_index(current_index + 1, 0.6);  
    }

    slider.prev_slide = function() {
      this.go_index(current_index - 1, 0.6);
    }

    slider.go_index = function(index, speed = 0) {
      if(this.lock == true) {
        return '執行中';
      }

      this.lock = true;

      current_index = index;
      this.set_speed(speed);
      this.set_nav(index);

      if(this.is_first(index)) {
        first_slide.css('visibility', 'visible');  
        current_index = slider_size;
      }else if(this.is_last(index)) {
        last_slide.css('visibility', 'visible');
        current_index = 1;
      }
      
      $.when(this.move(index * width)).done(function(){
        
        this.set_speed(0);

        if(this.is_last(index)) {
          $.when(this.move(1 * width)).done(function(){
            last_slide.css('visibility', 'hidden');
            this.lock = false;
          }.bind(this));
        } else if(this.is_first(index)) {
          $.when(this.move(slider_size * width)).done(function(){
            first_slide.css('visibility', 'hidden');
            this.lock = false;
          }.bind(this));
        } else {
          this.lock = false;
        }

      }.bind(this));
    }

    // is hidden last
    slider.is_last = function(index) {
      return index == (slider_size+1)?true:false;
    }

    // is hidden first
    slider.is_first = function(index) {
      return index == 0?true:false;
    }

    // 效能優化，可註解，改人工產生
    // first and end will hidden
    slides.append(first_slide.clone().css('display', 'block').css('visibility', 'hidden'));
    slides.prepend(last_slide.clone().css('display', 'block').css('visibility', 'hidden'));

    first_slide = slides.find('li').eq(0);
    last_slide = slides.find('li').eq(slider_size + 1);

    slider.go_index(1);

    return slider;
  }
};