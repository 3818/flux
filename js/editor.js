// JavaScript Document
(function() {
  var ImageUploader;

  ImageUploader = (function() {
    ImageUploader.imagePath = 'image.png';

    ImageUploader.imageSize = [600, 174];

    function ImageUploader(dialog) {
      this._dialog = dialog;
      this._dialog.addEventListener('cancel', (function(_this) {
        return function() {
          return _this._onCancel();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.cancelupload', (function(_this) {
        return function() {
          return _this._onCancelUpload();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.clear', (function(_this) {
        return function() {
          return _this._onClear();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.fileready', (function(_this) {
        return function(ev) {
          return _this._onFileReady(ev.detail().file);
        };
      })(this));
      this._dialog.addEventListener('imageuploader.mount', (function(_this) {
        return function() {
          return _this._onMount();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.rotateccw', (function(_this) {
        return function() {
          return _this._onRotate('CCW');
        };
      })(this));
      this._dialog.addEventListener('imageuploader.rotatecw', (function(_this) {
        return function() {
          return _this._onRotate('CW');
        };
      })(this));
      this._dialog.addEventListener('imageuploader.save', (function(_this) {
        return function() {
          return _this._onSave();
        };
      })(this));
      this._dialog.addEventListener('imageuploader.unmount', (function(_this) {
        return function() {
          return _this._onUnmount();
        };
      })(this));
    }

    ImageUploader.prototype._onCancel = function() {};

    ImageUploader.prototype._onCancelUpload = function() {

     // Stop the upload
        if (this.xhr) {
            this.xhr.upload.removeEventListener('progress', xhrProgress);
            this.xhr.removeEventListener('readystatechange', xhrComplete);
            this.xhr.abort();
        }

      clearTimeout(this._uploadingTimeout);
      return this._dialog.state('empty');
    };

    ImageUploader.prototype._onClear = function() {
      this.imagePath =  null;
      return this._dialog.clear();
    };

    ImageUploader.prototype._onFileReady = function(file) {
      var upload;
      var dialog = this._dialog;

      // Upload a file to the server
        var formData;

        // Define functions to handle upload progress and completion
        xhrProgress = function (ev) {
            // Set the progress for the upload
            dialog.progress((ev.loaded / ev.total) * 100);
        }

        xhrComplete = function (ev) {
            var response;

            // Check the request is complete
            if (ev.target.readyState != 4) {
                return;
            }

            // Clear the request
            this.xhr = null
            this.xhrProgress = null
            this.xhrComplete = null

            // Handle the result of the upload
            if (parseInt(ev.target.status) == 200) {
                // Unpack the response (from JSON)
                response = JSON.parse(ev.target.responseText);

                // Store the image details
                image = {
                    size: response.size,
                    url: response.url
                    };

                // Populate the dialog
                dialog.populate(image.url, image.size);

            } else {
                // The request failed, notify the user
                new ContentTools.FlashUI('no');
            }
        }

        // Set the dialog state to uploading and reset the progress bar to 0
        dialog.state('uploading');
        dialog.progress(0);

        // Build the form data to post to the server
        formData = new FormData();
        formData.append('image', file);

        // Make the request
        this.xhr = new XMLHttpRequest();
        this.xhr.upload.dialog = this._dialog;
        this.xhr.upload.addEventListener('progress', xhrProgress);
        this.xhr.addEventListener('readystatechange', xhrComplete);
        this.xhr.open('POST', 'php/uploadImage.php', true);
        this.xhr.send(formData);
    };

    ImageUploader.prototype._onMount = function() {};

    ImageUploader.prototype._onRotate = function(direction) {
      // Request a rotated version of the image from the server
        var formData;

        // Define a function to handle the request completion
        xhrComplete = function (ev) {
            var response;

            // Check the request is complete
            if (ev.target.readyState != 4) {
                return;
            }

            // Clear the request
            this.xhr = null
            xhrComplete = null

            // Free the dialog from its busy state
            this._dialog.busy(false);

            // Handle the result of the rotation
            if (parseInt(ev.target.status) == 200) {
                // Unpack the response (from JSON)
                response = JSON.parse(ev.target.responseText);

                // Store the image details (use fake param to force refresh)
                image = {
                    size: response.size,
                    url: response.url + '?_ignore=' + Date.now()
                    };

                // Populate the dialog
                this._dialog.populate(image.url, image.size);

            } else {
                // The request failed, notify the user
                new ContentTools.FlashUI('no');
            }
        }

        // Set the dialog to busy while the rotate is performed
        this._dialog.busy(true);

        // Build the form data to post to the server
        formData = new FormData();
        formData.append('url', image.url);
        formData.append('direction', direction);

        // Make the request
        this.xhr = new XMLHttpRequest();
        this.xhr.addEventListener('readystatechange', xhrComplete);
        this.xhr.open('POST', '/rotate-image', true);
        this.xhr.send(formData);
    };

    ImageUploader.prototype._onSave = function() {
        var crop, cropRegion, formData;
        dialog = this._dialog;
        // Define a function to handle the request completion
        xhrComplete = function (ev) {
            // Check the request is complete
            if (ev.target.readyState !== 4) {
                return;
            }

            // Clear the request
            this.xhr = null
            xhrComplete = null

            // Free the dialog from its busy state
            dialog.busy(false);

            // Handle the result of the rotation
            if (parseInt(ev.target.status) === 200) {
                // Unpack the response (from JSON)
                var response = JSON.parse(ev.target.responseText);

                // Trigger the save event against the dialog with details of the
                // image to be inserted.
                dialog.save(
                    response.url,
                    response.size,
                    {
                        'alt': response.alt,
                        'data-ce-max-width': image.size[0]
                    });

            } else {
                // The request failed, notify the user
                new ContentTools.FlashUI('no');
            }
        }

        // Set the dialog to busy while the rotate is performed
        this._dialog.busy(true);

        // Build the form data to post to the server
        formData = new FormData();
        formData.append('url', image.url);

        // Set the width of the image when it's inserted, this is a default
        // the user will be able to resize the image afterwards.
        formData.append('width', 600);

        // Check if a crop region has been defined by the user
        if (this._dialog.cropRegion()) {
            formData.append('crop', this._dialog.cropRegion());
        }

        // Make the request
        this.xhr = new XMLHttpRequest();
        this.xhr.addEventListener('readystatechange', xhrComplete);
        this.xhr.open('POST', 'php/insertImage.php', true);
        this.xhr.send(formData);
    };

    ImageUploader.prototype._onUnmount = function() {};

    ImageUploader.createImageUploader = function(dialog) {
      return new ImageUploader(dialog);
    };

    return ImageUploader;

  })();

  window.ImageUploader = ImageUploader;	


	window.onload = function() {
	    var editor;
		ContentTools.StylePalette.add([new ContentTools.Style('Author', 'author', ['p'])]);
    ContentTools.IMAGE_UPLOADER =  window.ImageUploader.createImageUploader;
		editor = ContentTools.EditorApp.get();
		editor.init('*[data-editable]', 'data-name');
		
		editor.addEventListener('saved', function (ev) {
			var name, payload, regions, xhr;
		
			// Check that something changed
			regions = ev.detail().regions;
			if (Object.keys(regions).length == 0) {
				return;
			}
		
			// Set the editor as busy while we save our changes
			this.busy(true);
		
			// Collect the contents of each region into a FormData instance
			payload = new FormData();
			/*for (name in regions) {
				if (regions.hasOwnProperty(name)) {
					payload.append(name, regions[name]);
				}
			}*/
      payload.append('page', window.location.pathname);
      payload.append('images', JSON.stringify(getImages()));
      payload.append('regions', JSON.stringify(regions));
		
			// Send the update content to the server to be saved
			function onStateChange(ev) {
				// Check if the request is finished
				if (ev.target.readyState == 4) {
					editor.busy(false);
					if (ev.target.status == '200') {
						// Save was successful, notify the user with a flash
						new ContentTools.FlashUI('ok');
					} else {
						// Save failed, notify the user with a flash
						new ContentTools.FlashUI('no');
					}
				}
			};

		  function getImages() {
        // Return an object containing image URLs and widths for all regions
        var descendants, i, images;

        images = {};
        for (name in editor.regions) {
            // Search each region for images
            descendants = editor.regions[name].descendants();
            for (i = 0; i < descendants.length; i++) {
                // Filter out elements that are not images
                if (descendants[i].constructor.name !== 'Image') {
                    continue;
                }
                images[descendants[i].attr('src')] = descendants[i].size()[0];
            }
        }

        return images;
     }

			xhr = new XMLHttpRequest();
			xhr.addEventListener('readystatechange', onStateChange);
			xhr.open('POST', 'php/save.php');
			xhr.send(payload);
		});
	}
}).call(this);
