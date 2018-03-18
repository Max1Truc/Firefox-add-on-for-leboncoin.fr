// @name         Leboncoin (pompe)
// @description  Userscript pour pomper des annonces Leboncoin
// @author       Max1Truc

function setup() {
  getAllElementsWithThisInnerTextValue = (value) => {
    all = document.getElementsByTagName("*");
    list = [];
    for (x in all) {
      if (all[x].innerText == value) {
        list.push(all[x]);
      }
    }

    return list;
  }

  modifyButton = getAllEWithThisInnerTextValue("Modifier l'annonce")[2];
  modifyButton.setAttribute("class", "");
  modifyButton.style.color = "green";
  modifyButton.setEventListener("click", save)

  function save() {
    function execInCurrentTab(theFunction) {
      browser.tabs.executeScript({
        code: '(' + theFunction + ')();'
      }, (results) => {
        // No log
      });
    }

    execInCurrentTab(() => {
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

      var title = document.getElementsByClassName("_1KQme")[0].innerText,
        description = getAllElementsWithAttributeValue("data-qa-id", "adview_description_container")[0].children[0].innerText,
        price = document.getElementsByClassName("_1F5u3")[0].innerText;

      localStorage.setItem("save", JSON.stringify({
        title: title,
        description: description,
        price: price
      }));
    });
  }
}
