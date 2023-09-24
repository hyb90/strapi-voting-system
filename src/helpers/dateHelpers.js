const moment = require('moment');

module.exports = {
  getDateFromTimestamp(timestamp) {
    return moment(timestamp * 1000).set({
      second: 0
    }).utcOffset(0).toDate();
  },

  getDateTimeFromStrings(date, time) {
    let _date = moment(date, 'YYYY-MM-DD');
    let _time = moment(time, 'hh:mm a');

    _date.set({
      hour: _time.get('hour'),
      minute: _time.get('minute'),
      second: _time.get('second')
    });

    return _date.utcOffset(0).toDate();
  },

  getTodayLastHour() {
    return moment().set({
      hour: 23,
      minute: 59
    }).utcOffset(0).toDate();
  },
  isNumeric(str) {
    if (Number(str)) return true
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  },
  toDate(time, date) {
    let tempTime = time.split(":");
    let dt = new Date(date);
    dt.setHours(tempTime[0]);
    dt.setMinutes(tempTime[1]);
    dt.setSeconds(tempTime[2]);
    return dt;
  },

  getTimeFromDateTime(date) {
    return moment(date).format('HH:mm:ss.SSS');
  },

  addDaysToDate(date, days) {
    // Create new Date instance
    let shiftedDate = new Date(date);
    // Add a day
    shiftedDate.setDate(date.getDate() + days);
    return shiftedDate;
  },

  addMinutesToDate(date, minutes) {
    return moment(date).add(minutes, 'm').toDate();
  },

  addMonthToDate(date, month){
    return moment(date).add(month, 'M').toDate();
  },

  getStringFromDate(date) {
    return moment(date).format('dd-mm-yyyy');
  },

  getDateForRef() {
    return moment(new Date()).format('DDMMYYYY');
  },


  getStringFromDate(date){
    return  moment(date).format('dd-mm-yyyy');
  },
  getDateFormatDateTime(date){
    return moment(date).format('yyyy-MM-DD');
  },
  getDateFromDateTime(date){
    return  moment(date).format('YYYY-MM-DD');
  },

}
