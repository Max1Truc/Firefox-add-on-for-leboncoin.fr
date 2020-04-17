// @name         Leboncoin (saver)
// @description  Userscript pour enregistrer une annonce Leboncoin
// @author       Max1Truc

function injectedCode() {
  var intervalId = setInterval(() => {
    function getAllElementsWithThisInnerTextValue(value) {
      var all = document.getElementsByTagName("*");
      var list = [];
      for (let x in all) {
        if (all[x].innerText) {
          let match = all[x].innerText.match(value);
          if (match && match.length > 0) {
            list.push(all[x]);
          }
        }
      }

      return list;
    }

    function getAllElementsWithAttributeValue(attribute, value) {
      var matchingElements = [];
      var allElements = document.getElementsByTagName('*');
      for (var i = 0, n = allElements.length; i < n; i++) {
        if (allElements[i].getAttribute(attribute) == value) {
          matchingElements.push(allElements[i]);
        }
      }
      return matchingElements;
    }

    function adDataBackup() {
      // Save ad data
      var title = document.getElementsByTagName("h1")[0].innerText,
        category = getAllElementsWithAttributeValue("data-qa-id", "breadcrumb-item-2")[0].innerText,
        description = getAllElementsWithAttributeValue("data-qa-id", "adview_description_container")[0].children[0].innerText,
        price = getAllElementsWithThisInnerTextValue(/^[0-9]+ €$/)[0].innerText;

      localStorage.setItem("save", JSON.stringify({
        title,
        category,
        description,
        price
      }));
    }

    function getDataURL(el, callback) {
      // Gets dataURL of an image (with the help of https://jsfiddle.net/handtrix/YvQ5y/4955)

      // Gets url of the image wether it's a <div> or an <img>
      var url = el.style.backgroundImage ?
        el.style.backgroundImage.split('("')[1].split('")')[0] :
        el.src;

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

    window.setTimeout(adDataBackup, 1);
    window.setTimeout(photosBackup, 1);
    window.open('https://www.leboncoin.fr/ai?ca=12_s'); // Opens a new tab to create a new ad

    // If this interval is finished, it disallows other iterations of this interval to repatch the page and prevents bugs.
    clearInterval(intervalId);
  }, 500);
  return intervalId;
}

function execute(functionVar) {
  browser.tabs.executeScript({
    code: "(" + functionVar.toString() + ")()"
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
