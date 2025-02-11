# Myresful

**Myresful** is a package for handling API requests with a built-in version check. It is designed to simplify working with RESTful APIs in Node.js while ensuring that the required Node.js version is met.

## Features

-   Handle RESTful API requests using `axios`.
-   Built-in Node.js version check.
-   Easily configurable for various API endpoints.
-   Supports Node.js versions 14, 16, 18, and 20.

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

Use `makeRequest` to send an API request. Here's an example of making a GET request:

```javascript
import myresful from 'myresful';

// Define the API URL
const apiUrl = 'https://api.example.com/data';

async function getData() {
    try {
        const response = await myresful.get({
            path: apiUrl
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data);
    } catch (error) {
        console.error('Error making API request:', error);
    }
}

getData();
```

### 2. API Request Methods

You can use `makeRequest` for different HTTP methods:

-   **GET**: To fetch data from the API.
-   **POST**: To create new data.
-   **PUT**: To update existing data.
-   **DELETE**: To delete data.

Example of a POST request:

```javascript
async function sendData() {
    try {
        const response = await myresful.post({
            path: apiUrl
            data: {
                name: 'John Doe',
                email: 'john@example.com'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error sending data:', error);
    }
}

sendData();
```

### 3. Configuration Options

-   **method**: The HTTP method (e.g., `GET`, `POST`, `PUT`, `DELETE`).
-   **headers**: Custom headers, such as authentication tokens or content types.
-   **data**: The payload (for `POST`, `PUT` requests).
-   **params**: Query parameters (for `GET` requests).
-   **responseType**: Type of response (e.g., `json`, `text`).

Example of a GET request with query parameters:

```javascript
const response = await myresful.get({
    path: apiUrl
    params: {
        query: 'my search term'
    }
});
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

Basuniproject  
[basuniproject@gmail.com](mailto:basuniproject@gmail.com)
