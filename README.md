This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and [Graphql Yoga](https://the-guild.dev/graphql/yoga-server).

# Getting Started

### Setting up Environment variables

Use the command below
```bash
    cp .env.example .env
```

Run the development server


```bash
npm run dev
```
`
Note: this also seeds the mongodb
`




Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Simple Playwright test implemented for login.tsx and register.tsx

```bash
  npx playwright test
    Runs the end-to-end tests.

  npx playwright test --ui
    Starts the interactive UI mode.
```


## Test User

`Seed.js` seeds the databse with a test user
```json
   {
    "username" : "test",
    "email" : "test@example.com",
    "password" : "password",
   }
```

## Setting up Environment variables

Use the command below
```bash
    cp .env.example .env
```


