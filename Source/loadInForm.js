function execWindow(func) {
  let args = Array.from(arguments).slice(1).join(", ");
  return window.eval("(" + func.toString() + ")(" + args + ")");
}

async function fillNewAd() {
  const ad_id = Number(document.location.hash.slice(1));
  if (ad_id == 0) return;

  var adData = await (
    await fetch("https://api.leboncoin.fr/finder/classified/" + ad_id)
  ).json();

  for (let attribute of adData.attributes) {
    if (attribute.key == "condition") {
      adData.condition = attribute.value_label;
    } else if (attribute.key == "estimated_parcel_weight") {
      adData["estimated_parcel_weight"] = attribute.value;
    } else if (attribute.key == "toy_age") {
      adData["toy_age"] = attribute.value;
    }
  }

  function wait(time) {
    return new Promise((resolve, _reject) => {
      setTimeout(resolve, time);
    });
  }

  function waitUntil(callback) {
    return new Promise((resolve, _reject) => {
      var intervalId = setInterval(() => {
        if (callback()) {
          clearInterval(intervalId);
          resolve();
        }
      }, 200);
    });
  }

  function waitWhile(callback) {
    return waitUntil(() => !callback());
  }

  function simulateMouseClick(element) {
    const mouseClickEvents = ["mousedown", "click", "mouseup"];
    mouseClickEvents.forEach((mouseEventType) =>
      element.dispatchEvent(
        new MouseEvent(mouseEventType, {
          view: window,
          bubbles: true,
          cancelable: true,
          buttons: 1,
        })
      )
    );
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

    var textinput = new InputEvent("input", { bubbles: true });
    el.dispatchEvent(textinput);

    el.dispatchEvent(new FocusEvent("blur", { bubbles: true }));
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
    return new File([u8arr], filename, { type: mime });
  }

  function uploadImageFromDataURL(fileInputElement, dataurl) {
    const dT = new DataTransfer();
    var file = dataURLtoFile(dataurl, "image.jpg");
    dT.items.add(file);

    fileInputElement.files = dT.files;

    return dT;
  }

  function getDataURL(url) {
    return new Promise((resolve, reject) => {
      // Gets dataURL of an image (with the help of https://jsfiddle.net/handtrix/YvQ5y/4955)
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  }

  function waitPageLoad() {
    return new Promise((resolve, _reject) => {
      var intervalID = setInterval(() => {
        if (document.getElementsByName("subject").length > 0) {
          clearInterval(intervalID);
          resolve();
        }
      }, 200);
    });
  }

  async function titleAndCategoryStep() {
    var subjectInput = document.getElementsByName("subject")[0];

    if (!subjectInput) {
      await wait(200);
      await titleAndCategoryStep();
      return;
    }

    await wait(200);

    type(subjectInput, adData.subject);

    await wait(500);

    var confirmTitleButton = getAllElementsWithAttributeValue(
      "data-qa-id",
      "button_subject_research"
    )[0];
    confirmTitleButton.click();

    await wait(1000);
    await waitWhile(
      () =>
        getAllElementsWithAttributeValue("xlink:href", "#SvgChevrondown")
          .length == 0
    );
    var otherCategoryLink = getAllElementsWithAttributeValue(
      "xlink:href",
      "#SvgChevrondown"
    )[0].parentElement.parentElement;
    if (otherCategoryLink) {
      otherCategoryLink.click();

      await wait(200);
      var categoryElement = document.getElementsByClassName("Linsting")[0];
      var reactElement =
        categoryElement[Object.keys(categoryElement)[1]].children;

      // Select Category
      for (let category of reactElement.props.brikkeCatByUserType) {
        for (let subcategory of category.subcategories) {
          if (subcategory.name == adData.category_name) {
            reactElement.props.selectCategory(
              category.id,
              subcategory.id,
              subcategory.name,
              "list"
            );
            break;
          }
        }
      }
    }
  }

  function conditionStep() {
    return new Promise((resolve, _reject) => {
      // Toy age
      /*var toyAgeElement = getAllElementsWithAttributeValue(
        "data-qa-id",
        "newad-input_toy_age"
      )[0];
      if (toyAgeElement && adData["toy_age"]) {
        let toyAgeReactInstance =
          toyAgeElement[Object.keys(toyAgeElement)[0]]._currentElement._owner
            ._instance;
        toyAgeReactInstance.props.value = parseInt(adData["toy_age"]);
        setTimeout(() => toyAgeReactInstance.forceUpdate(), 100);
      }*/

      setTimeout(() => {
        // Item Condition
        var conditionElement = getAllElementsWithAttributeValue(
          "data-qa-id",
          "newad-input_item_condition"
        )[0];
        if (conditionElement && adData.condition) {
          conditionElement.click();

          setTimeout(() => {
            const all_options = getAllElementsWithAttributeValue(
              "name",
              "item_condition"
            );

            for (let option of all_options) {
              if (
                option.parentElement.parentElement.innerText == adData.condition
              ) {
                option.click();
                break;
              }
            }
          }, 200);
        }
      }, 200);

      var continueButton = getAllElementsWithAttributeValue(
        "data-qa-id",
        "depositad-button-next-ad_params"
      )[0];

      // Some categories do not allow a "condition" option,
      // And in those cases the view with this continue
      // button isn't shown.
      var firstExec = true;
      if (continueButton)
        continueButton.addEventListener("click", (e) => {
          if (firstExec) {
            firstExec = false;
            setTimeout(() => resolve(), 200);
          }
        });
      else setTimeout(resolve, 200);
    });
  }

  function descriptionStep() {
    return new Promise((resolve, _reject) => {
      let descriptionTextarea = getAllElementsWithAttributeValue(
        "data-qa-id",
        "depositad-text_body"
      )[0];

      type(descriptionTextarea, adData.body);

      setTimeout(async () => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "depositad-button-next-description"
        )[0];

        var firstExec = true;
        continueButton.addEventListener("click", (e) => {
          if (firstExec) {
            firstExec = false;
            setTimeout(() => resolve(), 200);
          }
        });
      }, 200);
    });
  }

  function priceStep() {
    return new Promise((resolve, _reject) => {
      let priceInput = getAllElementsWithAttributeValue(
        "data-qa-id",
        "depositad-input_price"
      )[0];

      type(priceInput, adData.price[0]);

      setTimeout(async () => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "depositad-button-next-price"
        )[0];

        var firstExec = true;
        continueButton.addEventListener("click", (e) => {
          if (firstExec) {
            firstExec = false;
            setTimeout(() => resolve(), 200);
          }
        });
      }, 200);
    });
  }

  function deliveryStep() {
    return new Promise((resolve, _reject) => {
      /*
      let estimated_weight_select = getAllElementsWithAttributeValue(
        "data-qa-id",
        "depositad-input_estimated_parcel_weight"
      )[0];
      if (estimated_weight_select) {
        let reactElement =
          estimated_weight_select[Object.keys(estimated_weight_select)[0]]
            ._currentElement._owner._instance;
        reactElement.props.value = parseInt(adData["estimated_parcel_weight"]);
        reactElement.forceUpdate();
      }
      */

      setTimeout(async () => {
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "depositad-button-next-shipping"
        )[0];

        var firstExec = true;
        if (continueButton)
          continueButton.addEventListener("click", (e) => {
            if (firstExec) {
              firstExec = false;
              setTimeout(() => resolve(), 200);
            }
          });
        else setTimeout(resolve, 200);
      }, 500);
    });
  }

  function imageUploadStep() {
    return new Promise(async (resolve, _reject) => {
      setTimeout(async () => {
        // Remove already-uploaded images
        while (
          getAllElementsWithAttributeValue(
            "data-qa-id",
            "depositad-remove-image"
          ).length > 0
        ) {
          getAllElementsWithAttributeValue(
            "data-qa-id",
            "depositad-remove-image"
          )[0].click();
        }

        // Upload ad images
        for (var image_url of adData["images"]["urls_large"]) {
          console.log(`Upload ${image_url}`);
          let image_base64 = await getDataURL(image_url);
          console.log(2);
          let fileInput = getAllElementsWithAttributeValue("type", "file")[0];
          console.log(3);
          let dataTransfer = uploadImageFromDataURL(fileInput, image_base64);
          console.log(4);
          var drop = new DragEvent("drop", {
            bubbles: true,
            dataTransfer,
          });
          console.log(5);
          document.getElementById("__next").dispatchEvent(drop);
        }
      }, 200);

      setTimeout(async () => {
        // 0.2 second
        let continueButton = getAllElementsWithAttributeValue(
          "data-qa-id",
          "depositad-button-next-pictures"
        )[0];

        var firstExec = true;
        continueButton.addEventListener("click", (e) => {
          if (firstExec) {
            firstExec = false;
            setTimeout(() => resolve(), 1000);
          }
        });
      }, 200);
    });
  }

  function addressInputStep() {
    return new Promise((resolve, _reject) => {
      let addressBar = getAllElementsWithAttributeValue(
        "data-qa-id",
        "depositad-input_address"
      )[0];
      type(addressBar, adData.location.city_label);

      setTimeout(() => {
        // 0.2 second
        let searchButton = addressBar.parentElement.parentElement.nextSibling.children[0];
        searchButton.click();

        setTimeout(() => {
          // 0.2 second
          let continueButton = getAllElementsWithAttributeValue(
            "data-qa-id",
            "depositad-button-next-coordinates"
          )[0];
          // First click (to de-focus from the address bar)
          continueButton.click();

          setTimeout(async () => {
            // 0.2 second
            // Wait for user click
            var firstExec = true;
            continueButton.addEventListener("click", (e) => {
              if (firstExec) {
                firstExec = false;
                setTimeout(() => resolve(), 1000);
              }
            });

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

  function ifConnected(callback) {
    let connectButton = getAllElementsWithAttributeValue(
      "data-qa-id",
      "new_depository::login"
    )[0];
    if (connectButton === undefined) callback();
  }

  return waitPageLoad().then(
    ifConnected(async () => {
      await clearLocalStorage();
      await titleAndCategoryStep();
      await conditionStep();
      await descriptionStep();
      await priceStep();
      await deliveryStep();
      await imageUploadStep();
      await addressInputStep();
    })
  );
}

execWindow(fillNewAd);
