import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Settings } from "lucide-react";
import URLBangPair from "./types/URLBangPair";
import StorageResult from "./types/StorageResult";

function SettingsPage() {
  const [newBang, setNewBang] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [URLBangPairs, setURLBangPairs] = useState<URLBangPair[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      chrome.storage.sync.get(["savedPairs"], (result: StorageResult) => {
        setURLBangPairs(Object.values(result.savedPairs) || []);
      });
    } catch (err) {
      setError("Failed to load pairs: " + err);
      console.error(err);
    }
  }, []);

  function addPair() {
    if (!newUrl || !newBang) return;

    if (!newBang.includes("!")) {
      setError("Bang must begin with an exclaimation mark!");
      return;
    }

    const newPair: URLBangPair = {
      id: Date.now().toString(),
      url: newUrl,
      keyword: newBang,
    };

    for (const key in URLBangPairs) {
      if (URLBangPairs[key].keyword == newPair.keyword) {
        setError("Bang already exists!");
        return;
      }

      if (URLBangPairs[key].url == newPair.url) {
        setError("URL is already set to a bang!");
        return;
      }
    }

    // Check for existing pairs
    const existingKeyword = URLBangPairs.some(
      (pair) => pair.keyword === newPair.keyword
    );
    const existingUrl = URLBangPairs.some((pair) => pair.url === newPair.url);

    if (existingKeyword) {
      setError("Bang already exists!");
      return;
    }

    if (existingUrl) {
      setError("URL is already set to a bang!");
      return;
    }

    // If we get here, there are no errors
    setURLBangPairs([...URLBangPairs, newPair]);
    setNewUrl("");
    setNewBang("");
    setError(null); // Clear any existing error
  }

  function removePair(id: string) {
    setURLBangPairs(URLBangPairs.filter((pair) => pair.id !== id));
  }

  function saveSettings() {
    const pairs: { [bang: string]: URLBangPair } = {};

    URLBangPairs.forEach((pair) => {
      pairs[pair.keyword] = pair;
    });

    // const storageData: StorageResult = {
    //   savedPairs: pairs,
    // };

    try {
      chrome.storage.sync.set({ savedPairs: pairs }, () => {
        setSaveStatus("Settings saved successfully!");

        setTimeout(() => {
          setSaveStatus(null);
        }, 3000);
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("Error saving settings. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Add URLs and associated keywords below.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              Tip: Try using the specific website's search feature. In the URL,
              you should see this section:<b> /search?q=</b>
            </p>
            <br />
            <p className="text-sm text-blue-700">
              Copy and paste everything to the left (including that section),
              and add it to the pair. Your URL should look something like this:
              <b> "https://example.com/search?q="</b>
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm text-yellow-700">
              Warning: Your bang keyword must start with "!" Examples:
              "!example", "!ex", "!e"
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            URL & Bang Pairs
          </h2>

          <div className="space-y-4 mb-4">
            {error && <p className="text-red-500">{error}</p>}
            {URLBangPairs.map((pair) => (
              <div
                key={pair.id}
                className="flex items-center bg-gray-50 p-3 rounded-md"
              >
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <span className="font-medium text-gray-700 mr-2 min-w-[80px]">
                      URL:
                    </span>
                    <span className="text-gray-600 break-all">{pair.url}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center mt-1">
                    <span className="font-medium text-gray-700 mr-2 min-w-[80px]">
                      Keyword:
                    </span>
                    <span className="text-gray-600">{pair.keyword}</span>
                  </div>
                </div>
                <button
                  onClick={() => removePair(pair.id)}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                  aria-label="Remove"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            {URLBangPairs.length === 0 && (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">No pairs added yet.</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Add New URL and Bang
            </h3>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL
                </label>
                <input
                  type="text"
                  id="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/search?q="
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="keyword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Bang
                </label>
                <input
                  type="text"
                  id="keyword"
                  value={newBang}
                  onChange={(e) => setNewBang(e.target.value)}
                  placeholder="!example"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => addPair()}
                disabled={!newUrl || !newBang}
                className={`flex items-center justify-center w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  !newUrl || !newBang
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                }`}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add URL and Keyword
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          {saveStatus && (
            <div
              className={`text-sm ${
                saveStatus.includes("Error") ? "text-red-600" : "text-green-600"
              }`}
            >
              {saveStatus}
            </div>
          )}
          <button
            onClick={saveSettings}
            className="flex items-center ml-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
          >
            <Save className="h-4 w-4 mr-1" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
