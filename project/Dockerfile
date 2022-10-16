FROM openresty/openresty:alpine
MAINTAINER ljtnono 935188400@qq.com
COPY dist/. /usr/local/openresty/nginx/html
COPY re_back.conf /etc/nginx/conf.d
RUN rm -rf /etc/nginx/conf.d/default.conf &&  \
    chmod 755 -R /usr/local/openresty/nginx/html
