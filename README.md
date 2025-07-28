# 🛠️ MyResful

![npm](https://img.shields.io/npm/v/myresful)
![License](https://img.shields.io/npm/l/myresful)
![Node.js](https://img.shields.io/node/v/myresful)
![Issues](https://img.shields.io/github/issues/orangKota026/myresful)

**MyResful** is a lightweight wrapper around `axios`, designed for modern JavaScript/TypeScript applications. It includes features like:

-   Pluggable UI adapter (`loading`, `notify`)
-   Pluggable Auth adapter (store-aware JWT/etc token)
-   Path & query param serialization
-   Payload size limitation
-   Auto logout on 401
-   Custom `paramsSerializer`
-   Modular and easy to integrate

---

## 📦 Installation

To install the package, use npm or yarn:

### Using npm:

```bash
npm install myresful
```

### Using yarn:

```bash
yarn add myresful
```

---

## 🚀 Features

-   Built-in `post`, `get`, `put`, `patch`, `delete` methods using `axios`
-   Dynamic adapters for:
    -   ✅ Auth (JWT token & logout)
    -   ✅ UI (loading spinner, notifications)
-   Path serialization and validation
-   Payload size control
-   Centralized error handling

---

## 🔌 Global Adapter Setup

Configure **UI** or **Auth** and **Compress** override default adapters before use:

```javascript
import api from "myresful";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
```

### 1. Configure **UI**

```javascript
api.setUIAdapter({
	showLoading: () => useUiStore().start(),
	hideLoading: () => useUiStore().stop(),
	notify: (msg, type = "negative") => {
		useUiStore().notify({ message: msg, type });
	}
});
```

### 2. Configure **AUTH**

```javascript
api.setAuthAdapter({
	isAuthenticated: () => useAuthStore().token,
	logout: () => useAuthStore().logout()
});
```

### 3. Configure **COMPRESS**

```javascript
api.setCompressAdapter({
	isUse: () => true, // if you want to compress POST, PUT, or PATCH request bodies
	useBlob: () => true, // return true to use FormData (with Blob)
	method: (jsonStr, useBlob, filename) => {
		return method(jsonStr, useBlob, filename);
	} // optional custom compress method
});
```

---

## 📥 Example Usage

### GET Request

```javascript
await api.get({
	path: URL,
	params: {
		search: "query"
	}
});
```

### POST Request

```javascript
await api.post({
	path: URL,
	data: {
		name: "Basuni Shibah",
		email: "projectbasuni@gmail.com"
	}
});
```

### PUT Request

```javascript
await api.put({
	path: URL,
	data: {
		id: 1,
		status: "active"
	}
});
```

### PATCH Request

```javascript
await api.patch({
	path: URL,
	data: {
		id: 1,
		status: "active"
	}
});
```

### DELETE Request

```javascript
await api.remove({ path: URL + PARAMS });
```

---

## 🧠 API Reference

### RequestArgs (used in `get`, `post`, etc.)

| Field               | Type                       | Description                                                      |
| ------------------- | -------------------------- | ---------------------------------------------------------------- |
| `path`              | `string`                   | Required. API endpoint (relative or full URL). Will be validated |
| `params`            | `object` (optional)        | Query parameters                                                 |
| `data`              | `object` (optional)        | Body payload                                                     |
| `headers`           | `AxiosHeaders` (optional)  | Custom headers                                                   |
| `loading`           | `boolean` (default: true)  | Show UI loading spinner                                          |
| `errorNotification` | `boolean` (default: true)  | Show error toast                                                 |
| `responseType`      | `string` (optional)        | `'blob'`, `'json'`, etc                                          |
| `debug`             | `boolean` (default: false) | Log request info                                                 |

---

## 🛠️ Utilities

### 🔐 Auth Adapter

Use `setAuthAdapter()` to provide your own JWT getter and logout logic:

```ts
api.setAuthAdapter({
	isAuthenticated: () => "your_token",
	logout: () => {
		// e.g., redirect to login
	}
});
```

Token will be sent via `Authorization: Bearer <token>` header. On `401 Unauthorized`, `logout()` is triggered automatically.

### `checkBaseURL(debug?: boolean): boolean`

Checks if baseURL is valid.

### `serializePath(path: string, request: serializePathRequest, debug?: boolean): Promise<string>`

Serializes and validates request path.

### 🔥 Error Handling

All errors will be intercepted. If `errorNotification` is enabled (default), a toast/notify will appear.

-   `401 Unauthorized` will trigger `logout()` from your auth adapter
-   Network errors and timeouts will show a default message
-   Binary response errors will be parsed and shown if possible

---

## ⚠️ Notes

-   `isAuthenticated()` must be configured for auto-token handling.
-   Large payloads can be controlled with `maxBodyLength` (in MB).
-   Paths are automatically serialized and validated.
-   Use `setUIAdapter()` to integrate your custom loading and notification handlers
-   Use `setAuthAdapter()` to provide JWT retrieval and automatic logout on 401
-   Use `setCompressAdapter()` to enable request payload compression. Set `isUse()` to true for applicable HTTP methods.

---

## Supported Node.js Versions

This package supports the following versions of Node.js:

-   Node.js 14.x.x
-   Node.js 16.x.x
-   Node.js 18.x.x
-   Node.js 20.x.x
-   Node.js 22.x.x

---

## 🧾 TypeScript Support

`myresful` is built with full TypeScript support, including type-safe arguments and response inference.

---

## Dependencies

| Package                                        | Version   | Description                                                                |
| ---------------------------------------------- | --------- | -------------------------------------------------------------------------- |
| [`axios`](https://www.npmjs.com/package/axios) | `^1.10.0` | HTTP client untuk menangani request API.                                   |
| [`pako`](https://www.npmjs.com/package/pako)   | `^2.1.0`  | Library untuk kompresi/dekompresi gzip (digunakan untuk kompresi payload). |

---

## Development Dependencies

| Package                                                                                    | Version    | Description                                        |
| ------------------------------------------------------------------------------------------ | ---------- | -------------------------------------------------- |
| [`typescript`](https://www.npmjs.com/package/typescript)                                   | `^5.8.3`   | Bahasa pemrograman untuk menulis kode library.     |
| [`tsup`](https://www.npmjs.com/package/tsup)                                               | `^8.5.0`   | Bundler modern untuk TypeScript.                   |
| [`rollup`](https://www.npmjs.com/package/rollup)                                           | `^4.45.0`  | Bundler untuk output UMD.                          |
| [`rollup-plugin-typescript2`](https://www.npmjs.com/package/rollup-plugin-typescript2)     | `^0.36.0`  | Plugin Rollup untuk mengompilasi TypeScript.       |
| [`@rollup/plugin-commonjs`](https://www.npmjs.com/package/@rollup/plugin-commonjs)         | `^28.0.6`  | Plugin untuk mendukung CommonJS modules di Rollup. |
| [`@rollup/plugin-node-resolve`](https://www.npmjs.com/package/@rollup/plugin-node-resolve) | `^16.0.1`  | Plugin Rollup untuk resolve module `node_modules`. |
| [`@types/node`](https://www.npmjs.com/package/@types/node)                                 | `^24.0.13` | Type definitions untuk Node.js.                    |
| [`@types/pako`](https://www.npmjs.com/package/@types/pako)                                 | `^2.0.3`   | Type definitions untuk Pako.                       |

---

## License

This project is licensed under the ISC License – see the [LICENSE](LICENSE) file for details.

## Author

**Basuniproject**  
[projectbasuni@gmail.com](mailto:projectbasuni@gmail.com)

## 🤝 Contributing

Feel free to open an issue or submit a pull request if you find a bug, have a suggestion, or want to contribute to this project.  
Your contributions are always welcome and appreciated! 🚀
