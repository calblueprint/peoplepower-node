# peoplepower-node

_Last updated: May 4, 2020 (by Aivant)_

For the peoplepower-web repo, go to: https://github.com/calblueprint/peoplepower-web

This repo is the home for any and all server-side code and scripts that are written for Blueprint's People Power Solar Cooperative Project

## Running Locally

1. Clone the repo locally using the link at the top right of this page. Most likely the command will be:

`git clone https://github.com/calblueprint/peoplepower-node.git`

2. Create a file called `.env` and copy in the contents from `.env.example`. Fill in any secrets by getting the relevant keys from slack. You will also need to add a few extras to run the Airtable Schema Generator (details below)

3. Run `ACCEPT_HIGHCHARTS_LICENSE=YES yarn install` to download the necessary packages. (You only need to add the prefix the very first time)

4. Run `yarn start` to run the app

## Deploying on Heroku

To deploy to heroku, you simply push to the following git url: `https://git.heroku.com/peoplepower-node.git` (you must have access to the heroku app.

The heroku setup includes a heroku scheduler add-on that runs the script in `bin/generateProductionData.js` once a day to update solar project's production data

It also has a PUBLIC_KEY and PRIVATE_KEY environment variable for airlock. Details on generating those below

### Airlock Keys

If you need to regenerate the Public/Private Keypair for Airlock, use the following commands and store the resulting public and private key in environment variables called PUBLIC_KEY and PRIVATE_KEY

```
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

After running these commands, the private key will be in `jwt.key` and public key will be in `jwt.key.pub`

Note: regenerating the keys will invalidate all sessions
