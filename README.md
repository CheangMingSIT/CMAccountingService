# Call Management Accounting Service

NxGen Project is a CM (Call Management) account service designed to process and manage Avaya CDR (Call Detail Record) data. Built with Kafka, NestJS, MS SQL, and Docker, it efficiently handles task delegation across multiple microservices

## Table of Contents

- [Technologies Used](#technologies-used)
- [Architecture Overview](#architecture-overview)
- [Project setup](#project-setup)
- [Environment setup](#environment-setup)
- [Stored CDR records](#stored-cdr-records-in-txt)

## Technologies Used

- Kafka
- NestJS
- Microsoft SQL Server
- Docker

## Architecture Overview

![Architecture Diagram](./assets/readme/CM-accounting.svg)

## Project setup

```bash
$ pnpm install
```

### Compile and run the project

Before compiling, delete the `dist` folders to ensure the latest build is generated.

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# watch mode for all microservices
$ pnpm run start:nxgen
```

## Production Environment setup

This project uses Docker Compose to manage services in the production environment. Update the Compose file as needed to meet production requirements. Before starting the services listed below, first create a database in **Microsoft SQL Server**. After that, start the services in the sequence outlined below to ensure they run correctly.

### Startup Order

1. Start the Kafka container
2. Start the Nxgen Project service
3. Start the Worker Service

#### Commands

```bash
# Bring up an individual container in production using docker-compose
$ docker compose -f compose.production.yaml up -d kafka
$ docker compose -f compose.production.yaml up -d nxgen-project
$ docker compose -f compose.production.yaml up -d worker-service
```

## Stored CDR records in .txt

CDR records are stored in .txt format within the Docker container. The file path is as follows: `worker-service: /app/dist/assets/CDR-logs`

## Rebuilding and Deploying a New Docker Image

**Follow these steps to update and deploy your Docker-based project:**

1. Make Necessary Edits
   - `docker-compose` files (e.g., `compose.production.yaml`)
   - `.env.production` configuration
   - Application Code

2. Rebuild the project

```bash
$ pnpm run build "compiled-folder-name"
$ pnpm run build # if rebuild all compiled folder
```

3. Build the docker image

```bash
$ docker build -t <IMAGE_NAME>:latest .
```

4. Save the docker image to tar file

```bash
$ docker save -o FILENAME.tar IMAGE-NAME
```

5. Transfer & Load the Image on the New Server

```bash
$ docker load -i FILENAME.tar
```

6.  Start Up All Containers

```bash
#   Start Kafka before other services
$ docker compose -f compose.production.yaml up -d kafka
$ docker compose -f compose.production.yaml up -d nxgen-project
$ docker compose -f compose.production.yaml up -d worker-service
```
