class ArrayUtil {

  /**
   * 将元素添加到数组的最前面
   *
   * @param arr 数组
   * @param item 元素
   * @returns {*} 数组
   */
  static addToFirst(arr, item) {
    let m = arr.slice();
    m.unshift(item);
    return m;
  }
}

export default ArrayUtil;
