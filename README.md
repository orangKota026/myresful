# Myresful

**Myresful** is a package for handling API requests with a built-in version check. It is designed to simplify working with RESTful APIs in Node.js while ensuring that the required Node.js version is met.

## Features

-   Handle RESTful API requests using `axios`.
-   Built-in Node.js version check.
-   Easily configurable for various API endpoints.
-   Supports Node.js versions 14, 16, 18, and 20.
-   Supports automatic request serialization.
-   Customizable error handling and notifications.

## Installation

To install the package, use npm or yarn:

### Using npm:

```bash
npm install myresful
```

### Using yarn:

```bash
yarn add myresful
```

## Usage

### 1. Import the Package

Use Myresful to send an API request. Here's an example of making a GET request:

```javascript
import myresful from "myresful";

// Define the API URL
const apiUrl = "https://api.example.com/data";

async function getData() {
	try {
		const response = await myresful.get({
			path: apiUrl,
			headers: {
				"Content-Type": "application/json"
			}
		});

		console.log(response.data);
	} catch (error) {
		console.error("Error making API request:", error);
	}
}

getData();
```

### 2. API Request Methods

Myresful supports multiple HTTP methods:

#### GET Request

```javascript
const response = await myresful.get({
	path: apiUrl,
	params: {
		search: "query"
	}
});
```

#### POST Request

```javascript
const response = await myresful.post({
	path: apiUrl,
	data: {
		name: "John Doe",
		email: "john@example.com"
	},
	headers: {
		"Content-Type": "application/json"
	}
});
```

#### PUT Request

```javascript
const response = await myresful.put({
	path: apiUrl,
	data: {
		id: 1,
		status: "active"
	}
});
```

#### PATCH Request

```javascript
const response = await myresful.patch({
	path: apiUrl,
	data: {
		status: "updated"
	}
});
```

#### DELETE Request

```javascript
const response = await myresful.remove({
	path: apiUrl
});
```

## Configuration Options

| Option         | Type   | Description                                                 |
| -------------- | ------ | ----------------------------------------------------------- |
| `method`       | String | HTTP method (GET, POST, PUT, DELETE, PATCH)                 |
| `headers`      | Object | Custom headers (e.g., authentication tokens, content types) |
| `data`         | Object | Request payload (for POST, PUT, PATCH)                      |
| `params`       | Object | Query parameters (for GET requests)                         |
| `responseType` | String | Response type (e.g., `json`, `text`)                        |

Example with full options:

```javascript
const response = await myresful.get({
	path: apiUrl,
	params: { page: 1, limit: 10 },
	headers: { Authorization: "Bearer token" },
	responseType: "json"
});
```

## Error Handling

Myresful provides a built-in error handler. If a request fails, it automatically logs the error and can show a notification.

```javascript
try {
	const response = await myresful.get({ path: apiUrl });
	console.log(response.data);
} catch (error) {
	console.error("API Error:", error);
}
```

## Dependencies

-   **axios**: A promise-based HTTP client for the browser and Node.js.

## Development Dependencies

-   **@babel/cli**: CLI for Babel to transpile the code.
-   **@babel/core**: Babel compiler core.
-   **@babel/preset-env**: Babel preset to compile modern JavaScript to a compatible version for your environment.

## Supported Node.js Versions

This package supports the following versions of Node.js:

-   Node.js 14.x.x
-   Node.js 16.x.x
-   Node.js 18.x.x
-   Node.js 20.x.x

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Author

**Basuniproject**  
[basuniproject@gmail.com](mailto:basuniproject@gmail.com)
