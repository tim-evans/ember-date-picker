import Ember from "ember";
import moment from "moment";

var later = Ember.run.later;
var cancel = Ember.run.cancel;
var trim = Ember.$.trim;

var get = Ember.get;
var set = Ember.set;

var DatePickerField = Ember.TextField.extend({

  type: 'text',

  focused: false,
  date: null,
  month: null,
  year: null,

  focusIn: function () {
    cancel(this._timer);
    set(this, 'focused', true);
  },

  focusOut: function () {
    var self = this;
    this._timer = later(function () {
      set(self, 'focused', false);
    }, 500);
  },

  formattedDate: function () {
    var value = get(this, 'date');
    var format = get(this, 'format');

    return value ? moment(value).format(format) : null;
  }.property('date', 'format'),

  value: function (key, value) {
    if (arguments.length > 1) {
      var m = moment(value, [
        "MM-DD-YYYY",
        "YYYY-MM-DD",
        "YYYY MMM DD",
        "YYYY MM DD",
        "MMM DD, YYYY"
      ]);

      var date = null;
      if (trim(value).length && m && m.isValid()) {
        date = m.startOf('day').toDate();
      }

      this._displayValue$raw = value;

      if (date) {
        set(this, 'date', date);
        set(this, 'month', m.month());
        set(this, 'year', m.year());
      }
    }

    var rawValue = this._displayValue$raw;
    if (rawValue && !get(this, 'focused')) {
      this._displayValue$raw = null;
      return rawValue;
    }

    return value || get(this, 'formattedDate');
  }.property('formattedDate')

});

export default DatePickerField;
