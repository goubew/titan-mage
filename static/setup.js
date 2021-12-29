// Requires JQuery

$(document).ready(function(){
  const headerPrefixColor="#cb4b16";

  // Add the floating scroll button
  $('body').prepend('<button class="to-top-button">^</button>');
  $('.to-top-button').click(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });

  // Add indentation markers to headings
  $('h2').prepend(`<span style="color: ${headerPrefixColor}">#</span> `);
  $('h3').prepend(`<span style="color: ${headerPrefixColor}">##</span> `);
  $('h4').prepend(`<span style="color: ${headerPrefixColor}">###</span> `);
  $('h5').prepend(`<span style="color: ${headerPrefixColor}">####</span> `);
  $('h6').prepend(`<span style="color: ${headerPrefixColor}">#####</span> `);
});
