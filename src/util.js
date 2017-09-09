var chalk = require('chalk')

module.exports = {
  error: function (text, process) {
    console.error(chalk.red.bold(text))
    process.exit(1)
  }
}
