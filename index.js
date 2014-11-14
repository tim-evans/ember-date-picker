'use strict';

module.exports = {
  name: 'ember-date-picker',
  included: function (app) {
    this._super.included(app);
    app.import("vendor/styles/ember-date-picker.css");
  }
};
