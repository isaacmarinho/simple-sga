FROM node:16 as BUILDER
WORKDIR /messaging
COPY messaging/ /messaging/
RUN chown -R root /messaging
#COPY shared /shared
#RUN chown -R root /shared
WORKDIR /messaging
RUN npm install && npm run build

FROM node:16.17.0-buster-slim as RUNNER
ENV NODE_ENV=production
COPY --from=BUILDER /messaging/build/ ./messaging
COPY --from=BUILDER /messaging/package.json ./
COPY --from=BUILDER /messaging/package-lock.json ./
COPY --from=BUILDER /messaging/.env ./
RUN chown -R root /messaging
RUN echo $(pwd)
RUN echo $(ls -la)
RUN npm ci
EXPOSE 3010
CMD ["node","messaging/index.js"]

