const NodeCache = require("node-cache");
const memoryCache = new NodeCache();
const fs = require("fs").promises;
const path = require("path");
const Datalayer = require("chia-datalayer-wrapper");
const { getChiaRoot } = require("chia-root-resolver");

let config = defaultConfig;

function configure(newConfig) {
  config = { ...config, ...newConfig };
}

const getCacheDirectory = () => {
  const chiaRoot = getChiaRoot();
  return `${chiaRoot}/data_layer/cache`;
};

const getValue = async (storeId, key) => {
  // Try to get the value from cache
  const cacheKey = `${storeId}-${key}`;
  let value = memoryCache.get(cacheKey);

  if (value === undefined) {
    // If not in cache, try to get the value from the file system
    const cacheDirectory = getCacheDirectory();
    const filePath = path.join(cacheDirectory, storeId, key);

    try {
      value = await fs.readFile(filePath, "utf8");
      memoryCache.set(cacheKey, value); // Cache the file content
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file does not exist, get the data from the datalayer
        const datalayer = Datalayer.rpc(config);

        value = await datalayer.getValue(storeId, key); // Assuming the datalayer has a getValue method

        memoryCache.set(cacheKey, value);

        fs.mkdir(path.dirname(filePath), { recursive: true })
          .then(() => fs.writeFile(filePath, JSON.stringify(data), "utf8"))
          .catch((err) => {
            console.error(err);
          });
      } else {
        throw error; // Rethrow the error if it's not 'ENOENT'
      }
    }
  }

  return value;
};

module.exports = {
  configure,
  getValue,
};
