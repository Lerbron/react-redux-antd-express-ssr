FROM node:10.16.3
WORKDIR /home/Service
COPY . .
RUN yarn && yarn run dist
EXPOSE 4000
CMD ["yarn", "pm2"]