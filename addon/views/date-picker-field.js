import Ember from "ember";

var later = Ember.run.later;
var cancel = Ember.run.cancel;

var set = Ember.set;

var DatePickerField = Ember.TextField.extend({

  type: 'text',

  focused: false,

  focusIn: function () {
    cancel(this._timer);
    set(this, 'focused', true);
  },

  focusOut: function () {
    this._timer = later(null, set, this, 'focused', false, 500);
  }
});

export default DatePickerField;
