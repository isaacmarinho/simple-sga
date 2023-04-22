FROM node:16 as BUILDER
#FROM angular/ngcontainer as BUILDER
WORKDIR /project
COPY sga-app /sga-app
RUN chown -R $(id -u):$(id -g) /sga-app
COPY shared /shared
RUN chown -R $(id -u):$(id -g) /shared
WORKDIR /sga-app
RUN npm install
RUN npm run build --prod
RUN #node_modules/.bin/ng build --prod

FROM nginx:alpine as RUNNER
COPY --from=BUILDER /sga-app/dist/sga-app /usr/share/nginx/html
EXPOSE 80
EXPOSE 8080
EXPOSE 4200
