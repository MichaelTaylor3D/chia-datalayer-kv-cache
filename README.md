# chia-datalayer-kv-cache

A caching module for Chia's datalayer key-value stores. It caches the values of keys in a store, in both memory (using the node-cache package) and on the file system. The package checks for cached values in the memory cache and file system before finally fetching from the datalayer if not found. 

The module provides an additional layer of caching for datalayer requests, enhancing speed and efficiency for frequent data retrievals. It leverages both in-memory caching for swift access to recent data and file system caching for longer-term, persistent storage.

## Installation

```
npm install chia-datalayer-kv-cache
```

## Usage

Before using the `getValue` function, you may optionally use the `configure` function to specify the hosts and paths for your Chia configuration. If not used, the module will default to certain predefined values.

### Promise Chain

```javascript
const { configure, getValue } = require('chia-datalayer-kv-cache');

configure({
  full_node_host: "https://localhost:8555",
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl",
  default_wallet_id: 1,
});

getValue('storeId', 'key')
  .then(value => console.log(value))
  .catch(error => console.error(error));
```

### Async/Await

```javascript
const { configure, getValue } = require('chia-datalayer-kv-cache');

configure({
  full_node_host: "https://localhost:8555",
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl",
  default_wallet_id: 1,
});

async function main() {
  try {
    const value = await getValue('storeId', 'key');
    console.log(value);
  } catch (error) {
    console.error(error);
  }
}

main();
```

## API

### `configure(newConfig)`

Configures the module with the given `newConfig`. This step is optional, and if not performed, default configuration values will be used.

- `newConfig` - A configuration object containing properties: 
  - `full_node_host`
  - `datalayer_host`
  - `wallet_host`
  - `certificate_folder_path`
  - `default_wallet_id`

### `getValue(storeId, key)`

Attempts to get the value of a key in a store. First checks the memory cache, then the file system cache, and finally the datalayer if the key is not found in the caches. Returns a promise that resolves to the value of the key.

- `storeId` - The ID of the store.
- `key` - The key to get the value of.

### `invalidateCache(storeId, key)`

Invalidates the cache for a specific key in a store, both in the memory cache and the file system cache.

- `storeId` - The ID of the store.
- `key` - The key to invalidate the cache of.

## Support

If you find this project useful, please consider supporting our work. You can send contributions to the following Chia address:

```
xch17edp36nd9m5jfcq2sa5qp25ekrrfguvpx05zce35pf65mlvfn4gqyl0434
```

Your support is greatly appreciated!