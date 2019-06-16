// @name         Leboncoin (loader)
// @description  Userscript pour charger une annonces Leboncoin
// @author       Max1Truc

var intervalID = setInterval(() => {
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

  if (title_input != undefined && category_input != undefined && description_input != undefined && price_input != undefined)
    // Page fully loaded
    clearInterval(intervalID);

  if (object != null && title_input.value == "" && description_input.value == "" && price_input.value == "") {
    object = JSON.parse(object);
    var title = object.title,
      category = object.category,
      description = object.description,
      price = object.price.replace(" \u20AC", ""); // Removes "€"

    title_input.value = title;
    selectCategory(category);
    description_input.value = description;
    price_input.value = price;

    // Load the images
    for (let image_id = 0; image_id < 3; image_id++) { // For each one of the three images
      setTimeout(() => {
        window.eval("(" + ((image_id) => { // Execute following code with window scope
          function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {
              type: mime
            });
          }

          var dataurl = localStorage.getItem("image" + image_id);
          const dT = new DataTransfer();
          var file = dataURLtoFile(dataurl, "image.jpg");

          dT.items.add(file);
          document.getElementById("image" + image_id).files = dT.files;
          arrayOfFileUploadNewad[image_id].uploadStart("photo_upload_ajax", "verify", 300);

          localStorage.removeItem("image" + image_id);
        }).toString() + ")(" + image_id + ")");
      }, (image_id) * 2500);
    }

    // Resets the save
    localStorage.removeItem("save");
  }
}, 500);
