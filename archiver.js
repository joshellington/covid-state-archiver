const request = require('request');
const fs = require('fs');
const YAML = require('yaml');
const { exec } = require("child_process");
const moment = require('moment');

const ymlUrl = 'https://raw.githubusercontent.com/COVID19Tracking/covid-tracking/master/urls.yaml';

request(ymlUrl, (err, res, body) => {
  states = YAML.parseAllDocuments(body);
  parseStates(states);
});

var parseStates = function(states) {
  let currentDate = moment().format('YYYY-MM-DD');
  let dir = `./archives/${currentDate}`;

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  states = [states[25]];

  states.forEach(function(state) {
    exec(`monolith -k -u "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" ${state.get('url')} -o ${dir}/${state.get('name')}.html`, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    });
  });
}
