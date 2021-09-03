# Coinz

A discord economy bot that has over 25+ ways to make money. We keep updating the bot to add extra features. Coinz uses the latest stable API version of discord.

## Suggestions, bugs, feature requests

Want to contribute? Great, we love that! Please take your time on [opening a new issue](https://github.com/Aqua-Solutions2/Coinz/issues/new).


## Self-hosting
We do not recommend self-hosting the bot, but it's always an option. To selfhost the bot yourself, you need to have:
* Node - confirmed working on v16.8.0
* npm - comes with Node, the version shouldn't really matter
* A Discord bot token, and having the bot in your server
* An mongodb.com-database set up, as well as a user to it (with write access)
* A clone of the source code, this can be found [here](https://github.com/SiebeBaree/AquaSolutions) and needs to be extracted to a folder.

We will have to do this once:
* Do `npm i` inside the folder, and wait for it to finish.
* Create a file `.env` in the root of the folder.
* Change `/src/config.json` with your default values.

**Example .env file:** *(Do not use `""` or `''`)*
```
TOKEN=YOUR_BOT_TOKEN_HERE
DATABASE_URI=mongodb://127.0.0.1:27017/coinz
```

After all this, start the bot with `npm run start`.

> ### ⚠ Warning 
> There is literally no warranty if you self-host Coinz, and we will not help you set it up either. If you wish to set the bot up yourself, we expect you have well enough knowledge in Node.js.

## License

We use the GNU GPLv3-license.

> You may copy, distribute and modify the software as long as you track changes/dates in source files. Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.

Fetched from [TLDRLegal](https://tldrlegal.com/license/gnu-general-public-license-v3-(gpl-3)), please also read the [license](https://github.com/Aqua-Solutions2/Coinz/blob/master/LICENSE) if you plan on using the source code. This is only a short summary. Please also take note of that we are not forced to help you, and we won't help you host it yourself as we do not recommend you doing so.
