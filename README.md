# You-know-me

Telegram based bot that periodically create a poll on a channel of friends

## Environment variables

The environment variables can be load from the system itself otherwise from the ``.env`` next to the *index.js* or the executable *you-know-me.exe*

List of variables available:

- ``VERBOSE``: Log more detailed informations about errors and other topics
- ``TELEGRAM_TOKEN``: Telegram token generated by [FatherBot](https://telegram.me/BotFather)
- ``TELEGRAM_CHAT``: Telegram chat where post the polls.
- ``TELEGRAM_POLL_OPTIONS_LIMIT``: Telegram poll options limit. At the moment is 10 and so will it be by default, after that number of users the poll will be separated in multiple ones
- ``TELEGRAM_POLL_OPEN_TIME``: Telegram poll options used to set the amount of time that the poll will stay open. If none provided the value will not be applied
- ``AI_TOKEN``: AI token used to generate the questions of the poll. At the moment is not configured any AI so it's useless
- ``POLL_CRON``: Cron pattern to trigger the poll in chat. If none provided the value will be ``0 13,21 * * *``
- ``POLL_EXPIRE``: Amount of time after which the poll expires. If none, not applied.
- ``TZ``: Timezone for cron. If none provided the value will be ``Europe/Rome``
- ``GENERATOR``: Method to generate the questions. Possible values: ``static``. Default ``static``

## Telegram

Create you bot using **FatherBot** and with the API token provided by that bot use it as the environment variable ``TELEGRAM_TOKEN``.

## [UTILS] How to get telegram chat?

To get the Telegram chat create a new group on telegram add the bot and then run in console ``npm run get_chat``.
This script will scan for any bot's notification and check for a new joining message, if found will print the chat id in console.