FROM node:12
WORKDIR /usr/src/app

# copy package.json & lock
COPY package*.json ./

# Install deps
RUN npm install

# Bundle app source
COPY . .

# to run the app, the config directory must be mounted as a
# volume so the config persists between upgrades.
CMD [ "node", "hatchet.js", "start", "--config=/config/.hatchetrc.js" ]
