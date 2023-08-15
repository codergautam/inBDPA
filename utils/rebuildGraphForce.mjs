// utils/startCronJob.mjs
// This code is written to schedule a cron job that refreshes the database with updated data at regular intervals. The code imports the `schedule` function from the `node-cron` package and the `fetchDataAndSaveToDB` function from the `refreshDb.mjs` file. It initializes the variables `lastUpdated`, `countsUntilReset`, and `counts` to keep track of the last update time and the number of updates.
// The `fetchDataAndSaveToDB` function is called with the `lastUpdated` value to fetch and save the data to the database. After the function call, the `counts` variable is incremented and the `lastUpdated` variable is updated with the current time. If the number of updates reaches the `countsUntilReset` value, the `counts` and `lastUpdated` variables are reset.
// The `schedule` function is called with a cron expression (`'* * * * *'`) to define the interval at which the refresh job will run. Inside the scheduled function, the console logs a message and then calls the `fetchDataAndSaveToDB` function with the `lastUpdated` value to update the database with new data. Finally, the `lastUpdated` variable is updated with the current time.
import fetchDataAndSaveToDB from './graphRebuilder.mjs';

fetchDataAndSaveToDB().then(() => {

  console.log('done')
});

