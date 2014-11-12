import CalendarMonth from "ember-date-picker/components/calendar-month";
import moment from "moment";

moment.locale('en', {
  weekdaysMin : "S_M_T_W_R_F_S".split("_")
});

export default CalendarMonth;
