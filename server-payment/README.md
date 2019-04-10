# Payment Server

This module keeps track of donations, packages and subscriptions.

## Usage

This project includes 2 different implementations of the data layer components.
Running this project in PRODUCTION or STAGING environment set by NODE_ENV will result into the usage of MongoDB.

For better staging, a docker-compose file is supplied in the root directory.

### Linting and prettifying (Modifies the code)

```bash
yarn format
yarn lint
```

### Building

```bash
yarn build
```

### Development

```bash
yarn watch:development
```
