FROM node:slim as builder
WORKDIR /app
EXPOSE 80
COPY . /app
# RUN npm
RUN npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
RUN npm install -registry=https://registry.npm.taobao.org
RUN npm run build
# Second stage
FROM nginx
# copy dist from the first stage
COPY --from=builder /app/dist /usr/share/nginx/html
# copy nginx.conf
COPY proxynginx.conf /etc/nginx/conf.d/proxynginx.conf
