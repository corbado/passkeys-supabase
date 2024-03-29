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
|   ├── views/pages
|   |   ├── login.ejs                   # Login page with the webcomponent
|   |   └── profile.ejs                 # Profile page showing user info
```

## 2. Setup

### 2.1. Configure Corbado project

Please follow the steps on our [Getting started](https://docs.corbado.com/overview/getting-started) page to create and configure a project in the [Corbado developer panel](https://app.corbado.com). Use `http://localhost:19915` as origin.

Next, follow steps 4-6 on our [Web component guide](https://docs.corbado.com/integrations/web-component) and set the Application URL to `http://localhost:19915/login`, the Redirect URL to `http://localhost:19915/profile` and the Relying Party ID to `localhost`.

Lastly, configure the [webhooks](https://app.corbado.com/app/settings/webhooks) as seen in the image:
<img width="1238" alt="webhooks" src="https://github.com/corbado/passkeys-supabase/assets/23581140/2d158756-ddd3-4c21-b266-f88596a8add2">



### 2.2. Create Supabase project

Head over to [Supabase](https://supabase.com) to create a project using the Supabase web interface.

Next, go to the SQL Editor and execute the following query:

```SQL
CREATE OR REPLACE FUNCTION get_user_id_by_email(email TEXT)
RETURNS TABLE (id uuid)
SECURITY definer
AS $$
BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;
$$ LANGUAGE plpgsql;
```
If everything has worked fine, you should see the following success message

`Success. No rows returned`

Feel free to create some password-based users in the ```Authentication > Users``` page. Then, click on the button "Add user" in the top right. Remember to set autoconfirm to true!

### 2.3. Configure environment variables

We now need to configure the following variables inside `.env`:

Project ID as well as API secret shall be used from step 2.1.
The CLI secret is located [here](https://app.corbado.com/app/settings/credentials/cli-secret).
Your Supabase credentials can be found at ```Project Settings > API``` inside the Supabase dashboard.

```
PROJECT_ID=
API_SECRET=
CLI_SECRET=

WEBHOOK_USERNAME="webhookUsername"
WEBHOOK_PASSWORD="webhookPassword"

SUPABASE_URL=
SUPABASE_API_KEY_SERVICE_ROLE=
SUPABASE_JWT_SECRET=
```

### 2.4. Start Docker containers

**Note:** Before continuing, please ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and accessible from your shell.

Use the following command to start the system:

```
docker compose up
```

**Note:** Please wait until all containers are ready. This can take some time.

## 3. Usage

After step 2.4. your local server should be fully working.

If you now visit `http://localhost:19915`, you should be forwarded to the `/login` page.

When authenticated you will be forwarded to the `/profile` page.
