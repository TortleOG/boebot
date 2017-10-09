FROM node:8-alpine

LABEL matainer="Turtle <mahood.adam@gmail.com>"

# Add package and package-lock
WORKDIR /usr/src/boebot
COPY package.json package-lock.json .\

# Install dependencies
RUN apk add --update \
&& apk add --no-cache ffmpeg \
&& apk add --no-cache --virtual .build-deps git curl python g++ make \

# Install node.js dependencies
&& npm install --no-shrinkwrap \

# Clean up build dependencies
&& apk del .build-deps

# Add project src
COPY . .

# Expose port
EXPOSE 3000

# Enviroment vars
ENV PRODUCTION= \
  TOKEN= \
  NYT_API_KEY= \
  PORT= \
  DASH_OAUTH_SECRET= \
  DASH_CALLBACK_URL=

# CD into /src/
WORKDIR /usr/src/boebot/src

CMD ["node", "app.js"]