import moment from "moment";
class DateUtil {

  /**
   * 获取格式化的当前时间字符串
   *
   * @param style 格式
   * @returns {string} 时间字符串
   */
  static getNowDate(style) {
    return moment().format(style);
  }

  /**
   * 获取格式化的指定时间字符串
   *
   * @param date 时间日期
   * @param style 格式
   * @returns {string} 时间字符串
   */
  static format(date, style) {
    return moment(date).format(style);
  }
}

export default DateUtil;
