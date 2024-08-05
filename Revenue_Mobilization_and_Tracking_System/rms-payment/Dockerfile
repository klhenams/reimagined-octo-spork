# syntax=docker/dockerfile:1

# Build the application from source
FROM golang:1.15 AS build-stage

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o rms-payment

# Run the tests in the container
# FROM build-stage AS run-test-stage
# RUN go test -v ./...

# Deploy the application binary into a lean image
FROM ubuntu:latest AS build-release-stage

RUN useradd -m nonroot

USER nonroot

WORKDIR /server

COPY --from=build-stage /app/rms-payment /server/

EXPOSE 9001

ENV DOCKERIZE_VERSION v0.7.0

USER root

RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin

CMD ["dockerize","-wait","tcp://postgres:5432","/server/rms-payment"]
