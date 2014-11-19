import Ember from "ember";
import DatePicker from "./date-picker";
import nearestChild from "ember-popup-menu/computed/nearest-child";
import date from "../computed/date";
import visibleInBothMonths from "../computed/visible-in-both-months";

var get = Ember.get;
var set = Ember.set;

var next = Ember.run.next;
var scheduleOnce = Ember.run.scheduleOnce;

var alias = Ember.computed.alias;

var DateRangePicker = DatePicker.extend({

  multimonth: true,

  "range-start": alias("rangeStart"),
  rangeStart: null,

  "range-end": alias("rangeEnd"),
  rangeEnd: null,

  actions: {
    selectDate: function (value) {
      var target;
      var focus;

      if (get(this, 'start.focused')) {
        target = 'rangeStart';
      } else if (get(this, 'end.focused')) {
        target = 'rangeEnd';
      } else {
        if (get(this, 'rangeStart')) {
          target = 'rangeEnd';
        } else {
          target = 'rangeStart';
        }
      }

      if (target === 'rangeStart') {
        focus = 'start';
        if (get(this, 'rangeEnd') == null) {
          focus = 'end';
        }
      } else {
        focus = 'end';
        if (this._lastTarget === 'rangeStart' &&
            get(this, 'rangeEnd') == null) {
          focus = null;
        }
      }

      set(this, target, value);

      this._lastTarget = target;
      if (focus != null) {
        scheduleOnce('render', get(this, focus).$(), 'focus');
      } else {
        get(this, 'popup').deactivate();
      }
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

    next(this, function () {
      popup.addTarget(get(this, 'start'), {
        on: "focus hold"
      });
      popup.addTarget(get(this, 'end'), {
        on: "focus hold"
      });
    });
  }.on('didInsertElement'),

  displayRangeStart: date('rangeStart', 'format'),
  displayRangeEnd: date('rangeEnd', 'format'),

  isRangeStartVisibleInBothMonths: visibleInBothMonths('rangeStart'),
  isRangeEndVisibleInBothMonths: visibleInBothMonths('rangeEnd')
});


export default DateRangePicker;
