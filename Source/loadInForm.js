function execWindow(func) {
  let args = Array.from(arguments).slice(1).join(", ");
  return window.eval("(" + func.toString() + ")(" + args + ")");
}

function fillNewAd() {
  let adData = JSON.parse(localStorage.getItem("save"));

  let images = [
    localStorage.getItem("image0"),
    localStorage.getItem("image1"),
    localStorage.getItem("image2"),
  ];

  function wait(time) {
    return () => {
      return new Promise((resolve, _reject) => {
        setTimeout(resolve, time);
      });
    };
  }

  function type(el, value) {
    var setTextareaValue = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value"
    ).set;

    var setInputValue = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;

    var focus = new FocusEvent("focus");
    el.dispatchEvent(focus);

    if (el.nodeName.toLowerCase() == "textarea") {
      setTextareaValue.call(el, value);
    } else {
      setInputValue.call(el, value);
    }

    var textinput = new InputEvent("input", {
      bubbles: true,
    });
    el.dispatchEvent(textinput);

    el.dispatchEvent(
      new FocusEvent("blur", {
        bubbles: true,
      })
    );
  }

  function getAllElementsWithAttributeValue(attribute, value) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName("*");
    for (var i = 0, n = allElements.length; i < n; i++) {
      if (allElements[i].getAttribute(attribute) == value) {
        matchingElements.push(allElements[i]);
      }
    }
    return matchingElements;
  }

  function select(element, optionName) {
    optionName = optionName.toUpperCase();
    Array.from(element.options).forEach((option) => {
      if (option.innerText.toUpperCase() == optionName) {
        element.selectedIndex = option.index;
      }
    });
  }

  function dataURLtoFile(dataurl, filename) {
    // Convert a data url to a File object (https://stackoverflow.com/a/30407840/9438168)
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
      type: mime,
    });
  }

  function uploadImageFromDataURL(fileInputElement, dataurl) {
    const dT = new DataTransfer();
    var file = dataURLtoFile(dataurl, "image.jpg");
    dT.items.add(file);

    fileInputElement.files = dT.files;

    return dT;
  }

  function waitPageLoad() {
    return new Promise((resolve, _reject) => {
      var intervalID = setInterval(() => {
        if (document.getElementsByName("subject").length > 0) {
          clearInterval(intervalID);
          resolve();
        }
      }, 500);
    });
  }

  function titleAndCategoryStep() {
    return new Promise((resolve, _reject) => {
      var subjectInput = document.getElementsByName("subject")[0];
      type(subjectInput, adData.title);

      setTimeout(() => {
        // 0.5 second
        var confirmTitleButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "button__research"
        )[0];
        confirmTitleButton.click();

        setTimeout(() => {
          // 1 second
          var otherCategoryLink = getAllElementsWithAttributeValue(
            "data-test-id",
            "item-default"
          )[0];
          otherCategoryLink.click();

          var categoryElement =
            subjectInput.parentElement.parentElement.parentElement.parentElement
              .parentElement.parentElement.nextSibling;
          var reactElement =
            categoryElement[Object.keys(categoryElement)[0]]._currentElement
              ._owner._instance;

          // Select Category
          for (let category of reactElement.props.categories) {
            for (let subcategory of category.subcategories) {
              if (subcategory.name == adData.category) {
                reactElement
                  .selectCategory(
                    category.id,
                    subcategory.id,
                    subcategory.name,
                    "list"
                  )
                  .then(() => {
                    // Click on "Continue"
                    let continueButton = getAllElementsWithAttributeValue("data-qa-id", "newad-button-next-categories")[0];
                    continueButton.click();

                    // Resolve the promise
                    setTimeout(resolve, 500);
                  });
              }
            }
          }
          /*
      reactElement.setState({
        toggleSelect: false,
      });
      */
        }, 1000);
      }, 500);
    });
  }

  function conditionStep() {
    return new Promise((resolve, _reject) => {
      // We don't know the item's condition
      // So we can't provide it.
      //var conditionSelect = document.getElementsByName("item_condition")[0];
      //select(conditionSelect, "État neuf");

      setTimeout(() => {
        // 0.2 second
        var continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "newad-button-next-ad_params"
        )[0];

        // Some categories do not allow a "condition" option,
        // And in those cases the view with this continue
        //   button isn't shown.
        if (continueButton) continueButton.click();

        setTimeout(resolve, 500);
      }, 200);
    });
  }

  function descriptionStep() {
    return new Promise((resolve, _reject) => {
      let descriptionTextarea = getAllElementsWithAttributeValue(
        "data-qa-id",
        "newad-text_body"
      )[0];

      type(descriptionTextarea, adData.description);

      setTimeout(() => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "newad-button-next-description"
        )[0];
        continueButton.click();

        setTimeout(resolve, 500);
      }, 200);
    });
  }

  function priceStep() {
    return new Promise((resolve, _reject) => {
      let priceInput = getAllElementsWithAttributeValue(
        "data-qa-id",
        "newad-input_price"
      )[0];

      type(priceInput, adData.price);

      setTimeout(() => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "newad-button-next-price"
        )[0];
        continueButton.click();

        setTimeout(resolve, 500);
      }, 200);
    });
  }

  function deliveryStep() {
    return new Promise((resolve, _reject) => {
      let noDeliveryButton = getAllElementsWithAttributeValue(
        "data-test-id",
        "option-title-text"
      ).pop();
      noDeliveryButton.click();

      setTimeout(() => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "newad-button-next-shipping"
        )[0];
        continueButton.click();

        setTimeout(resolve, 500);
      }, 200);
    });
  }

  function imageUploadStep() {
    return new Promise((resolve, _reject) => {
      for (let image of images) {
        if (image) {
          let fileInput = getAllElementsWithAttributeValue("type", "file")[0],
            imageInput = getAllElementsWithAttributeValue(
              "aria-disabled",
              "false"
            )[0];
          let dataTransfer = uploadImageFromDataURL(fileInput, image);
          var drop = new DragEvent("drop", { bubbles: true, dataTransfer });
          imageInput.dispatchEvent(drop);
        }
      }

      setTimeout(() => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "newad-button-next-pictures"
        )[0];
        continueButton.click();

        setTimeout(resolve, 1000);
      }, 200);
    });
  }

  function addressInputStep() {
    return new Promise((resolve, _reject) => {
      let addressBar = getAllElementsWithAttributeValue(
        "data-qa-id",
        "newad-input_address"
      )[0];
      type(addressBar, adData.location.city_label);

      setTimeout(() => {
        // 0.2 second
        let searchButton = addressBar.nextSibling;
        searchButton.click();

        setTimeout(() => {
          // 0.2 second
          let continueButton = getAllElementsWithAttributeValue(
            "data-qa-id",
            "newad-button-next-undefined"
          )[0];
          continueButton.click();

          setTimeout(() => {
            // 0.2 second
            // Re-click ^^
            continueButton.click();

            setTimeout(resolve, 500);
          }, 200);
        });
      }, 200);
    });
  }

  async function clearLocalStorage() {
    localStorage.removeItem("save");
    localStorage.removeItem("image0");
    localStorage.removeItem("image1");
    localStorage.removeItem("image2");
  }

  return waitPageLoad()
    .then(titleAndCategoryStep)
    .then(conditionStep)
    .then(descriptionStep)
    .then(priceStep)
    .then(deliveryStep)
    .then(imageUploadStep)
    .then(addressInputStep)
    .then(clearLocalStorage);
}

execWindow(fillNewAd);
