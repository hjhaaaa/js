FROM node:12.6.0-buster-slim  as builder
WORKDIR /app
EXPOSE 80
COPY . /app
# RUN npm
RUN npm install
RUN npm run build:test
# Second stage
FROM nginx
# copy dist from the first stage
COPY --from=builder /app/dist /usr/share/nginx/html
# copy nginx.conf
COPY docker/proxynginx-k8s.conf /etc/nginx/conf.d/proxynginx.conf
