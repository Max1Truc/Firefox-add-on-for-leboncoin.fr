// @name         Leboncoin (saver)
// @description  Userscript pour enregistrer une annonce Leboncoin
// @author       Max1Truc

function injectedCode() {
  var adData = JSON.parse(document.getElementById("__NEXT_DATA__").innerText).props.pageProps.ad;

  function adDataBackup() {
    // Save ad data
    localStorage.setItem("save", JSON.stringify({
      title: adData.subject,
      category: adData.category_name,
      description: adData.body,
      price: adData.price[0],
      location: adData.location
    }));
  }

  function getDataURL(el, callback) {
    // Gets dataURL of an image (with the help of https://jsfiddle.net/handtrix/YvQ5y/4955)

    // Gets url of the image wether it's a <div> or an <img>
    var url = el.style.backgroundImage ?
      el.style.backgroundImage.split('("')[1].split('")')[0] :
      el.src;

    url = url.replace("ad-image", "ad-large");

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  function photosBackup() {
    // Backups the images
    var all_images = document.querySelectorAll('div[alt=""]');

    if (all_images.length == 0)
      // If there is only one image in the ad, we must
      // use another way to get the url of the image
      all_images = document.querySelectorAll('img[alt="image-galerie-0"]');

    for (let i = 0; i < all_images.length; i++) {
      getDataURL(all_images[i], (result) => localStorage.setItem("image" + i, result));
    };
  }

  adDataBackup();
  photosBackup();

  window.open('https://www.leboncoin.fr/ai?ca=12_s'); // Opens a new tab to create a new ad

  return adData;
}

function execute(func) {
  let args = Array.from(arguments).slice(1).join(", ")
  browser.tabs.executeScript({
    code: "(" + func.toString() + ")(" + args + ")"
  }).then(console.dir, console.error);
}

function ifOnLeboncoinAd(callback) {
  browser.tabs.query({
    currentWindow: true,
    active: true
  }).then((tabs) => {
    if (tabs.length < 1) return; // We do not have the permission to look at the current website

    if (tabs[0].url.match(/https\:\/\/[a-z0-9]*\.leboncoin\.fr\/[a-zA-Z\-\_]*\/[0-9]*.htm/i)) {
      // URL is a LeBonCoin Ad page, like that: "https://www.leboncoin.fr/[category]/[some_numbers].htm/"
      callback()
    }
  }).catch(console.error)
}

ifOnLeboncoinAd(() => {
  execute(injectedCode);
  window.close();
});
