# Complete integration sample for the Corbado web component in Node.js with existing users in Supabase

This is a sample implementation of frontend and backend where the Corbado web component is integrated. The database provider is Supabase, an open-source Firebase alternative which already contains several password-based users. These
users are integrated using Corbado webhooks while new users are saved without a password.

**Note:** In this tutorial a customer system is created with some pre-existing password-based users. Have a look at our [docs](https://docs.corbado.com/integrations/web-component/no-existing-user-base) to see the integration if you don't have any users yet.

## 1. File structure

```
├── app.js
├── .env
├── src
|   ├── controllers
|   |   ├── authController.js           # renders views and uses Corbado SDK for sessions
|   |   └── corbadoWebhookController.js # Takes all requests belonging to the Corbado webhook logic
|   ├── routes
|   |   ├── authRoutes.js               # All routes belonging to certain views
|   |   └── corbadoWebhookRoutes.js     # All routes belonging to the Corbado webhook
|   ├── services
|   |   └── userService.js              # Communicates with Supabase
|   ├── views
|   |   ├── login.ejs                   # Login page with the webcomponent
|   |   └── profile.ejs                 # Profile page showing user info
```

## 2. Setup

### 2.1. Configure Corbado project

Please follow steps 1-4 on our [Getting started](https://docs.corbado.com/overview/getting-started) page to create and configure a project in the [developer panel](https://app.corbado.com). Use `http://localhost:19915` as origin in step 4.

Next, follow steps 4-6 on our [Web component guide](https://docs.corbado.com/integrations/web-component#4.-define-application-url) and set the application URL to `http://localhost:19915/login`, the redirect URL to `http://localhost:19915/profile` and the relying party ID to `localhost`.

In the [integration mode settings](https://app.corbado.com/app/settings/integration-mode), make sure you have selected `Webcomponent` under Integration and `Yes` under User base.

Lastly, configure the [webhooks](https://app.corbado.com/app/settings/webhooks) as seen in the image:

Also head over to [Supabase](https://supabase.com) to create and configure a project using their web interface.

### 2.2. Configure environment variables

Use the values you obtained above to configure the following variables inside `.env`:

1. **PROJECT_ID**=""
2. **API_SECRET**=""
3. **CLI_SECRET**=""

4. **WEBHOOK_USERNAME**=”webhookUsername”
5. **WEBHOOK_PASSWORD**=”webhookPassword”

6. **SUPABASE_URL**=””
7. **SUPABASE_API_KEY_SERVICE_ROLE**=””
8. **SUPABASE_JWT_SECRET**=”“

### 2.2. Start Docker containers

**Note:** Before continuing, please ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and accessible from your shell.

Use the following command to start the system:

```
docker compose up
```

**Note:** Please wait until all containers are ready. This can take some time.

## 3. Usage

After step 2.2. your local server should be fully working.

### 3.1. Test authentication

If you now visit `http://localhost:19915`, you should be forwarded to the `/login` page.

When authenticated you will be forwarded to the `/profile` page.
