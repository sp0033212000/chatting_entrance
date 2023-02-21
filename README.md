## Description

This app is a chat app similar to the Google Meet.

Additionally, it's built by NextJS and the Twilio conversation service, and handled authorization by google oauth.

## Before Start

You must place an dotenv(.env.local) file at the root of your project.
And this dotenv must contain the following environment variables.

```dotenv
GOOGLE_OAUTH_CLIENT_ID="GRANT_YOUR_OWN_CLIENT_ID"
CHATTING_API_URL="REPLACE_ACCORDING_TO_YOUR_SITUATION"
#CHATTING_API_URL="https://chatting-backend-staging-3bx5o2hpxq-de.a.run.app"
ENTRANCE_WEB_DOMAIN="REPLACE_ACCORDING_TO_YOUR_SITUATION"
REACT_APP_TWILIO_ENVIRONMENT="dev"

# The following values must be populated for the local token server to dispense tokens.
# See README.md for instructions on how to find these credentials in the Twilio Console.
TWILIO_ACCOUNT_SID="GRANT_YOUR_OWN_SID"
TWILIO_API_KEY_SID="GRANT_YOUR_OWN_SID"
TWILIO_API_KEY_SECRET="GRANT_YOUR_OWN_KEY_SECRET"

# TWILIO_CONVERSATIONS_SERVICE_SID must be populated in order to use the chat feature in the app.
# Note: this variable is not required if REACT_APP_DISABLE_TWILIO_CONVERSATIONS is set to 'true'.
TWILIO_CONVERSATIONS_SERVICE_SID="GRANT_YOUR_OWN_SID"
```

## Install node_modules

```bash
yarn install
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
