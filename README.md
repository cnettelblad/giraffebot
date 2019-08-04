# Giraffe Bot
   
Giraffe is a wonderful little bot whos sole purpose in life is to enhance your discord experience ever so slightly.

## Installation
### Requirements
- NodeJS => 12.0
- npm => 6.0
- MySQL => 5.0
- yarn => 1.7.0 (optional but recommended)
### Copying the files
```bash
git clone https://github.com/cnettelblad/giraffebot
```
### Installing dependencies
**Yarn**
```bash
yarn install --prod
```
**Npm**
```bash
npm install --production
```
### Configuring
Create an .env file or rename the example file.
```bash
mv ./.env.example ./.env
```
**Example .env**
```env
# Bot Configuration
APP_TOKEN=bot-token
APP_SECRET=bot-secret
CMD_PREFIX=!

# DB Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=giraffe
```
## Running the bot
From the project root
```bash
node ./dist/main.js
```

## Contributing
Pull requests are very welcome!

## License
[MIT](https://choosealicense.com/licenses/mit/)