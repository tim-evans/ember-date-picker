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
    this._timer = later(null, set, this, 'focused', false, 500);
  },

  formattedDate: function () {
    let value = get(this, 'date');
    let format = get(this, 'format');

    return value ? moment(value).format(get(this, format)) : null;
  }.property('date', 'format'),

  value: function (key, value) {
    if (arguments.length > 1) {
      let m = moment(value, [
        "MM-DD-YYYY",
        "YYYY-MM-DD",
        "YYYY MMM DD",
        "YYYY MM DD",
        "MMM DD, YYYY"
      ]);

      let date = null;
      if (trim(value).length && m && m.isValid()) {
        date = new Date(Date.UTC(m.year(), m.month(), m.date()));
        set(this, key, value);
        set(this, 'month', m.month());
        set(this, 'year', m.year());
      } else {
        return value;
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
  }.property('date')

});

export default DatePickerField;
