FROM node:16 as BUILDER
WORKDIR /project
COPY environmental/ /environmental/
RUN chown -R root /environmental
COPY shared /shared
RUN chown -R root /shared
WORKDIR /environmental
RUN npm install && npm run build

FROM node:16.17.0-buster-slim as RUNNER
ENV NODE_ENV=production
COPY --from=BUILDER /environmental/build/ ./
COPY --from=BUILDER /environmental/package.json ./environmental/
COPY --from=BUILDER /environmental/package-lock.json ./environmental/
COPY --from=BUILDER /environmental/.env ./environmental/
RUN chown -R root /environmental
WORKDIR /environmental
RUN echo $(pwd)
RUN echo $(ls -la)
RUN npm ci
EXPOSE 3001
CMD ["node","index.js"]

