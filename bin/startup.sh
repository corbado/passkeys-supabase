#!/bin/sh

corbado login --projectID $PROJECT_ID --cliSecret $CLI_SECRET
npm run dev &
sleep 10
corbado subscribe http://localhost:3000
