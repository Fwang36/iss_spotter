// index.js
const { nextISSTimesForMyLocation } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP("24.36.171.11", (error, data) => {
//   if (error) {
//     console.log("Coords didn't work!", error);
//     return;
//   }
//   console.log("Coords worked!", data)
// })

// fetchISSFlyOverTimes({"latitude": "43.251", "longitude": "-79.8989"}, (error, data) =>{
//   if (error) {
//     console.log("it didnt work!", error);
//     return;
//   }
//   console.log("it worked!", data);
// });


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  printPassTimes(passTimes);
});

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

