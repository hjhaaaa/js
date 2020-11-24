docker stop registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-pro
docker rm registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-pro
docker rmi registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-pro
docker build -f docker/DockerfileRro -t registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-pro --no-cache .
