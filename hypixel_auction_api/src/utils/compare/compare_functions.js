const superagent = require('superagent');
const inquirer = require('inquirer');
const chalk = require('chalk');

// const { defineItem } = require('../shared/shared_functions');

async function compareItems(comparing) {
    console.log(comparing)
    await defineItem(comparing);
}

async function getComparisonData(item, tier, stars) {
    console.log('Getting comparison data...');
    superagent.get('https://query-api.herokuapp.com/query')
    .query({
        bin: true,
        item_id: item,
        tier: tier,
        item_name: '%' + stars + '%',
        sort: 'ASC',
        limit: '100'
        })
        .end((err, res) => {
            if (err) { return console.log(err); }
              let averagePrice = 0;
              let sum = 0;
              for(var i = 0; i < res.body.length; i++) {
                const bins = Number(res.body[i].starting_bid);
                sum = sum + parseInt(bins);
                averagePrice = sum / res.body.length;
          };
        for(var i = 0; i < res.body.length; i++) {
  
          const itemName = res.body[i].item_name;
          const bins = Number(res.body[i].starting_bid);
            sum = sum + parseInt(bins);
            averagePrice = sum / res.body.length;
          const difference = averagePrice - bins;
          const differencePercent = (difference / averagePrice) * 100;
          let overUnder = '';
            if(differencePercent > 0) {
              overUnder = chalk.green('under');
            }
            if(differencePercent < 0) {
              overUnder = chalk.red('over');
            }
          const auctionId = res.body[i].uuid;
            console.log(chalk.yellow('Item #') + chalk.yellow(i) + ':', chalk.blue(itemName));
            console.log(chalk.yellow('BIN:'), chalk.blue(bins.toLocaleString('en-US')));
            console.log(chalk.yellow('AH command:'), '/ah', auctionId);
            console.log('This item is', Math.abs(differencePercent.toFixed(2)) + '%', overUnder, 'the average lowest BIN');
            console.log('\n');
      };
        const lowestBin = res.body[1].starting_bid;
        console.log('Found', res.body.length, 'items matching your query');
        console.log(chalk.yellow('Lowest BIN:'), chalk.blue(lowestBin.toLocaleString('en-US')));
        console.log(chalk.yellow('Average BIN:'), chalk.blue(averagePrice.toLocaleString('en-US')));
          inquirer
          .prompt([
            {
              type: 'confirm',
              name: 'again',
              message: 'Would you like to search for another item?',
              default: true,
            },
          ])
          .then(answers => {
            if(answers.again) {
              defineItem();
            } else {
              console.log(chalk.red('  Goodbye!'));
            }
          });
      });
    }

module.exports = {
    compareItems,
    getComparisonData
}