
# JavaScript FormData<->JSON Transformer

## Overview
This repository introduces a utility class that allows you to transform a `FormData` object to a plain `JSON` object, or vice versa. This utility comes in handy when you need to store any form data, in the end user's device/browser.

Files are stored in the format of a [`Data URI`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) which then can be decoded to a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) object.

## Use Cases
* Web applications can store the form data in the format of a Plain JSON string in `LocalStorage` 
* Hybrid mobile apps with an offline capability can store the form data in the user's device as text files when the user is offline, then post the form data to the web server when the user switches online.

## Supported Methods
The class `FormUtils` essentially exposes 4 methods as follows:
* `Promise<Field[], Error> FormUtils.formDataToJson(FormData formData)`
* `Promise<Field[], Error> FormUtils.formToJson(HTMLFormElement form)`
* `FormData FormUtils.jsonToFormData(Field[] json)`
* `Promise<XMLHttpRequest, Error> FormUtils.submit(FormData formData, string url)`

You can discover more specialized methods by checking out the source code `FormUtils.js`

## To-dos
* Detailed error-handling
* Comment the code
* Define data types

## Contribution
Got an idea or found issues? Please feel free to create an issue!

## License
Feel free to fork the repository and create your own library under your own name.
