# peoplepower-node
This repo is the home for any and all server-side code and scripts that are written for Blueprint's People Power Solar Cooperative Project

## How to Setup

1. Clone the repo locally using the link at the top right of this page. Most likely the command will be: 

`git clone https://github.com/calblueprint/peoplepower-node.git`

2. Create a file called `.env` and copy in the contents from `.env.example`. Fill in any secrets by getting the relevant keys from slack

3. Run `yarn install` to download the necessary package

## How to Develop

Currently there is only one main file called `index.js` that will contain all of our code. 

1. Add your functions to accomplish the task you've been assigned (pull data from enphase, utility API, or generate PDF) below the main function. 

2. Have the function take in any inputs that make sense for your task and return something useful

3. Give an example of how to use the function by calling it from the main function to prove that it works

4. If there are any API keys that your code needs to run, add it to the .env file (details below

### Dealing with secrets and environment variables

Any API Keys that we don't want to save to github, we will keep in a secret filed called `.env`. Here's an example: 

```
API_KEY=12345678
OTHER_API_KEY=asdfghjkl
```

We can access these api keys from `index.js` through an object called `process.env`. For example if we wanted to print it out to the console:
```
console.log(process.env.API_KEY)
```

If you want to add an api key, just create a new line in your own `.env` file as well as `.env.example`. In the `.env.example`, _*don't*_ include the key itself. An example `.env.example` looks like:

```
API_KEY=
OTHER_API_KEY=
```

Make sure you don't commit your API keys! When in doubt, ask in slack :)
