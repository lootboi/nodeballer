const Hypixel = require('hypixel-api-reborn');
const hypixel = new Hypixel.Client(
    '15eaeb0f-c3ba-49d0-8676-a7a0088d157e',
     {cache: true}
  );

module.exports = {
    hypixel
}