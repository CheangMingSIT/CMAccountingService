# Call Management Accounting Service

CM (Call Management) account service designed to process and manage Avaya CDR (Call Detail Record) data. Built with Kafka, NestJS, MS SQL, and Docker, it efficiently handles task delegation across multiple microservices

## Table of Contents

- [Technologies Used](#technologies-used)
- [Architecture Overview](#architecture-overview)
- [Project setup](#project-setup)
- [Environment setup](#environment-setup)
- [Stored CDR records](#stored-cdr-records-in-txt)
- [Rebuilding and Deploying a New Docker Image](#rebuilding-and-deploying-a-new-docker-image)

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

### Compile and run the project in development mode

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# watch mode for all microservices
$ pnpm run start:nxgen
```

## Production Environment setup

This project uses Docker Compose to manage services in the production environment. Update the Compose file as needed to meet production requirements. Before starting the services listed below, first create a database in **Microsoft SQL Server** as well as download **Docker**. After that, start the services in the sequence outlined below to ensure they run correctly.

### Startup Order

1. kafka
2. worker-service
3. nxgen-project

### Commands line:

```bash
# Bring up an individual container in production using docker-compose
$ docker compose -f compose.production.yaml up -d kafka
$ docker compose -f compose.production.yaml up -d nxgen-project
$ docker compose -f compose.production.yaml up -d worker-service
```

```bash
# Bring down all containers
$ docker compose down
```

## Stored CDR records in .txt

CDR records are stored in .txt format within the Docker container. The file path is as follows: `worker-service: /app/dist/assets/CDR-logs`

## Building and Deploying the Docker Images

**Follow these steps to update and deploy the Docker-based project for production:**

1. Make necessary edits

   - `docker-compose` files -> `compose.production.yaml`
   - `.env.production` configuration
   - Application Code

2. Rebuild the project

```bash
$ pnpm run build "compiled-folder-name" # rebuild individual dist folder
$ pnpm run build:all # if rebuild all dist folder
```

3. Build all the images

```bash
$ docker compose -f compose.production.yaml up -d
```

4. Save the docker images into tar files

```bash
$ docker save -o FILENAME.tar IMAGE-NAME
```

5. Transfer & Load the tar files onto the new servers

```bash
$ docker load -i FILENAME.tar
```

6. After updating the configuration in both the .env and compose.production.yaml files in the new server, repeat step 3

```bash
#   Start kafka -> worker-service -> nxgen-project
$ docker compose -f compose.production.yaml up -d kafka
$ docker compose -f compose.production.yaml up -d worker-service
$ docker compose -f compose.production.yaml up -d nxgen-project
```
