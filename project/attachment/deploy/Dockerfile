FROM node:16 as BUILDER
WORKDIR /attachment
COPY attachment/ /attachment/
RUN chown -R root /attachment
#COPY shared /shared
#RUN chown -R root /shared
WORKDIR /attachment
RUN npm install && npm run build

FROM node:16.17.0-buster-slim as RUNNER
ENV NODE_ENV=production
COPY --from=BUILDER /attachment/build/ ./attachment
COPY --from=BUILDER /attachment/package.json ./
COPY --from=BUILDER /attachment/package-lock.json ./
COPY --from=BUILDER /attachment/.env ./
RUN chown -R root /attachment
RUN mkdir -p /attachment/temp/uploads/
RUN chmod -R 777 /attachment/temp
RUN echo $(pwd)
RUN echo $(ls -la)
RUN npm ci
WORKDIR /attachment
EXPOSE 3002
CMD ["node","index.js"]

