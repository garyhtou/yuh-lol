FROM node:17
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock /usr/src/app/
RUN yarn install && yarn cache clean
COPY ./ /usr/src/app
ENV NODE_ENV production
RUN npm run build
ENV PORT 80
EXPOSE 80
CMD [ "npm", "start" ]