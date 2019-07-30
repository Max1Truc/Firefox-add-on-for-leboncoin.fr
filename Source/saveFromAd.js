// @name         Leboncoin (saver)
// @description  Userscript pour enregistrer une annonce Leboncoin
// @author       Max1Truc

var intervalId = setInterval(() => {
  function getAllElementsWithThisInnerTextValue(value) {
    var all = document.getElementsByTagName("*");
    var list = [];
    for (let x in all) {
      if (all[x].innerText == value) {
        list.push(all[x]);
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
      price = document.getElementsByClassName("_1F5u3")[0].innerText;

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
    var url = el.style.backgroundImage
        ?el.style.backgroundImage.split('("')[1].split('")')[0]
        :el.src;

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

  var modifyButton = getAllElementsWithThisInnerTextValue("Modifier l’annonce")[0];
  modifyButton.outerHTML = "<a>" + modifyButton.innerHTML + "</a>"  // Reset event listeners of parent node by recreating it

  var modifyButtonText = getAllElementsWithThisInnerTextValue("Modifier l’annonce")[2];
  modifyButtonText.setAttribute("class", "");
  modifyButtonText.style.color = "green";
  modifyButtonText.addEventListener("click", () => {
    window.setTimeout(adDataBackup, 1);
    window.setTimeout(photosBackup, 1);
    window.open('https://www.leboncoin.fr/ai?ca=12_s'); // Opens a new tab to create a new ad
  });

  // If this interval is finished, it disallows other iterations of this interval to repatch the page and prevents bugs.
  clearInterval(intervalId);
}, 500);
