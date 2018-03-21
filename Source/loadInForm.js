// @name         Leboncoin (loader)
// @description  Userscript pour charger une annonces Leboncoin
// @author       Max1Truc

setInterval(async () => {
  var object = localStorage.getItem('save');
  if (object != null) {
    object = JSON.parse(object);
    var title = object.title,
      description = object.description,
      price = object.price.replace(" \u20AC", "");

    document.getElementById("subject").value = title;
    document.getElementById("body").value = description;
    document.getElementById("price").value = price;

    // Resets the save
    localStorage.removeItem("save");
  }
}, 500);
