import URLBangPair from "./URLBangPair";

interface StorageResult {
  savedPairs: {
    [bang: string]: URLBangPair;
  };
}

export default StorageResult;
