const superagent = require('superagent');
const inquirer = require('inquirer');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sort = 'ASC';

inquirer
  .prompt([
    {
      type: 'list',
      name: 'toDo',
      message: 'What would you like to do?',
      choices: ['Search for BIN info', 'Compare item to similar items'],
    },
  ])
  .then(answers => {
    if (answers.toDo === 'Search for BIN info') {
      searchBin();
    } else {
      compareItems();
    };
  });

  async function searchBin() {
    const question1Answer = await rl.question('What item would you like to search for?');
    const question2Answer = await rl.question('What tier item would you like to search for?');
    const question3Answer = await rl.question('How many items do you want to sample from?');
    console.log('Testing Question 1', toString(question1Answer));
    const semiParsedAnswer = question1Answer.replace(/ /g, '_');
    const parsedAnswer = semiParsedAnswer.toUpperCase();
    const parsedAnswer2 = question2Answer.toUpperCase();
    superagent.get('https://query-api.herokuapp.com/query')
    .query({
        bin: true,
        item_name: parsedAnswer,
        tier: parsedAnswer2,
        limit: question3Answer, 
        sort: sort
        });
  }

  async function compareItems() {
      let limit = '';
      let sort = '';
    const question1Answer = await rl.question('What item would you like to compare?');
    const question2Answer = await rl.question('What tier item would you like to compare?');
    const question3Answer = await rl.question('How many items do you want to sample from?');
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'sorting',
        message: 'Would you like to sort by LBIN or HBIN?',
        choices: ['LBIN', 'HBIN'],
      },
    ])
    .then(answers => {
      if (answers.sorting === 'LBIN') {
        sort = 'ASC';
      } else {
        sort = 'DESC';
      }
    });
      limit = question3Answer;
    const semiParsedAnswer = question1Answer.replaceAll(' ', '_');
    const parsedAnswer = semiParsedAnswer.toUpperCase();
    const parsedAnswer2 = question2Answer.toUpperCase();
    superagent.get('https://query-api.herokuapp.com/query')
    .query({
        bin: true,
        item_name: parsedAnswer,
        tier: parsedAnswer2,
        limit: limit, 
        sort: sort,
        });

  const bins = Number(res.body[i].starting_bid);
    sum = sum + parseInt(bins);
  const averagePrice = sum / limit;
console.log('Average Price of of lowest BINs', averagePrice);  

  }


// .end((err, res) => {
//   if (err) { return console.log(err); }
// //   console.log(res.body.url);
// let sum = 0;
// let total = 0;
// for (let i = 0; i < limit; i++) {
//   //add catch error to stop incase there are not enough bin
//   const bins = Number(res.body[i].starting_bid);
//   sum = sum + parseInt(bins);// Convert to number to be able to divide
//   total ++;
//   };
//   // console.log(sum);
//   // console.log(total);
//   // let order = '';
//   // if(sort == 'ASC'){
//   //   order = ' lowest to highest:';
//   // } else {
//   //   order = ' highest to lowest:';
//   // }
// const averagePrice = sum / total;
// console.log('Average Price of of lowest BINs', averagePrice);  
// });

// superagent.get('https://api.nasa.gov/planetary/apod')
// .query({ api_key: 'DEMO_KEY', date: '2017-10-02' })
// .end((err, res) => {
//   if (err) { return console.log(err); }
//   console.log(res.body.url);
//   console.log(res.body.date); //Works
// });