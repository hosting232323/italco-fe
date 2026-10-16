FROM node:20

WORKDIR /app

ARG VITE_HOSTNAME
ARG VITE_GOOGLE_API_KEY

ENV VITE_HOSTNAME=$VITE_HOSTNAME
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY

ENV PORT=3000

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["npm", "run", "serve"]
