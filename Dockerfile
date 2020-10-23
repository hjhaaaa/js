FROM node:slim as builder
WORKDIR /app
EXPOSE 80
COPY . /app
# RUN npm
RUN set SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ && npm install node-sass
RUN npm install
RUN npm run build
# Second stage
FROM nginx
# copy dist from the first stage
COPY --from=builder /app/dist /usr/share/nginx/html
# copy nginx.conf
COPY proxynginx.conf /etc/nginx/conf.d/proxynginx.conf
