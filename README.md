# NestJS APM (Application Performance Monitoring)

## Overview

NestJS APM is a monitoring solution integrated with Telex to track application performance and provide insights into request handling, errors, and system metrics for NestJS applications.

## Features

- Automatic request and response logging
- Error tracking and tracing
- Performance monitoring (latency, throughput, etc.)
- Custom transaction and span tracking
- Integration with Telex for real-time monitoring

## Prerequisites

- [Node.js](https://nodejs.org/) (>=16.x)
- [NestJS](https://nestjs.com/) framework
- [Telex](https://telex.im) for real-time monitoring
- Docker & Docker Compose (if deploying with containers)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/nestjs-apm.git
   cd nestjs-apm
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy the environment file and update configurations:

   ```sh
   touch .env
   ```

   Modify `.env` with your APM server details:

   ```env
   TELEX_WEBHOOK_URL=https://your-telex-webhook-url
   ```

## Running the Application

### Development Mode

```sh
npm run start:dev
```

### Production Mode

```sh
npm run build
npm run start:prod
```

### Running with Docker

1. Build and start the container:

   ```sh
   docker-compose up -d --build
   ```

2. Check running logs:

   ```sh
   docker logs -f server
   ```

## API Endpoints

| Method | Endpoint          | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| GET    | `/simulate-error` | Simulate an error to test error tracking |

## Logging & Monitoring

NestJS APM uses the following:

- [Telex](https://www.telex.im)

## Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Create a Pull Request

## License

This project is licensed under the MIT License.
