# typescript-nodejs-atprotocol-api

This is a sample API built with TypeScript and Node.js

## Installation and Running

1. Install dependencies:

```
$ npm install
```

2. Compile TypeScript:

```
$ npx tsc
```

3. Run the application:

```
$ node dist/app.js
```

## Testing the Login API

```
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier": "account", "password": "password"}'
```
