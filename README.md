
# FormDataToJSON Transformer

This repository introduces a utility class that allows you to transform a `FormData` object to a `JSON` object, or vice versa. This utility comes in handy when you need to store form data in the end user's device. There are possibly following use cases:
* Store the form data in the user's device temporarily using the `LocalStorage` object.
* For hybrid mobile apps with an offline capability, store the form data in the user's device in the offline mode as text files then submit the form as soon as the user gets online. 

Files are also stored as a `Data URI` which then decoded into a `Blob` object.

The class `FormUtils` essentially exposes 4 methods as follows:
* `Promise<JSONObject> FormUtils.formDataToJson(FormData formData)`
* `Promise<JSONObject> FormUtils.formToJson(HTMLFormElement form)`
* `FormData FormUtils.jsonToFormData(JSONObject json)`
* `Promise<XMLHttpRequest> FormUtils.submit(FormData formData, string action)`

You can discover more methods by checking out the source code `FormUtils.js`
