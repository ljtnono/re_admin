class UrlUtil {


  /**
   * 删除url中的parameter
   *
   * @param url 请求路径
   * @returns {string} 删除url中的参数之后的路径
   */
  static removeParameter(url) {
    let u = new URL(url);
    return u.protocol + "//" + u.host + u.pathname;
  }

}

export default UrlUtil;
