import Ember from "ember";
import moment from "moment";
import nearestParent from "ember-popup-menu/computed/nearest-parent";

var get = Ember.get;

var reads = Ember.computed.reads;

var isSameDay = function (a, b) {
  return a && b && moment(a).isSame(b, 'day');
};

var CalendarDay = Ember.Component.extend({
  tagName: "td",

  classNames: ['calendar-day'],
  classNameBindings: ['isSelected:selected',
                      'isDisabled:disabled',
                      'isToday:today',
                      'isInRange:in-range'],

  datePicker: nearestParent('date-picker'),
  selection: reads('datePicker.value'),

  dateRange: nearestParent('date-range-picker'),
  rangeStart: reads('dateRange.rangeStart'),
  rangeEnd: reads('dateRange.rangeEnd'),

  isToday: function () {
    return moment().isSame(get(this, 'value'), 'day');
  }.property('value'),

  isSelected: function () {
    var value = get(this, 'value');
    return isSameDay(value, get(this, 'selection')) ||
           isSameDay(value, get(this, 'rangeStart')) ||
           isSameDay(value, get(this, 'rangeEnd'));
  }.property('value', 'selection', 'rangeStart', 'rangeEnd'),

  isInRange: function () {
    var value = moment(get(this, 'value'));
    return value.isAfter(get(this, 'rangeStart'), 'day') &&
           value.isBefore(get(this, 'rangeEnd'), 'day');
  }.property('value', 'rangeStart', 'rangeEnd'),

  isDisabled: function () {
    return !moment(get(this, 'value')).isSame(get(this, 'month'), 'month');
  }.property('value', 'month'),

  click: function () {
    if (get(this, 'isDisabled')) { return; }
    var target = (get(this, 'dateRange') || get(this, 'datePicker'));
    target.send('selectDate', get(this, 'value'));
  }
});

export default CalendarDay;
