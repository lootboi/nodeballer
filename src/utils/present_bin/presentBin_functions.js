////////// TO DO //////////
// 1. Add a way to get the average historical price of the item (may need another api)
//     - Currently only gets the average price of the last 5 days (resitrcted by current api)
//     - Add readline list for user to select the time period, ie. 1 week, 1 month, etc.
// 2. Add filter to only display item with the given item_id (item) in getHistoricalData()

const superagent = require('superagent');
const chalk = require('chalk');

async function getBinInfo(item, tier, stars) {
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

    const lowestBin = res.body[1].starting_bid;
        console.log('Found', res.body.length, 'items matching your query');
        console.log(chalk.yellow('Lowest BIN:'), chalk.blue(lowestBin.toLocaleString('en-US')));
        console.log(chalk.yellow('Average BIN:'), chalk.blue(averagePrice.toLocaleString('en-US')));
        comparing = false;
        }
    getHistoricalData(item, tier, stars);
    })
}

async function getHistoricalData(item, tier, stars) {
    console.log('Getting comparison data...');
    superagent.get('https://query-api.herokuapp.com/average_auction')
    .query({
        item_id: item,
        tier: tier,
        item_name: '%' + stars + '%',
        time: '432000',
        step: '60'
        })
        .end((err, res) => {
            if (err) { return console.log(err); }
            console.log(chalk.green('  Comparison data found!'));
            console.log(res.body.FLOWER_OF_TRUTH);
            console.log(res.body.averageItem);
        }
    )
}

module.exports = {
    getBinInfo
}