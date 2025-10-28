import StorageResult from "./types/StorageResult";

function querySearch(text: string) {
  const query: string[] = text.split(" ");
  let fullURL: string = "";

  // If bang not used in first keyword, default to a Google search.
  if (!query[0].includes("!")) {
    fullURL = "https://google.com/search?q=" + query.join("+");
    chrome.tabs.update({ url: fullURL });
  } else {
    try {
      chrome.storage.sync.get(["savedPairs"], (result: StorageResult) => {
        const pairs = result.savedPairs;
        // If the bang hasn't been set by the user, default to a Google search
        if (!pairs[query[0]]) {
          fullURL = "https://google.com/search?q=" + query.slice(1).join("+");
          chrome.tabs.update({ url: fullURL });
        }

        const searchQuery = query.slice(1).join("+");

        if (pairs[query[0]].url.includes("^")) {
          fullURL = pairs[query[0]].url.replace("^", searchQuery);
        } else {
          fullURL = pairs[query[0]].url + searchQuery;
        }

        console.log("Full URL in try block: ", fullURL);
        chrome.tabs.update({ url: fullURL });
        return;
      });
    } catch (err) {
      fullURL = "https://google.com/search?q=" + query.slice(1).join("+");
      console.error("Failed to find pair: ", err);
      chrome.tabs.update({ url: fullURL });
    }
  }
}

chrome.omnibox.onInputEntered.addListener(querySearch);
