// @name         Leboncoin (loader)
// @description  Userscript pour charger une annonces Leboncoin
// @author       Max1Truc

var mainIntervalID = setInterval(() => {
  function execWindow(func) {
    let args = Array.from(arguments).slice(1).join(", ")
    return window.eval("(" + func.toString() + ")(" + args + ")")
  }

  function selectCategory(category) {
    category = category.replace(/É/g, "E").toUpperCase()
    Array.from(document.getElementById("category").options).forEach((option) => {
      if (option.innerText.toUpperCase() == category) {
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
    clearInterval(mainIntervalID);

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

    // Correct some tweaks from LeBonCoin to redirect to another page
    execWindow(() => {
      document.getElementById("subject").setAttribute("maxlength", "100");
      $._data($("body")[0], "events")["focusout"][2].handler = () => {};
      $._data($("body")[0], "events")["focusin"][1].handler = () => {};
      $._data($("body")[0], "events")["change"][0].handler = () => {};
    });

    // Load the images
    let image_id = 0;
    var intervalID = setInterval(() => {
      if (localStorage.getItem("image" + image_id) === undefined) {
        // If there is no more image to upload
        clearInterval(intervalID); // Stop the interval
        return; // Stop the current iteration
      }

      image_id = execWindow((image_id, intervalID) => { // Execute following code with window scope
        if (runningInstanceOfFileUploadNewad != null && runningInstanceOfFileUploadNewad.state != 'uploaded')
          return image_id; // Stop this iteration because an image is being uploaded

        function dataURLtoFile(dataurl, filename) { // Convert a data url to a File object (https://stackoverflow.com/a/30407840/9438168)
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
        // Programmatically upload a file to an <input type="file"> (https://stackoverflow.com/a/47172409/9438168)
        const dT = new DataTransfer();
        var file = dataURLtoFile(dataurl, "image.jpg");

        dT.items.add(file);
        document.getElementById("image" + image_id).files = dT.files;
        arrayOfFileUploadNewad[image_id].uploadStart("photo_upload_ajax", "verify", 300);

        localStorage.removeItem("image" + image_id);

        return image_id + 1; // Increase image id
      }, image_id, intervalID);
    }, 500);

    // Resets the save
    localStorage.removeItem("save");
  }
}, 500);
