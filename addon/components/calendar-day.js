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

  isRangeStartVisibleInBothMonths: reads('dateRange.isRangeStartVisibleInBothMonths'),
  isRangeEndVisibleInBothMonths: reads('dateRange.isRangeEndVisibleInBothMonths'),

  isToday: function () {
    return moment().isSame(get(this, 'value'), 'day');
  }.property('value'),

  rangeStartInThisMonth: function () {
    return get(this, 'month').isSame(get(this, 'rangeStart'), 'month');
  }.property('rangeStart', 'month'),

  rangeEndInThisMonth: function () {
    return get(this, 'month').isSame(get(this, 'rangeEnd'), 'month');
  }.property('rangeEnd', 'month'),

  isRangeStartDisabled: function () {
    return get(this, 'isRangeStartVisibleInBothMonths') && get(this, 'isDisabled') && !get(this, 'rangeStartInThisMonth');
  }.property('isDisabled', 'isRangeStartVisibleInBothMonths', 'isRangeStartInThisMonth'),

  isRangeStart: function () {
    return isSameDay(get(this, 'value'), get(this, 'rangeStart')) &&
           !get(this, 'isRangeStartDisabled');
  }.property('value', 'rangeStart', 'isRangeStartDisabled'),

  isRangeEndDisabled: function () {
    return get(this, 'isRangeEndVisibleInBothMonths') && get(this, 'isDisabled') && !get(this, 'rangeEndInThisMonth');
  }.property('isDisabled', 'isRangeEndVisibleInBothMonths', 'isRangeEndInThisMonth'),

  isRangeEnd: function () {
    return isSameDay(get(this, 'value'), get(this, 'rangeEnd')) &&
           !get(this, 'isRangeEndDisabled');
  }.property('value', 'rangeEnd', 'isRangeEndDisabled'),

  isSelected: function () {
    return isSameDay(get(this, 'value'), get(this, 'selection')) ||
           get(this, 'isRangeStart') || get(this, 'isRangeEnd');
  }.property('value', 'selection', 'isRangeStart', 'isRangeEnd'),

  isInRange: function () {
    var value = moment(get(this, 'value'));
    return value.isAfter(get(this, 'rangeStart'), 'day') &&
           value.isBefore(get(this, 'rangeEnd'), 'day') &&
           !get(this, 'isRangeEndDisabled') && !get(this, 'isRangeStartDisabled');;
  }.property('value', 'rangeStart', 'rangeEnd',
             'isRangeEndDisabled', 'isRangeStartDisabled'),

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
