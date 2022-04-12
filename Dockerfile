FROM golang:1.18-alpine AS gowasm
COPY ./langs/go /goapp
WORKDIR /goapp
ENV GOARCH=wasm
ENV GOOS=js
ENV GO111MODULE=auto
RUN go build -o main.wasm main.go

FROM tinygo/tinygo:latest as tinygowasm
COPY ./langs/tinygo /tinygoapp
WORKDIR /tinygoapp
RUN tinygo build -o main.wasm -target wasm ./main.go

FROM emscripten/emsdk:latest as cwasm
COPY ./langs/c /capp
WORKDIR /capp
RUN emcc -Os  main.c -o main.js

FROM node:14

COPY . /app
COPY --from=gowasm /goapp/main.wasm /app/langs/go
COPY --from=tinygowasm /tinygoapp/main.wasm /app/langs/tinygo
COPY --from=cwasm /capp/main.wasm /app/langs/c
COPY --from=cwasm /capp/main.js /app/langs/c

RUN apt-get update && apt-get install -y curl build-essential
RUN curl https://sh.rustup.rs -sSf | sh -s -- --default-toolchain stable -y
ENV PATH=/root/.cargo/bin:$PATH

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh


WORKDIR /app/langs/rust
RUN wasm-pack build

WORKDIR /app

RUN npm ci

RUN npm run build

EXPOSE 5000
CMD ["node", "server.js"]