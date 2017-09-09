#!/usr/bin/env node --harmony

// Basic requirement
var program = require('commander')
var co = require('co')
var prompt = require('co-prompt')
var fs = require('fs')
var download = require('download')
var path = require('path')
var version = require('../package.json').version
var child = require('child_process')
var util = require('./util.js')
var chalk = require('chalk')

// Initialize global var
var command
var argument1

// Use commander

program
  .version(version)
  .arguments('<command> [argument1]')
  .action(function (arg1, arg2) {
    command = arg1
    argument1 = arg2
  })
  .parse(process.argv)

var dir = process.cwd()

// If there isn't any command
if (typeof command === 'undefined') {
  // Help message
  console.log('')
  console.log(chalk.cyan('ContainScord-CLI v' + version + ' by Jaymun723'))
  console.log('')
  console.log(chalk.blue('  csd ') + chalk.green('new') + chalk.italic('      To initialize the bot.'))
  console.log('')
  process.exit(0)
} else if (command === 'new') {
  // Use 'co'
  co(function * () {
    var name
    // Is an arg is given put him in the name var
    if (argument1 !== undefined) {
      name = argument1
    // Else ask for the name
    } else {
      name = yield prompt(chalk.yellow('Name of the bot: '))
    }
    // Ask for other config information
    var token = yield prompt(chalk.yellow('Token of the bot: '))
    var prefix = yield prompt(chalk.yellow('Prefix for the bot (\'mention\' to have a mention as prefix): '))

    // Ask for console_on_command
    var verbose = yield prompt(chalk.yellow('Log the console on command (\'true\' or \'false\'): '))
    // Is the result isn't true or false re-ask the question
    while (verbose !== true && verbose !== false) {
      if (verbose.toLowerCase() === 'true') {
        verbose = true
      } else if (verbose.toLowerCase() === 'false') {
        verbose = false
      } else {
        verbose = yield prompt(chalk.yellow('\'' + verbose + '\' is incorrect (only \'true\' or \'false\'): '))
      }
    }

    console.log('')
    console.log(chalk.magenta('Donwloading the last version of ContainScord...'))

    // Download the last version of ContainScord
    download('https://github.com/Jaymun723/ContainScord/archive/master.zip', path.join(dir), { extract: true, strip: 1 }).then(function () {
      console.log('')
      console.log(chalk.green('Download done with succes !'))
      console.log('')
      console.log(chalk.magenta('Write the config...'))

      // Read the config file
      var config = JSON.parse(fs.readFileSync(path.join(dir, 'data/config.json'), 'utf8'))

      // Edit the config object
      config.token = token
      config.name = name
      config.prefix = prefix
      config.console_on_command = verbose

      // Edit theconfig file
      fs.writeFile(path.join(dir, 'data/config.json'), JSON.stringify(config, null, 2), function (err) {
        if (err) return util.error(err, process)
        console.log('')
        console.log(chalk.green('Config writed succesfully !'))
        console.log('')
        console.log(chalk.magenta('Install npm modules...'))
        child.exec('npm install', function (err, stdout, stderr) {
          console.log('')
          if (err) return util.error(err, process)
          console.log(chalk.green('Npm module installed succesfuly !'))
          console.log('')
          console.log(chalk.cyan.bold.underline('New bot created with succes !'))
          process.exit(0)
        })
      })
    })
  })
}
