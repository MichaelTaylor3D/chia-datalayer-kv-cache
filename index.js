const NodeCache = require("node-cache");
const memoryCache = new NodeCache();
const fs = require("fs").promises;
const path = require("path");
const Datalayer = require("chia-datalayer-wrapper");
const { getChiaRoot } = require("chia-root-resolver");
const datalayerNotifier = require("chia-datalayer-update-notifier");
const defaultConfig = require("./defaultConfig");

let config = defaultConfig;

function configure(newConfig) {
  config = { ...config, ...newConfig };
}

const getCacheDirectory = () => {
  const chiaRoot = getChiaRoot();
  return `${chiaRoot}/data_layer/cache`;
};

const getValue = async ({ id: storeId, key }) => {
  // Try to get the value from cache
  const cacheKey = `${storeId}-${key}`;
  let value = memoryCache.get(cacheKey);
  if (value) {
    console.log(`Served ${storeId} from memory cache`);
  }

  if (value === undefined) {
    // If not in cache, try to get the value from the file system
    const cacheDirectory = getCacheDirectory();
    const filePath = path.join(cacheDirectory, storeId, key);

    try {
      value = JSON.parse(await fs.readFile(filePath, "utf8"));
      console.log(`Served ${storeId} from file cache`);
      memoryCache.set(cacheKey, value); // Cache the file content
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file does not exist, get the data from the datalayer
        const datalayer = Datalayer.rpc(config);

        value = await datalayer.getValue({ id: storeId, key });

        memoryCache.set(cacheKey, value);

        fs.mkdir(path.dirname(filePath), { recursive: true })
          .then(() => fs.writeFile(filePath, JSON.stringify(value), "utf8"))
          .catch((err) => {
            console.error(err);
          });
      } else {
        return {
          success: false,
          error: error,
        };
      }
    }
  }

  // Register the store to the datalayer notifier
  // so we can invalidate the cache when a update has been detected
  datalayerNotifier.registerStore(storeId);

  return value;
};

const getKeys = async ({ id: storeId }) => {
  // Try to get the value from cache
  const cacheKey = storeId;
  let value = memoryCache.get(cacheKey);

  if (value) {
    console.log(`Served ${storeId} from memory cache`);
  }

  if (value === undefined) {
    // If not in cache, try to get the value from the file system
    const cacheDirectory = getCacheDirectory();
    const filePath = path.join(cacheDirectory, storeId, storeId);

    try {
      value = JSON.parse(await fs.readFile(filePath, "utf8"));
      console.log(`Served ${storeId} from file cache`);
      memoryCache.set(cacheKey, value); // Cache the file content
    } catch (error) {
      if (error.code === "ENOENT") {
        // If the file does not exist, get the data from the datalayer
        const datalayer = Datalayer.rpc(config);

        value = await datalayer.getKeys({ id: storeId });

        memoryCache.set(cacheKey, value);

        fs.mkdir(path.dirname(filePath), { recursive: true })
          .then(() => fs.writeFile(filePath, JSON.stringify(value), "utf8"))
          .catch((err) => {
            console.error(err);
          });
      } else {
        return {
          success: false,
          error: error,
        };
      }
    }
  }

  // Register the store to the datalayer notifier
  // so we can invalidate the cache when a update has been detected
  datalayerNotifier.registerStore(storeId);

  return value;
};

const invalidateCache = (storeId, key) => {
  // invalidate node-cache
  let cacheKey;
  let filePath;

  if (key) {
    cacheKey = `${storeId}-${key}`;
    filePath = path.join(getCacheDirectory(), storeId, key);
  } else {
    cacheKey = storeId;
    filePath = path.join(getCacheDirectory(), storeId);
  }

  memoryCache.keys().forEach((storedKey) => {
    if (storedKey.startsWith(cacheKey)) {
      memoryCache.del(storedKey);
    }
  });

  // delete the file or directory if it exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // file or directory exists, delete it
      fs.rm(filePath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`Error while deleting the file or directory: ${err}`);
        }
      });
    }
  });
};

// Watch for updates in the datalayer and invalidate 
// the cache when a update has been detected
datalayerNotifier.startWatcher((storeId) => {
  invalidateCache(storeId);
});

module.exports = {
  configure,
  getValue,
  getKeys,
  invalidateCache,
};
