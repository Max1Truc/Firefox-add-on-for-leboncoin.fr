// @name         Leboncoin (loader)
// @description  Userscript pour charger une annonces Leboncoin
// @author       Max1Truc

setInterval(async () => {
  var object = localStorage.getItem('save');
  var title_input = document.getElementById("subject"),
    description_input = document.getElementById("body"),
    price_input = document.getElementById("price");

  if (object != null && title_input.value == "" && description_input.value == "" && price_input.value == "") {
    object = JSON.parse(object);
    var title = object.title,
      description = object.description,
      price = object.price.replace(" \u20AC", "");

    title_input.value = title;
    description_input.value = description;
    price_input.value = price;

    // Resets the save
    localStorage.removeItem("save");
  }
}, 500);
