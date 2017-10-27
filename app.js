#!/usr/bin/env node

process.title = 'ContainScord-CLI'

var log = console.log
var err = console.error
var colors = require('colors') // eslint-disable-line no-unused-vars
var fs = require('fs')
var download = require('download')
var child = require('child_process')
var readline = require('readline')
var path = require('path')

var version = require('./package.json').version
var args = process.argv.slice(2)

// Nothing provided
if (args.length === 0) {
  err('\nNothing provided\n'.red + 'Type ' + 'csd help'.blue + ' to display the help message.')
// Help message
} else if (args[0] === 'help') {
  if (!args[1]) {
    log('\nContainscord '.magenta + `v${version}`.cyan + ' by Jaymun723\n')
    log('  csd'.green + ' new'.yellow + ' <name>'.grey + '   | Create a folder with containscord in.')
    log('  csd'.green + ' init'.yellow + '         | Create containsocrd files in your current directory.')
    log('  csd'.green + ' config'.yellow + ' [opt]'.gray + ' | Configure containscord.' + '('.gray + 'csd help config'.magenta + ' for more help.)'.gray)
    log('  csd'.green + ' start'.yellow + '        | Give instruction to start the bot.')
    log('  csd'.green + ' commands'.yellow + '     | Show commands of the bot.')
  } else if (args[1] === 'config') {
    log('\nHelp for the '.magenta + 'config '.blue + 'command.\n'.magenta)
    log('  csd config'.green + '                 | Configure all the bot.')
    log('  csd config'.green + ' show'.yellow + '            | Show the current configuration.')
    log('  csd config'.green + ' <param>'.yellow + ' [value]'.gray + ' | Configure the select param.')
    log('    examples: '.gray + 'csd config'.green + ' name'.yellow + ' My-Bot'.gray)
    log('              csd config'.green + ' prefixes'.yellow)
  }

// New bot
} else if (args[0] === 'new') {
  // No arg
  if (!args[1]) {
    log('\nNo argument provided\n'.red + 'Type ' + 'csd help'.blue + ' to display the help message.')
  } else {
    // Create directory
    fs.mkdir(args[1], function (error) {
      // Dir already exist
      if (error) {
        err('\nThis folder already exist'.red)
      } else {
        log('\nDownload in progress ...'.green)

        // Download and extract containsocrd
        download('https://github.com/Jaymun723/ContainScord/archive/master.zip', `./${args[1]}/`, { extract: true, strip: 1 }).then(function () {
          log('\nDownload done !'.magenta)
          log('\nInstalling dependencies ...'.green)

          // Dependencies
          child.exec('npm install', function (error, stdout, stderr) {
            if (error) return err(error)
            log('\nDependencies installed !'.magenta)
            log('\nGo in this directory using ' + `cd ${args[1]}`.blue + ' then type ' + 'csd config '.blue + 'to configure containscord.')
          })
        })
      }
    })
  }

// Init bot
} else if (args[0] === 'init') {
  log('\nDownload in progress ...'.green)
  // Download
  download('https://github.com/Jaymun723/ContainScord/archive/master.zip', './', { extract: true, strip: 1 }).then(function () {
    log('\nDownload done !'.magenta)
    log('\nInstalling dependencies ...'.green)

    // Dependencies
    child.exec('npm install', function (error, stdout, stderr) {
      if (error) return err(error)
      log('\nDependencies installed !'.magenta)
      log('\nType ' + 'csd config '.blue + 'to configure containscord.')
    })
  })
// Config the bot
} else if (args[0] === 'config') {
  fs.readFile('./data/config.json', function (error, result) {
    if (error) {
      err('\nUnable to find the config.json file.\n'.red + 'Type ' + 'csd init'.blue + ' to download containscord.')
    } else {
      try {
        var config = JSON.parse(result)
      } catch (error) {
        err('\nIncorrect config.json file.'.red)
        process.exit(1)
      }
      if (!args[1]) {
        if (config.version >= 2.3 || config.version === '2.2.0') {
          let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })

          rl.question('Name of the bot: '.blue, function (answer) {
            config.name = answer
            rl.question('Token of the bot: '.blue, function (answer) {
              config.token = answer
              rl.question('Playing diplayed message: '.blue, function (answer) {
                config.play_msg = answer
                rl.question('Console on command ? '.blue + '(true or false): '.gray, function (answer) {
                  if (answer === 'true') {
                    config.console_on_command = true
                  } else if (answer === 'false') {
                    config.console_on_command = false
                  }
                  rl.question('Command not found message ? '.blue + '(true or false): '.gray, function (answer) {
                    if (answer === 'true') {
                      config.not_found_msg = true
                    } else if (answer === 'false') {
                      config.not_found_msg = false
                    }
                    rl.question('Incorrect channel message ? '.blue + '(true or false): '.gray, function (answer) {
                      if (answer === 'true') {
                        config.not_correct_channel_msg = true
                      } else if (answer === 'false') {
                        config.not_correct_channel_msg = false
                      }
                      rl.question('No permission message ? '.blue + '(true or false): '.gray, function (answer) {
                        if (answer === 'true') {
                          config.no_permission_msg = true
                        } else if (answer === 'false') {
                          config.no_permission_msg = false
                        }
                        log('Prefixes of the bot '.blue + '(multiple prefixes supported, type '.gray + '.exit'.magenta + ' whan you are ok): '.gray)
                        config.prefixes = []
                        rl.on('line', function (answer) {
                          if (answer === '.exit') {
                            config.prefixes.sort(function (a, b) {
                              return a.length - b.length
                            })
                            fs.writeFile('./data/config.json', JSON.stringify(config, null, 2), function (error) {
                              if (error) {
                                err(error)
                              } else {
                                log('\nConfig done with sucess !'.magenta)
                              }
                            })
                            rl.close()
                          } else {
                            config.prefixes.push(answer)
                          }
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        } else {
          err('\nYou are using an old version of containscord...'.red)
        }
      } else if (args[1] === 'show') {
        let prefixes = []
        for (var i in config.prefixes) {
          prefixes.push(config.prefixes[i].bgBlue)
        }

        log('\nCurrent config of the bot:'.green)
        log('Name: ' + config.name.blue)
        log('Token: ' + config.token.blue)
        log('Prefixes: ' + prefixes.join(' | '.gray))
        log('Play message: ' + config.play_msg.blue)
        log('Console on command: ' + `${config.console_on_command}`.blue)
        log('Command not found message: ' + `${config.not_found_msg}`.blue)
        log('Incorrect channel message: ' + `${config.not_correct_channel_msg}`.blue)
        log('No permission message: ' + `${config.no_permission_msg}`.blue)
      } else if (args[1] === 'prefixes' || args[1] === 'prefix') {
        log('Prefixes of the bot '.blue + '(multiple prefixes supported, type '.gray + '.exit'.magenta + ' whan you are ok): '.gray)
        config.prefixes = []

        let rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.on('line', function (answer) {
          if (answer === '.exit') {
            config.prefixes.sort(function (a, b) {
              return a.length - b.length
            })
            fs.writeFile('./data/config.json', JSON.stringify(config, null, 2), function (error) {
              if (error) {
                err(error)
              } else {
                log('\nConfig done with sucess !'.magenta)
              }
            })
            rl.close()
          } else {
            config.prefixes.push(answer)
          }
        })
      } else if (config[`${args[1]}`]) {
        if (args[2]) {
          config[`${args[1]}`] = args[2]
          fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2))
          log('\nConfig changed with sucess !'.magenta)
        } else {
          let rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
          })
          rl.question(`${args[1]}: `, function (answer) {
            config[`${args[1]}`] = answer
            fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2))
            rl.close()
            log('\nConfig changed with sucess !'.magenta)
          })
        }
      } else {
        err('\nCan\'t found this option...\n'.red + 'Type ' + 'csd help config'.blue + ' to get help on the config command.')
      }
    }
  })
// Start
} else if (args[0] === 'start') {
  fs.stat('./index.js', function (error, stats) {
    if (error) {
      err('\nUnable to find the index.js file.\n'.red + 'Type ' + 'csd init'.blue + ' to download containscord.')
    } else {
      log('\nTo start the bot you can type ' + 'node .'.blue + '\nIt\'s recommanded to use ' + 'nodemon'.green + '.\nTo install it type ' + 'npm install -g nodemon'.blue + ' then launch the bot with ' + 'nodemon'.blue)
    }
  })
// Commands
} else if (args[0] === 'commands') {
  fs.readdir('./commands', function (error, result) {
    if (error) {
      err('\nUnable to find the commands directory.\n'.red + 'Type ' + 'csd init'.blue + ' to download containscord.')
    } else {
      log('\nCommands of the bot:'.green)
      result.forEach(function (command) {
        if (!`${command}`.startsWith('-')) {
          log('- ' + require(path.join(process.cwd(), 'commands', command)).name.blue)
        }
      })
    }
  })
// Unknow argument
} else {
  log('\nUnknown arguemnt\n'.red + 'Type ' + 'csd help'.blue + ' to display the help message.')
}
