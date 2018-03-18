// @name         Leboncoin (loader)
// @description  Userscript pour pomper des annonces Leboncoin
// @author       Max1Truc

function load () {
	function execInCurrentTab (theFunction) {
	  browser.tabs.executeScript({
	    code: '(' + theFunction + ')();'
	  }, (results) => {
	    // No log
	  });
	}

	execInCurrentTab (() => {
	    function getAllElementsWithAttributeValue(attribute, value)
	    {
	        var matchingElements = [];
	        var allElements = document.getElementsByTagName('*');
	        for (var i = 0, n = allElements.length; i < n; i++)
	        {
	            if (allElements[i].getAttribute(attribute) == value)
	            {
	                matchingElements.push(allElements[i]);
	            }
	        }
	        return matchingElements;
	    }

	    var object = JSON.parse(localStorage.getItem("save")),
	        title = object.title,
	        description = object.description,
	        price = object.price.replace(" \u20AC", "");

	    document.getElementById("subject").value = title;
	    document.getElementById("body").value = description;
	    document.getElementById("price").value = price;
			document.getElementById("rs").click()

	    alert("Annonce restauree !");
	});
}
