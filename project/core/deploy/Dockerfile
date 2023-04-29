FROM node:16 as BUILDER
WORKDIR /core
COPY core/ /core/
RUN chown -R root /core
COPY shared /shared
RUN chown -R root /shared
WORKDIR /core
RUN npm install && npm run build

FROM node:16.17.0-buster-slim as RUNNER
ENV NODE_ENV=production
COPY --from=BUILDER /core/build/ ./
COPY --from=BUILDER /core/package.json ./core/
COPY --from=BUILDER /core/package-lock.json ./core/
COPY --from=BUILDER /core/.env ./core/
RUN chown -R root /core
WORKDIR /core
RUN echo $(pwd)
RUN echo $(ls -la)
RUN npm ci
EXPOSE 3015
CMD ["node","src/index.js"]

