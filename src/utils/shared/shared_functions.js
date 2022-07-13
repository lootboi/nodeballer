////////// TO DO ///////////////
// Add item manip functionality
// Research api's to better suit searches and filtering
// https://github.com/zt3h/MaroAPI/blob/main/src/constants/misc.js
// https://github.com/kr45732/rust-query-api/blob/main/examples/examples.md
// https://query-api.herokuapp.com/query?key=&bin=true&item_id=FLOWER_OF_TRUTH&tier=LEGENDARY&item_name=%%E2%9C%AA%E2%9C%AA%E2%9C%AA%E2%9C%AA%E2%9C%AA%&sort=ASC&limit=50

const { compareItems } = require('../compare/compare_functions');
const { scanItems } = require('../underbin_scan/scan_functions');
const { getBinInfo } = require('../present_bin/presentBin_functions');
const { hypixel } = require('../api/rebornapi');

const superagent = require('superagent');
const inquirer = require('inquirer');
const readline = require('readline');
const chalk = require('chalk');

async function initialPrompt() {

    hypixel.getPlayer('MidsOnly').then(player => {
        console.log(player.level); // 141
      }).catch(e => {
        console.error(e);
      })
    
      hypixel.Auction(1, true).then(data => {
        console.log(data); // "FLOWER_OF_TRUTH"]);
      }).catch(e => {
        console.error(e);
      });

    let comparing = false;

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'findBIN',
          message: 'What would you like to do?',
          choices: [
            'Search for present BIN info',
            'Compare item to similar items',
            'Scan for good items ;)',
            'Exit',
            ],
        },
      ])
      .then(answers => {
        if (answers.findBIN === 'Search for present BIN info') {
            comparing = false;
          defineItem(comparing);
        } 
        if (answers.findBIN === 'Compare item to similar items') {
          comparing = true;
          compareItems(comparing);
        }
        if (answers.findBIN === 'Scan for good items ;)') {
          scanItems();
        }
        if (answers.findBIN === 'Exit') {
          console.log(chalk.blue('  nodepixel.com/'));
        }
    });
  }

async function defineItem(comparing) {
console.log(comparing);
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
    let item = '';
    rl.question('  What item would you like to search for?', (answer) => {
    const semiParsedAnswer = answer.replace(/ /g, '_');
    const parsedAnswer = semiParsedAnswer.toUpperCase();
    item = parsedAnswer;
    console.log(`  Searching for ${item}...`);
    checkItem(item, comparing);
    rl.close();
    });
}

async function defineTier(item, comparing) {
console.log(comparing);
inquirer
.prompt([
{
    type: 'list',
    name: 'findTier',
    message: 'What Tier item for ' + item + '?',
    choices: [
            'Mythic',
            'Legendary',
            'Epic',
            'Rare',
            'Uncommon',
            'Common',
            ],
},
])
.then(answers => {
let tier = '';
    const semiParsedAnswer = answers.findTier.replace(/ /g, '_');
    const parsedAnswer = semiParsedAnswer.toUpperCase();
    tier = parsedAnswer;
    console.log(`  Searching for ${tier} ${item}...`);
    checkTier(item, tier, comparing);
});
}

async function defineStars(item, tier, comparing) {
    console.log(comparing);
let stars = '';
inquirer
.prompt([
    {
    type: 'list',
    name: 'findStars',
    message: 'What stars item for ' + item + '?',
    choices: [
                '5',
                '4',
                '3',
                '2',
                '1',
            ],
    },
])
.then(answers => {
    if(answers.findStars === '5') {
        stars = '✪✪✪✪✪';
    }
    if(answers.findStars === '4') {
        stars = '✪✪✪✪';
    }
    if(answers.findStars === '3') {
        stars = '✪✪✪';
    }
    if(answers.findStars === '2') {
        stars = '✪✪';
    }
    if(answers.findStars === '1') {
        stars = '✪';
    }
    console.log(`  Searching for ${stars} ${tier} ${item}...`);
        checkStars(item, tier, stars, comparing);
});
}

async function checkItem(item, comparing) {
    console.log(comparing);
    superagent.get('https://query-api.herokuapp.com/query')
    .query({
    bin: true,
    item_name: item,
    })
    .end((err, res) => {
        if (err) { return console.log(err); }
        if(res.body.length > 0) {
        defineTier(item, comparing);
        } else {
        console.log(chalk.red('  Item not found, please try again'));
        initialPrompt();
        }
    })
}

async function checkTier(item, tier, comparing) {
    console.log(comparing);
    superagent.get('https://query-api.herokuapp.com/query')
        .query({
            bin: true,
            item_name: item,
            tier: tier,
            })
            .end((err, res) => {
                if (err) { return console.log(err); }
                if(res.body.length > 0) {
                    defineStars(item, tier, comparing);
                } else {
                    console.log(chalk.red('  Item not found, please try again'));
                    initialPrompt();
                }
            });
        }

  async function checkStars(item, tier, stars, comparing) {
    console.log(comparing);
    console.log('Finding items that match your query...');
    superagent.get('https://query-api.herokuapp.com/query')
    .query({
        bin: true,
        item_id: item,
        tier: tier,
        item_name: '%' + stars + '%'
        })
        .end((err, res) => {
        console.log(res.body);
          if(err) { return console.log(err); }
          console.log(chalk.green('  Items found!'));
          console.log(comparing);
            if(res.body.length > 0 && comparing === true) {
                console.log('Getting comparison Data...');
                getComparisonData(item, tier, stars);
            }
            if(res.body.length > 0 && comparing === false) {
                console.log('Getting Bin Data...');
                getBinInfo(item, tier, stars);
            }
            if(res.body.length === 0) {
            console.log(chalk.red('  Item not found, please try again'));
            initialPrompt();
            }
          });
       };

module.exports = {
    initialPrompt,
    defineItem,
    defineTier,
    defineStars,
    checkItem,
    checkTier,
    checkStars,
}