FROM node:18-alpine
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node . .
EXPOSE 8000
RUN yarn install
CMD ["yarn", "start"]