import Ember from "ember";
import moment from "moment";

var get = Ember.get;

var CalendarMonth = Ember.Component.extend({

  classNames: ['calendar-month'],

  dayNames: function () {
    var firstWeek = get(this, 'weeks.firstObject');
    return firstWeek.map(function (day) {
      return moment(day).format("dd");
    });
  }.property('weeks'),

  weeks: function () {
    var month = get(this, 'month');
    var day = month.clone().startOf('week');
    var weeks = [];
    for (var iWeek = 0, nWeeks = get(this, 'minWeeks'); iWeek < nWeeks; iWeek++) {
      var week = [];
      for (var iDay = 0; iDay < 7; iDay++) {
        week.push(day.clone().toDate());
        day.add(1, 'day');
      }
      weeks.push(week);
    }
    return weeks;
  }.property('month')
});

export default CalendarMonth;
