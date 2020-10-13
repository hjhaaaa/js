FROM node:slim as builder
WORKDIR /app
EXPOSE 80
COPY . /app
# RUN npm
RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build
# Second stage
FROM nginx
# copy dist from the first stage
COPY --from=builder /app/dist /usr/share/nginx/html
