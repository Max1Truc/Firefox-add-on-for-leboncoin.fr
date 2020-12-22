// @name         Leboncoin (saver)
// @description  Userscript pour enregistrer une annonce Leboncoin
// @author       Max1Truc

function openNewAdPage(url) {
  const ad_path_splitted = url.split("/");
  const ad_id = ad_path_splitted[ad_path_splitted.length - 1].split(".")[0];
  window.open("https://www.leboncoin.fr/deposer-une-annonce/#" + ad_id);
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
        // URL is a LeBonCoin Ad page, like that: "https://www.leboncoin.fr/[category]/[some_numbers].htm"
        callback(tabs[0].url);
      }
    })
    .catch(console.error);
}

ifOnLeboncoinAd((url) => {
  openNewAdPage(url);
  window.close();
});
