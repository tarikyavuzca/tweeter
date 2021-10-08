// Secure the user from the attack of XSS
const escape = str => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// adding all tweets to our page by prepending them
const renderTweets = tweetsDatabase => {

  $('.all-tweets').empty();
  tweetsDatabase.forEach(tweet => {
    $('.all-tweets').prepend(createTweetElement(tweet));
  });
};

const loadTweets = () => {
  $.ajax('/tweets', {
    method: 'GET',
    dataType: 'json',
    success: tweets => renderTweets(tweets),
    error: (data, text, error) => console.error(error)
  })
};


// createTweetElement function accepting tweetData as a parameter and returns the structure that containing tweets
const createTweetElement = tweetData => {

  const $tweet = $('<article>').addClass('tweet');

  const daysSinceTweet = (Date.now() - tweetData.created_at) / 86400000;

  // Elements of tweet object
  const htmlContent = `
    <header>
      <img src=${escape(tweetData.user.avatars)} alt="${escape(tweetData.user.handle)}-avatar">
      <span>${escape(tweetData.user.name)}</span>
      <span>${escape(tweetData.user.handle)}</span>
    </header>
    <p>${escape(tweetData.content.text)}</p>
    <footer>
      ${Math.round(daysSinceTweet)} days ago
      <span>
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </span>
    </footer>
  `

  //returns the elements inside of inner html
  return $tweet.html(htmlContent);
};





$(document).ready(() => { //When the page is loaded

  
  // shows/hides new tweet section when clicked the arrow icon on navbar
  $('nav i').on('click', () => {
    $('.new-tweet').slideToggle();
    $('.new-tweet textarea').focus();
  });

  // handling new tweet form submit
  $('.new-tweet form').submit(function(event) {
    event.preventDefault();

    // const errSymbol = $(this).children('i');
    const $errorMessage = $(this).children('.error-message');
    const $sent = $(this).children('.tweet-sent');
    const $text = $(this).children('textarea');
    const message = $text.val().trim();
    
    // hide error message in case it's in display

    $errorMessage.hide();

    // check if input is valid, show error message if it's not
    if (!message) {
      $(".error-message")
        .html("<i class='fas fa-exclamation-triangle'></i>  Use (.) :) !<i class='fas fa-exclamation-triangle'></i> ")
        .slideDown("slow")
        .delay(1500)
        .slideUp("slow");
      
      
    } else if (message.length > 140) {
      $(".error-message")
        .html("<i class='fas fa-exclamation-triangle'></i> Dude, don't you see the limit!<i class='fas fa-exclamation-triangle'></i> ")
        .slideDown("slow")
        .delay(1500)
        .slideUp("slow");
        
    } else { 
      $(".tweet-good")
        .html("<i class='fas fa-smile-wink'></i> Tweet Sent, Check Below <i class='fas fa-smile-wink'></i> ")
        .slideDown("slow")
        .delay(1500)
        .slideUp("slow");
      
      // Getting the tweets from the server and prompt them on the page
        $.ajax('/tweets', {
          method: 'POST',
          data: $(this).serialize(),
          success: () => { 
          loadTweets(); 
          $text.val('');
          $('.counter').html("140");
          }, 
          error: (data, text, error) => console.error(error)
        })
    }
  })
})