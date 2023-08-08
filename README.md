# chia-datalayer-kv-cache

The `chia-datalayer-kv-cache` is a Node.js library for accessing data from Chia's data layer with built-in caching mechanisms. The library retrieves data from the Chia datalayer, caches it in memory using NodeCache, and also backs up this cache on the filesystem.

Data retrieval follows a "cache-first" strategy. The library first tries to fetch data from the in-memory cache. If it doesn't exist there, it tries to retrieve it from the file system. If the data is not present on the file system either, it fetches the data from the Chia datalayer, stores it in the memory cache, and backs it up on the filesystem.

## Installation

Use npm to install `chia-datalayer-kv-cache`:

```sh
npm install chia-datalayer-kv-cache
```

## Configuration

Configure the library with your specific settings, such as your Chia node's host URLs and the default wallet ID.

```javascript
const chiaCache = require('chia-datalayer-kv-cache');

chiaCache.configure({
  full_node_host: "https://localhost:8555",
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl",
  default_wallet_id: 1,
});
```

## Usage

Use the `getValue(storeId, key)` function to retrieve data. The function returns a promise that resolves with the data corresponding to the given `storeId` and `key`.

```javascript
chiaCache.getValue("myStoreId", "myKey")
  .then(value => {
    console.log(value);
  })
  .catch(error => {
    console.error(error);
  });
```

## Default Configuration

The library comes with the following default configuration:

```javascript
{
  full_node_host: "https://localhost:8555",
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl",
  default_wallet_id: 1,
}
```

You can override these values using the `configure` function as shown above.

## Note

The filesystem backup of the cache is stored in a directory based on the Chia root directory (which can be resolved using the `chia-root-resolver` package). It is stored in `~/.chia/mainnet/data_layer/cache` by default. The cache directory is structured such that each storeId represents a directory and each key is a file in that directory.