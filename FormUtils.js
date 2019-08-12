(function (window, document, Promise) {
    var FormUtils = window.FormUtils = {};
    var FormData = FormUtils.FormData = window.FormData;

    FormUtils.fileToDataUri = function (file) {
        if (file.size) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader(file);

                reader.onload = function (e) {
                    resolve(reader.result);
                };

                reader.onerror = function (e) {
                    reject(reader.error);
                };

                reader.readAsDataURL(file);
            });
        } else {
            return Promise.resolve('');
        }
    };

    FormUtils.base64ToBlob = function (base64, mimeType, sliceSize) {
        mimeType = mimeType || '';
          sliceSize = sliceSize || 512;

        var byteCharacters = atob(base64);
        var byteArrays = [];
        var byteCharactersSize = byteCharacters.length;

        for (var offset = 0; offset < byteCharactersSize; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var sliceSize = slice.length;

            var byteNumbers = new Array(sliceSize);

            for (var i = 0; i < sliceSize; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
            }

            byteArrays.push(new Uint8Array(byteNumbers));
        }

        return new Blob(byteArrays, { type: mimeType });
    };

    FormUtils.dataUriToBlob = function (dataUri) {
        if (dataUri) {
            var c = dataUri.indexOf(',');

            var mime = dataUri.substring(5, dataUri.indexOf(';'));
            var base64Data = dataUri.substr(c + 1);

               return FormUtils.base64ToBlob(base64Data, mime);
        } else {
            return new Blob();
        }
    };

    FormUtils.fieldToJson = function (name, value) {
        if (value instanceof Blob) {
            return FormUtils.fileToDataUri(value).then(function (dataUri) {
                return {
                    name: name,
                    file: value.name || '',
                    contents: dataUri,
                    isDataUri: true
                };
            });
        } else {
            return Promise.resolve({
                name: name,
                contents: value,
                isDataUri: false
            });
        }
    };

    FormUtils.formToJson = function (form) {
        var json = [];
        var promise = Promise.resolve();

        function addField(name, value) {
            promise = promise.then(function () {
                return FormUtils.fieldToJson(name, value);
            });

            promise = promise.then(function (fieldJson) {
                json.push(fieldJson);

                return Promise.resolve();
            });
        }

        for (var f = 0, leng = form.elements.length; f < leng; f++) {
            var field = form.elements[f];

            if (field.disabled || !field.name) continue;

            var tagName = field.nodeName.toLowerCase();
            var name = field.name;

            if ('input' === tagName) {
                var type = field.type.toLowerCase();

                if ('checkbox' === type || 'radio' === type) {
                    field.checked && addField(name, field.value);
                } else if ('file' === type) {
                    for (var i = 0, l = field.files.length; i < l; i++) {
                        addField(name, field.files[i]);
                    }
                } else {
                    addField(name, field.value);
                }
            } else if ('select' === tagName) {
                for (var i = 0, l = field.options.length; i < l; i++) {
                    if (field.options[i].selected) {
                        addField(name, field.options[i].value);
                    }
                }
            } else {
                addField(name, field.value);
            }
        }

        promise = promise.then(function () {
            return json;
        });

        return promise;
    };

    FormUtils.formDataToJson = function (formData) {
        var iterator = formData.entries();
        var json = [];
        var p = Promise.resolve();

        for (var field of formData.entries()) {
            (function (f) {
                p = p.then(function () {
                    return FormUtils.fieldToJson(f[0], f[1]);
                });

                p = p.then(function (fieldJson) {
                    json.push(fieldJson);
                    return Promise.resolve();
                });
            })(field);
        }

        p = p.then(function () {
            return json;
        });

        return p;
    };

    FormUtils.jsonToFormData = function (json) {
        var formData = new FormData();
        var fieldsLength = json.length;

        for (var i = 0; i < fieldsLength; i++) {
            var field = json[i];

            if (field.isDataUri) {
                formData.append(field.name, FormUtils.dataUriToBlob(field.contents), field.file);
            } else {
                formData.append(field.name, field.contents);
            }
        }

        return formData;
    };

    FormUtils.submit = function (formData, action) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open("POST", action, true);

              xhr.onload = function (e) {
                  if (xhr.status >= 200 && xhr.status < 300)  {
                      resolve(xhr);
                  } else {
                      var error = new Error(xhr.statusText);

                    error.code = xhr.status;
                    error.xhr = xhr;

                    reject(error);
                  }
            };

            xhr.onabort = function (e) {
                var error = new Error('Request Aborted');

                error.code = 1001;
                error.xhr = xhr;

                reject(error);
            };

            xhr.ontimeout = function (e) {
                var error = new Error('Request Timed Out');

                error.code = 1002;
                error.xhr = xhr;

                reject(error);
            };

            xhr.onerror = function (e) {
                var error = new Error('Unspecified Error');

                error.code = 1000;
                error.xhr = xhr;

                reject(error);
            };

            xhr.send(formData);
        });
    };
})(window, document, Promise);