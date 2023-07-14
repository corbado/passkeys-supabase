FROM node:18-alpine
ARG TARGETOS
ARG TARGETARCH

ENV PROJECT_ID \
    API_SECRET \
    CLI_SECRET \
    WEBHOOK_USERNAME \
    WEBHOOK_PASSWORD \
    SUPABASE_URL \
    SUPABASE_ROLE_KEY \
    SUPABASE_JWT_SECRET \
    SUPABASE_API_KEY

RUN apk add --no-cache curl

RUN apk add git

RUN curl -o /tmp/corbado_cli.tar.gz -sSL https://github.com/corbado/cli/releases/download/v1.0.2/corbado_cli_v1.0.2_${TARGETOS}_${TARGETARCH}.tar.gz && tar xfz /tmp/corbado_cli.tar.gz && mv corbado /usr/local/bin/corbado && chmod +x /usr/local/bin/corbado

WORKDIR /app

RUN apk add --update python3 make g++\
    && rm -rf /var/cache/apk/*

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./bin/startup.sh

ENTRYPOINT ./bin/startup.sh
