import { schedule } from 'node-cron';
import fetchDataAndSaveToDB from './refreshDb.mjs';

let lastUpdated = null;
fetchDataAndSaveToDB(lastUpdated).then(() => {
  lastUpdated = Date.now();
schedule('* * * * *', async () => {
  console.log('Refreshing DB');
  await fetchDataAndSaveToDB(lastUpdated);
  lastUpdated = Date.now();
});
});

