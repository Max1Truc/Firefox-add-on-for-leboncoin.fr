// @name         Leboncoin (saver)
// @description  Userscript pour enregistrer une annonce Leboncoin
// @author       Max1Truc

async function injectedCode() {
  const ad_path_splitted = window.location.href.split("/");
  const ad_id = ad_path_splitted[ad_path_splitted.length - 1].split(".")[0];
  var adData = await (
    await fetch("https://api.leboncoin.fr/finder/classified/" + ad_id)
  ).json();

  let condition = undefined;
  for (let attribute of adData.attributes) {
    if (attribute.key == "condition") {
      condition = attribute.value_label;
    } else if (attribute.key == "estimated_parcel_weight") {
      adData["estimated_parcel_weight"] = attribute.value;
    } else if (attribute.key == "toy_age") {
      adData["toy_age"] = attribute.value;
    }
  }

  function adDataBackup() {
    // Save ad data
    localStorage.setItem(
      "save",
      JSON.stringify({
        title: adData.subject,
        category: adData.category_name,
        description: adData.body,
        price: adData.price[0],
        location: adData.location,
        condition,
        estimated_parcel_weight: adData["estimated_parcel_weight"],
      })
    );
  }

  function getDataURL(url, callback) {
    // Gets dataURL of an image (with the help of https://jsfiddle.net/handtrix/YvQ5y/4955)
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  function photosBackup() {
    // Backups the images
    var all_images = adData["images"]["urls_large"];

    for (let i = 0; i < all_images.length; i++) {
      getDataURL(all_images[i], (result) =>
        localStorage.setItem("image" + i, result)
      );
    }
  }

  adDataBackup();
  photosBackup();

  window.open("https://www.leboncoin.fr/deposer-une-annonce/"); // Opens a new tab to create a new ad

  return adData;
}

function execute(func) {
  let args = Array.from(arguments).slice(1).join(", ");
  browser.tabs
    .executeScript({
      code: "(" + func.toString() + ")(" + args + ")",
    })
    .then(console.dir)
    .catch(console.error);
}

function ifOnLeboncoinAd(callback) {
  browser.tabs
    .query({ currentWindow: true, active: true })
    .then((tabs) => {
      if (tabs.length < 1) return;
      // We do not have the permission to look at the current website

      if (
        tabs[0].url.match(
          /https\:\/\/[a-z0-9]*\.leboncoin\.fr\/[a-zA-Z\-\_]*\/[0-9]*.htm/i
        )
      ) {
        // URL is a LeBonCoin Ad page, like that: "https://www.leboncoin.fr/[category]/[some_numbers].htm/"
        callback();
      }
    })
    .catch(console.error);
}

ifOnLeboncoinAd(() => {
  execute(injectedCode);
  window.close();
});
