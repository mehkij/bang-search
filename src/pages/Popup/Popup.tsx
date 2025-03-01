import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import StorageResult from "../../types/StorageResult";
import URLBangPair from "../../types/URLBangPair";

function Popup() {
  const [URLBangPairs, setURLBangPairs] = useState<URLBangPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      chrome.storage.sync.get(["savedPairs"], (result: StorageResult) => {
        setURLBangPairs(Object.values(result.savedPairs) || []);
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load pairs: " + err);
      console.error(err);
      setLoading(false);
    }
  }, []);

  function openSettings() {
    chrome.runtime.openOptionsPage();
  }

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold">!Bang Search</h1>
        <button
          onClick={openSettings}
          className="p-1 hover:bg-blue-700 rounded-full transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <h2 className="text-md font-medium text-gray-700 mb-3">
          Your URL & Bang Pairs
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {error && <p className="text-red-500">{error}</p>}
            {URLBangPairs.length > 0 ? (
              URLBangPairs.map((pair) => (
                <div key={pair.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex flex-col">
                    <div className="flex items-start">
                      <span className="font-medium text-gray-700 mr-1 min-w-[70px]">
                        URL:
                      </span>
                      <span className="text-gray-600 text-sm break-all">
                        {pair.url}
                      </span>
                    </div>
                    <div className="flex items-start mt-1">
                      <span className="font-medium text-gray-700 mr-1 min-w-[70px]">
                        Keyword:
                      </span>
                      <span className="text-gray-600 text-sm">
                        {pair.keyword}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">No URL-keyword pairs found.</p>
                <button
                  onClick={openSettings}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                >
                  Add some in settings
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Click the settings icon to manage your URL-keyword pairs.
        </p>
      </div>
    </div>
  );
}

export default Popup;
