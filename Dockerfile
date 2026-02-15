FROM swr.cn-north-4.myhuaweicloud.com/ddn-k8s/docker.io/library/nginx:stable-alpine
# 拷贝刚才写的 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 拷贝打包好的静态文件
COPY dist/ /usr/share/nginx/html/
EXPOSE 80