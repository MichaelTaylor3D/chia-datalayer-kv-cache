# chia-datalayer-kv-cache

`chia-datalayer-kv-cache` is an NPM package designed to interact with Chia's data layer and provide a caching mechanism to enhance performance. It primarily offers methods to get and invalidate cached values, either from memory cache or from a filesystem cache. 

The package uses the NodeCache library for in-memory caching, and filesystem caching is achieved by storing values in a designated cache directory on disk. The package also includes support for Chia's data layer with the help of the `chia-datalayer-wrapper` package.

## Installation

```bash
npm install chia-datalayer-kv-cache
```

## Usage

```javascript
const {
  configure,
  getValue,
  getKeys,
  invalidateCache,
} = require("chia-datalayer-kv-cache");

// Optional: Configure the module
configure({
  full_node_host: "https://localhost:8555",
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl",
  default_wallet_id: 1,
});

// Get a value from cache or datalayer
getValue({ id: "storeId", key: "key" })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  });

// Get all keys for a storeId from cache or datalayer
getKeys({ id: "storeId" })
  .then((value) => {
    console.log(value);
  })
  .catch((error) => {
    console.error(error);
  });

// Invalidate a cache entry
invalidateCache("storeId", "key");
```

Using async/await:

```javascript
const {
  configure,
  getValue,
  getKeys,
  invalidateCache,
} = require("chia-datalayer-kv-cache");

async function main() {
  configure({
    // your configuration here...
  });

  const value = await getValue({ id: "storeId", key: "key" });
  console.log(value);

  const keys = await getKeys({ id: "storeId" });
  console.log(keys);

  invalidateCache("storeId", "key");
}

main().catch((error) => console.error(error));
```

If no configuration is provided using `configure()`, the module uses default values which can be found in the `defaultConfig.js` file.

## API

### `configure(newConfig)`

Merge the provided configuration object with the current configuration.

### `getValue({ id: storeId, key })`

Fetches the value associated with the provided `storeId` and `key` from the cache. If it's not present in the cache, it fetches from the Chia's data layer, storing the value in the cache for future retrieval.

### `getKeys({ id: storeId })`

Fetches all keys for the given `storeId` from the cache. If they're not present in the cache, it fetches from the Chia's data layer, storing the keys in the cache for future retrieval.

### `invalidateCache(storeId, key)`

Invalidates a cache entry. If only the `storeId` is provided, it invalidates all entries related to that store. If both `storeId` and `key` are provided, it invalidates the specific cache entry.

## Cache AutoInvalidation
This package uses the chia-datalayer-update-notifier package to watch the store for updates and it will automatically invalidate the cache when an update is detected.

## Support

If you find this project useful, please consider supporting our work. You can send contributions to the following Chia address:

```
xch17edp36nd9m5jfcq2sa5qp25ekrrfguvpx05zce35pf65mlvfn4gqyl0434
```

Your support is greatly appreciated!