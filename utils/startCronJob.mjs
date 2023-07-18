import { schedule } from 'node-cron';
import fetchDataAndSaveToDB from './refreshDb.mjs';

let lastUpdated = null;
let countsUntilReset = 3;
let counts = 0;
fetchDataAndSaveToDB(lastUpdated).then(() => {
  counts++;
  lastUpdated = Date.now();
  if(counts >= countsUntilReset) {
    counts = 0;
    lastUpdated = null;
  }
schedule('* * * * *', async () => {
  console.log('Refreshing DB');
  await fetchDataAndSaveToDB(lastUpdated);
  lastUpdated = Date.now();
});
});

