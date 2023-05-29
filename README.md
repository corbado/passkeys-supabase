# Complete integration sample for the Corbado web component in Node.js
This is a sample implementation of frontend and backend where the Corbado web component is integrated.

**Note:** In this tutorial a customer system is created with some pre-existing password-based users. Have a look at our [docs](https://docs.corbado.com/integrations/web-component/no-existing-user-base) to see the integration if you don't have any users yet.

## 1. File structure
        ├── ...
        ├── .env                                     # Environment variables for the application
        ├── app.js                                   # Starting point for the application
        ├── config      
        │   └── config.js                            # Configuration file for the MySQL database
        ├── models      
        │   └── user.model.js                        # Defines user model
        ├── src                             
        │   ├── controllers                  
        │   │   ├── authController.js                # Manages requests for authentication
        │   │   └── corbadoWebhookConroller.js       # Manages requests for Corbado webhook
        │   ├── routes                  
        │   │   ├── authRoutes.js                    # Manages endpoints for authentication
        │   │   └── corbadoWebhookRoutes.js          # Manages endpoints for Corbado webhook
        │   ├── services                  
        │   │   └── userService.js                   # Manages logic for user
        │   └── views
        │       └── pages
        │           ├── login.ejs                    # Login page view contains Corbado web component
        │           └── profile.ejs                  # Profile page view
        └── ...

## 2. Setup

### 2.1. Configure environment variables
Please follow steps 1-3 on our [Getting started](https://docs.corbado.com/overview/getting-started) page to create and configure a project in the [developer panel](https://app.corbado.com).

Use the values you obtained above to configure the following variables inside `.env`:
1. **PROJECT_ID**: The project ID.
2. **API_SECRET**: The API secret.
3. **CLI_SECRET** The CLI secret.

### 2.2. Start Docker containers

**Note:** Before continuing, please ensure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and accessible from your shell.

Use the following command to start the system:
```
docker compose up
```
**Note:** Please wait until all containers are ready. This can take some time. 

## 3. Usage

After step 2.3. your local server should be fully working.

### 3.1. Test authentication

If you now visit `http://localhost:19915`, you should be forwarded to the `/login` page.

You can login with one of the existing accounts or sign-up yourself.

| Name | Email | Password |
| --- | --- | --- |
| demo_user | demo_user@company.com | demo12 |
| max | max@company.com | maxPW |
| john | john@company.com | 123456 |

When authenticated you will be forwarded to the `/profile` page.
