$.getJSON('./items.json', (items) => {
  items.forEach((item) => {
    $('.json-content').append("<hr><p><b>Name</b>: " + item.name + "<br><b>Description</b>: " + item.description + "<br><b>Cost</b>: " + item.cost + " Shell(s)</p>");
  });
});
