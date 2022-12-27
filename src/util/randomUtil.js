import { v4 as uuidv4 } from "uuid";
class RandomUtil {

  /**
   * 获取随机字符串
   */
  static getUUID() {
    return uuidv4();
  }

}

export default RandomUtil;
