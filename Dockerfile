FROM node:20-alpine
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node . .

RUN yarn install
RUN yarn build

EXPOSE 8000

CMD ["yarn", "preview"]