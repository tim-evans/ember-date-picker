import Ember from "ember";
import moment from "moment";

var get = Ember.get;
var set = Ember.get;

var computed = Ember.computed;
var trim = Ember.$.trim;

export default function (key, format) {
  return computed(key, format, function (_, value) {
    if (arguments.length > 1) {
      var m = moment(value, [
        "MM-DD-YYYY",
        "YYYY-MM-DD",
        "YYYY MMM DD",
        "YYYY MM DD",
        "MMM DD, YYYY"
      ]);

      if (trim(value).length === 0) {
        set(this, 'value', null);
      } else if (m && m.isValid()) {
        value = new Date(Date.UTC(m.year(), m.month(), m.date()));
        set(this, 'value', value);
        set(this, 'month', m.month());
        set(this, 'year', m.year());
      } else {
        return value;
      }
    }
    value = get(this, key);
    return value ? moment(value).format(get(this, format)) : null;
  });
}
