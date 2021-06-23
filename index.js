const fetch = require('node-fetch');
const Discord = require("./lib/discord");

const discord = new Discord();

let cache = {};

(async () => {
    while (true) {
        const response = await fetch('https://axieinfinity.com/graphql-server-v2/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "operationName": "GetAxieLatest",
                "query": "query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  level\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  auction {\n    ...AxieAuction\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n\nfragment AxieAuction on Auction {\n  startingPrice\n  endingPrice\n  startingTimestamp\n  endingTimestamp\n  duration\n  timeLeft\n  currentPrice\n  currentPriceUSD\n  suggestedPrice\n  seller\n  listingIndex\n  state\n  __typename\n}\n",
                "variables": {
                    "from": 0,
                    "size": 100,
                    "sort": "PriceAsc",
                    "auctionType": "Sale"
                }
            })
        });

        const responseJson = await response.json();
        const results = responseJson.data.axies.results.filter(result => parseFloat(result.auction.currentPriceUSD) <= parseFloat(process.env.MAX_PRICE_USD));
        const show = [];

        results.forEach(result => {
            if (cache[result.id])
                return;

            cache[result.id] = result;
            show.push(result);
        });

        show.forEach(async (result) => {
            await discord.sendEmbed({
                isNew: true,
                imageUrl: result.image,
                id: result.id,
                name: result.name,
                price: result.auction.currentPriceUSD,
                url: `https://marketplace.axieinfinity.com/axie/${result.id}`
            })
        })
        
        sleep(process.env.SLEEP);
    }
})();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}