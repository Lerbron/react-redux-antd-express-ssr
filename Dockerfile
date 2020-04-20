FROM node:10.16.3
WORKDIR /home/Service
COPY . .
RUN yarn global add pm2 && yarn &&  yarn run dist
EXPOSE 4000
CMD ["pm2-docker", 'pm2.json']