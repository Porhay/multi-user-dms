# MUDMS &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Porhay/multi-user-dms/blob/master/LICENSE)

Multi-user dictionary management system is an application that will allow you to organize all your notes in one place. 
Thanks to the dictionary system, it will be possible to divide entries into different dictionaries and easily manipulate them.

## Installation and run
<details>
<summary>Start postgresql, install dependencies and run app</summary>

#### Requires [Node.js](https://nodejs.org/) v14+ to run.

1.Make sure you have Node.js, Docker and Git installed!

2.Install dependencies for server and client sides:
```sh
$ cd server  # client
$ npm install
```

3.Run database
```sh
$ cd server/dev-deploy/
$ make run
```

4.Start client and server from different terminals
```sh
$ cd client  # server
$ npm run start  # dev
```

</details>

