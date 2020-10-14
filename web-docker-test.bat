docker stop yfd-webc
docker rm yfd-webc
docker rmi yfd-web
docker build -t yfd-web .
docker run --name=yfd-webc -d -p 9121:80 yfd-web
docker logs yfd-webc