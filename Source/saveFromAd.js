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

  var modifyButton = getAllElementsWithThisInnerTextValue("Modifier l’annonce")[0];
  var modifyButtonText = getAllElementsWithThisInnerTextValue("Modifier l’annonce")[2];
  modifyButtonText.setAttribute("class", "");
  modifyButtonText.style.color = "green";
  modifyButton.removeAttribute("href");

  modifyButton.addEventListener("click", () => {
    var title = document.getElementsByClassName("_1KQme")[0].innerText,
      category = getAllElementsWithAttributeValue("data-qa-id", "breadcrumb-item-2")[0].innerText,
      description = getAllElementsWithAttributeValue("data-qa-id", "adview_description_container")[0].children[0].innerText,
      price = document.getElementsByClassName("_1F5u3")[0].innerText;
    localStorage.setItem("save", JSON.stringify({
      title,
      category,
      description,
      price
    }));

    window.open('https://www.leboncoin.fr/ai?ca=12_s'); // Opens a new tab to create a new ad
  });

  // If this interval is finished, it disallow other intervals to repatch the page and prevents bugs.
  clearInterval(intervalId);
}, 500);
