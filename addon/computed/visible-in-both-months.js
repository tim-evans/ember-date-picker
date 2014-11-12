import Ember from "ember";
import moment from "moment";

var get = Ember.get;
var computed = Ember.computed;

export default function (key) {
  return computed(key, 'firstOfMonth', 'nextMonth', 'minWeeks', function () {
    var range = get(this, key);
    if (range == null) { return false; }

    var start = get(this, 'nextMonth').clone().startOf('week').subtract(1, 'day');
    var end = get(this, 'firstOfMonth').clone()
                                       .endOf('week')
                                       .add(get(this, 'minWeeks') - 1, 'weeks');
    range = moment(range);

    return range.isAfter(start) && range.isBefore(end);
  });
}
