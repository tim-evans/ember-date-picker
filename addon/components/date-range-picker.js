import Ember from "ember";
import DatePicker from "./date-picker";
import nearestChild from "ember-popup-menu/computed/nearest-child";
import date from "../computed/date";
import visibleInBothMonths from "../computed/visible-in-both-months";

var get = Ember.get;
var set = Ember.set;

var next = Ember.run.next;

var alias = Ember.computed.alias;

var DateRangePicker = DatePicker.extend({

  classNameBindings: ['isRangeStartVisibleInBothMonths:deduplicate-range-in-first-month',
                      'isRangeEndVisibleInBothMonths:deduplicate-range-in-last-month'],

  multimonth: true,

  "range-start": alias("rangeStart"),
  rangeStart: null,

  "range-end": alias("rangeEnd"),
  rangeEnd: null,

  actions: {
    selectDate: function (date) {
      if (get(this, 'rangeStart')) {
        set(this, 'rangeEnd', date);
      } else {
        set(this, 'rangeStart', date);
      }
      get(this, 'popup').deactivate();
    }
  },

  // .............................................
  // Popup Menu
  //

  createChildView: function (childView, options) {
    var view = this._super(childView, options);
    if (Ember.TextField.detect(childView)) {
      if (get(this, 'start') == null) {
        set(this, 'start', view);
      } else {
        set(this, 'end', view);
      }
    }
    return view;
  },

  popup: nearestChild('popup-menu'),

  attachTargets: function () {
    var popup = get(this, 'popup');
    var icon = get(this, 'icon');

    popup.addTarget(icon, {
      on: "click",
      anchor: true
    });

    next(this,function () {
      popup.addTarget(get(this, 'start'), {
        on: "focus"
      });
      popup.addTarget(get(this, 'end'), {
        on: "focus"
      });
    });
  }.on('didInsertElement'),

  displayRangeStart: date('rangeStart', 'format'),
  displayRangeEnd: date('rangeEnd', 'format'),

  isRangeStartVisibleInBothMonths: visibleInBothMonths('rangeStart'),
  isRangeEndVisibleInBothMonths: visibleInBothMonths('rangeEnd')
});


export default DateRangePicker;
