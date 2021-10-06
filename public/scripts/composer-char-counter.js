$(document).ready(() => {
  
  const $textArea = $('.new-tweet textarea');
  
  $textArea.on('keyup', function() {

    const $char = $(this).siblings('.counter');
    const remaining = 140 - $(this).val().length;
    
    $char.text(remaining);

    if (remaining < 0) {
      $char.addClass('char-limit');

    } else {
      $char.removeClass('char-limit');
    }
  });
}); 