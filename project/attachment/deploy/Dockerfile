FROM node:16 as BUILDER
WORKDIR /project
COPY attachment/ /attachment/
RUN chown -R root /attachment
COPY shared /shared
RUN chown -R root /shared
WORKDIR /attachment
RUN npm install && npm run build

FROM node:16.17.0-buster-slim as RUNNER
ENV NODE_ENV=production
COPY --from=BUILDER /attachment/build/ ./
COPY --from=BUILDER /attachment/package.json ./attachment/
COPY --from=BUILDER /attachment/package-lock.json ./attachment/
COPY --from=BUILDER /attachment/.env ./attachment/
RUN chown -R root /attachment
WORKDIR /attachment
RUN echo $(pwd)
RUN echo $(ls -la)
RUN npm ci
EXPOSE 3001
CMD ["node","index.js"]

