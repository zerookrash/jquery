// Twitter stuff
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

$(() => {
  $('body').addClass('container');
  $('#root').addClass('row');

  setupPlugin([
  createChild,
  printTweet
  ]);

  window.setTimeout(() => {
    $.ajax('api/v1/feed.json')
    .done(tweets => {
      tweets.forEach(tweet => {
        const id = getId(tweet.url);
        $('#root')
        .createChild(id, 'wrapper')
        .addClass('col s12 m6 l4 xl3')
        .printTweet()
        .colorChange(1, 255);
      });
    })
    .fail(error => console.error(error));
  }, 10);
});

function createChild(id, classes) {
  const element = $('<div></div>', {
    class: classes,
    'data-tweet': id
  });
  this.prepend(element);

  return element;
};

function printTweet() {
  const id = this.data('tweet');
  const [element] = this;
  twttr.widgets.createTweet(id, element);
  return this;
};

$.fn.colorChange= function (min, max) {
  var a = Math.round(Math.random() * (max - min) + min);
  var b = Math.round(Math.random() * (max - min) + min);
  var c = Math.round(Math.random() * (max - min) + min);
  this.css('background-color', `rgba(#{a}#{b}#{c})`);
  console.log(a);
  return this;
}

const setupPlugin = functions => {
  functions.forEach(func => {
    if (typeof func !== 'function') return;
    $.fn[func.name] = func;
  });
};

const getId = url => {
  const match = url.match(/^(?:https?):\/\/(?:www\.)?twitter\.com\/(?:[A-Za-z0-9_]{1,15})\/status\/([0-9]+)/);
  const value = match ? match[1] : null;

  return value;
}
