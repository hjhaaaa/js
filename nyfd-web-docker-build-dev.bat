docker stop registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-dev
docker rm registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-dev
docker rmi registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-dev 
docker build -f docker/DockerfileDev -t registry.cn-hangzhou.aliyuncs.com/mgtest/nyfd-web-dev --no-cache .
