import Mock from "mockjs";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";

// #################### 博客管理——文章管理接口 #################### //

// 获取当前用户所有草稿列表
Mock.mock("/api-backend/article/draftList", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  "data|10": [
    {
      title: "@cword(5, 10)",
      draftId: "@word(16)",
      saveTime: Mock.Random.date("yyyy-MM-dd")
    }
  ]
});

// 获取单个草稿详细信息
Mock.mock("/api-backend/article/draft/12", "get", {
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data: {
    title: "@cword(10, 20)",
    draftId: "@word(16)",
    saveTime: Mock.Random.date("yyyy-MM-dd"),
    markdownContent: "@cword(10, 20)" + "\n" +
      "\n" +
      "## centos7下MySQL最小安装\n" +
      "\n" +
      "1、在官网下载最小安装包，并解压\n" +
      "\n" +
      "```shell\n" +
      "wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.25-linux-glibc2.17-x86_64-minimal.tar.xz\n" +
      "\n" +
      "tar xvf mysql-8.0.25-linux-glibc2.17-x86_64-minimal.tar.xz\n" +
      "mv mysql-8.0.25-linux-glibc2.17-x86_64-minimal.tar.xz mysql8\n" +
      "```\n" +
      "\n" +
      "2、初始化mysql\n" +
      "\n" +
      "```bash\n" +
      "groupadd mysql\n" +
      "useradd -r -g mysql -s /bin/false mysql\n" +
      "# 进入mysql安装路径,将常用的my.cnf配置文件拷贝到mysql安装目录中\n" +
      "mkdir logs\n" +
      "mkdir data\n" +
      "touch logs/slow_sql.log\n" +
      "touch logs/mysql.log\n" +
      "chown -R mysql:mysql .\n" +
      "# --datadir为mysql安装目录下的data文件夹\n" +
      "bin/mysqld --initialize --user=mysql --datadir=<basedir>/data\n" +
      "bin/mysql_ssl_rsa_setup --datadir=<basedir>/data\n" +
      "# 修改启动脚本中的basedir为mysql安装目录，datadir为mysql安装目录下的data目录\n" +
      "# vim support-files/mysql.server\n" +
      "# basedir=<basedir>\n" +
      "# datadir=<datadir>\n" +
      "# 启动mysql\n" +
      "support-files/mysql.server start --socket=<basedir>/mysql.sock\n" +
      "```\n" +
      "\n" +
      "3、修改root用户密码，设置远程访问\n" +
      "\n" +
      "```bash\n" +
      "# 其中<password>是初始化时的root密码，可以在logs/mysql.log文件中查看\n" +
      "bin/mysql -uroot -p'<password>' --socket=<basedir>/mysql.sock\n" +
      "```\n" +
      "\n" +
      "```mysql\n" +
      "ALTER USER 'root'@'localhost' IDENTIFIED BY '<你的密码>'\n" +
      "USE mysql;\n" +
      "UPDATE user SET Host = '%' WHERE User = 'root';\n" +
      "FLUSH PRIVILEGES;\n" +
      "```\n" +
      "\n" +
      "## macos下mysql最小安装\n" +
      "\n" +
      "1、在官网下载最小安装包，并解压到自定义安装目录\n" +
      "\n" +
      "下载地址：https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.26-macos11-x86_64.tar.gz\n" +
      "\n" +
      "```shell\n" +
      "# 这里使用wget命令下载\n" +
      "cd /Users/lingjiatong/software\n" +
      "wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.26-macos11-x86_64.tar.gz\n" +
      "tar zxvf mysql-8.0.26-macos11-x86_64.tar.gz\n" +
      "mv mysql-8.0.26-macos11-x86_64.tar.gz mysql8\n" +
      "```\n" +
      "\n" +
      "2、编辑mysql配置文件，并创建相关的目录文件夹和data文件夹\n" +
      "\n" +
      "```bash\n" +
      "mkdir logs\n" +
      "touch logs/mysql.log\n" +
      "touch logs/slow_sql.log\n" +
      "```\n" +
      "\n" +
      "在mysql8目录下编辑my.cnf文件，内容如下：\n" +
      "\n" +
      "```mysql\n" +
      "# 将以下<baseDir>改为自己的mysql安装路径\n" +
      "[mysqld]\n" +
      "socket = <baseDir>/mysql.sock\n" +
      "basedir = <baseDir>\n" +
      "datadir = <baseDir>/data\n" +
      "# 去除groupBy 需要选择字段\n" +
      "sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION\n" +
      "# 慢sql日志\n" +
      "slow_query_log_file = <baseDir>/logs/slow_sql.log\n" +
      "slow_query_log = on\n" +
      "long_query_time = 3\n" +
      "secure_file_priv = <baseDir>\n" +
      "# pid 设置\n" +
      "pid-file = <baseDir>/mysql.pid\n" +
      "[mysqld_safe]\n" +
      "log-error=<baseDir>/logs/mysql.log\n" +
      "```\n" +
      "\n" +
      "3、初始化mysql数据库\n" +
      "\n" +
      "```bash\n" +
      "cd mysql8\n" +
      "bin/mysqld --initialize --user=lingjiatong # 这里lingjiatong改为自己macos用户名\n" +
      "# 然后系统会打印出来root账户的密码，后面直接按照linux安装教程中的更改root初始密码的流程就完成了\n" +
      "```\n" +
      "\n" +
      "4、修改启动脚本\n" +
      "\n" +
      "```bash\n" +
      "vim support-files/mysql.server\n" +
      "# 修改如下两个变量的值为相应的值\n" +
      "basedir=<basedir>\n" +
      "datadir=$basedir/data\n" +
      "```\n" +
      "\n" +
      "后续跟linux一样，使用support-files/mysql.server 脚本进行开启和关闭mysql\n" +
      "\n" +
      "\n" +
      "\n" +
      "## 常用my.cnf配置文件\n" +
      "\n" +
      "```bash\n" +
      "# 将以下<baseDir>改为自己的mysql安装路径\n" +
      "[mysqld]\n" +
      "socket = <baseDir>/mysql.sock\n" +
      "basedir = <baseDir>\n" +
      "datadir = <baseDir>/data\n" +
      "# 去除groupBy 需要选择字段\n" +
      "sql_mode = STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION\n" +
      "# 慢sql日志\n" +
      "slow_query_log_file = <baseDir>/logs/slow_sql.log\n" +
      "slow_query_log = on\n" +
      "long_query_time = 3\n" +
      "secure_file_priv = <baseDir>\n" +
      "# pid 设置\n" +
      "pid-file = <baseDir>/mysql.pid\n" +
      "[mysqld_safe]\n" +
      "log-error=<baseDir>/logs/mysql.log\n" +
      "```\n",
  }
});

// 保存草稿
Mock.mock("/api-backend/article/saveDraft", "post", {

});

// 发布文章



