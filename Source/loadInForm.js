// @name         Leboncoin (loader)
// @description  Userscript pour charger une annonces Leboncoin
// @author       Max1Truc

setInterval(async () => {
  function selectCategory(category) {
    Array.from(document.getElementById("category").options).forEach((option) => {
      if (option.innerText == category) {
        document.getElementById("category").selectedIndex = option.index;
      }
    });
  }

  var object = localStorage.getItem('save');
  var title_input = document.getElementById("subject"),
    category_input = document.getElementById("category"),
    description_input = document.getElementById("body"),
    price_input = document.getElementById("price");

  if (object != null && title_input.value == "" && description_input.value == "" && price_input.value == "") {
    object = JSON.parse(object);
    var title = object.title,
      category = object.category,
      description = object.description,
      price = object.price.replace(" \u20AC", "");

    title_input.value = title;
    selectCategory(category);
    description_input.value = description;
    price_input.value = price;

    // Resets the save
    localStorage.removeItem("save");
  }
}, 500);
