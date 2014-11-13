import Ember from "ember";
import moment from 'moment';
import nearestChild from "ember-popup-menu/computed/nearest-child";
import date from "../computed/date";

var generateGuid = Ember.generateGuid;

var get = Ember.get;
var set = Ember.set;

var reads = Ember.computed.reads;

var weeksInMonth = function (moment) {
  var day = moment.clone().startOf('week');
  var month = moment.month();
  var weeks = 1;
  day.add(1, 'week');
  while (day.month() === month) {
    day.add(1, 'week');
    weeks++;
  }
  return weeks;
};

var DatePicker = Ember.Component.extend({

  classNames: ['date-picker'],

  format: "MM/DD/YYYY",

  value: null,

  multimonth: false,

  icon: function () {
    return generateGuid();
  }.property(),

  popup: nearestChild('popup-menu'),

  attachTargets: function () {
    var popup = get(this, 'popup');
    var icon = get(this, 'icon');

    popup.addTarget(icon, {
      on: "click"
    });
  }.on('didInsertElement'),

  actions: {
    previousMonth: function () {
      var previousMonth = get(this, 'firstOfMonth').clone().subtract(1, 'month');
      set(this, 'month', previousMonth.month());
      set(this, 'year', previousMonth.year());
    },

    nextMonth: function () {
      var nextMonth = get(this, 'firstOfMonth').clone().add(1, 'month');
      set(this, 'month', nextMonth.month());
      set(this, 'year', nextMonth.year());
    },

    selectDate: function (date) {
      set(this, 'value', date);
      get(this, 'popup').deactivate();
    }
  },

  month: reads('currentMonth'),
  year: reads('currentYear'),

  minWeeks: function () {
    var weeks = weeksInMonth(get(this, 'firstOfMonth'));

    if (get(this, 'multimonth')) {
      return Math.max(weeks, weeksInMonth(get(this, 'nextMonth')));
    } else {
      return weeks;
    }
  }.property('firstOfMonth', 'nextMonth', 'multimonth'),

  firstOfMonth: function () {
    return moment({ year: get(this, 'year'), month: get(this, 'month') });
  }.property('year', 'month'),

  nextMonth: function () {
    return get(this, 'firstOfMonth').clone().add(1, 'month');
  }.property('firstOfMonth'),

  currentMonth: function () {
    return get(this, 'value') ?
           get(this, 'value').getMonth() :
           new Date().getMonth();
  }.property(),

  currentYear: function () {
    return get(this, 'value') ?
           get(this, 'value').getFullYear() :
           new Date().getFullYear();
  }.property(),

  displayValue: date('value', 'format')
});

export default DatePicker;
