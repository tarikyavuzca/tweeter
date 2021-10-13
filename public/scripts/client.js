// Secure the user from the attack of XSS
const escape = str => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// renderTweets function accepting tweetsDatabase as parameter
// for all tweet object, createTweetElement function is called
// Prepend all the return tweets to the html class of all-tweet
const renderTweets = tweetsDatabase => {

  $('.all-tweets').empty();
  tweetsDatabase.forEach(tweet => {
    const $thisNewTweet = createTweetElement(tweet)
    $('.all-tweets').prepend($thisNewTweet);
  });
};



// createTweetElement function accepting tweetData as a parameter and returns the structure that containing tweets
const createTweetElement = tweetData => {
  
  const $tweet = $('<article>').addClass('tweet');
  
  const $dayAgo = (tweetData.created_at);
  
  // Elements of tweet object
  const htmlContent = `
  <header>
  <img src=${escape(tweetData.user.avatars)} alt="${escape(tweetData.user.handle)}-avatar">
  <span>${escape(tweetData.user.name)}</span>
  <span>${escape(tweetData.user.handle)}</span>
  </header>
  <p>${escape(tweetData.content.text)}</p>
  <footer>
  ${timeago.format($dayAgo)}
  <span>
  <i class="fas fa-flag"></i>
  <i class="fas fa-retweet"></i>
  <i class="fas fa-heart"></i>
  </span>
  </footer>
  `
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


    const $errorMessage = $(this).children('.error-message');
    // hide error message in case it's in display
    $errorMessage.hide();

    // check if message is exist
    if ($("#t_text").val() === "" || $("#t_text").val() === null) {
      $(".error-message")
        .html("<i class='fas fa-exclamation-triangle'></i>  Use (.) :) !<i class='fas fa-exclamation-triangle'></i> ")
        .slideDown("slow")
        .delay(1500)
        .slideUp("slow");
      
    // check if the length of message is greater than 140
    } else if ($("#t_text").val().length > 140) {
      $(".error-message")
        .html("<i class='fas fa-exclamation-triangle'></i> Dude, don't you see the limit!<i class='fas fa-exclamation-triangle'></i> ")
        .slideDown("slow")
        .delay(1500)
        .slideUp("slow");

    // else everything goes smooth 
    } else { 
      $(".tweet-good")
        .html("<i class='fas fa-smile-wink'></i> Tweet Sent, Check Below <i class='fas fa-smile-wink'></i> ")
        .slideDown("slow")
        .delay(1500)
        .slideUp("slow");
        $(".counter").html(140);
      // Getting the tweets from the server and prompt them on the page
        const $formData = $("#t_text").serialize();
      
        $("#t_text").val('');
        $("#t_text").attr("style", "");
        $.post({
          url: "tweets",
          data: $formData
          }).done(function() {
            loadTweets();
          })
        }
  })
  // Making a GET request to the database
// runs the returned tweet 
const loadTweets = () => {
  $.get( {
    url: '/tweets',
    dataType: 'json',
    data: "data",
    success: function(tweets) {
      renderTweets(tweets);
    }
  });
};
  loadTweets();
})

