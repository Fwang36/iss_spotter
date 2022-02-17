const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip
  return request(`https://api.freegeoip.app/json/${ip}?apikey=408125c0-9034-11ec-bd90-e3ef25c5e5ab`)
  
}
const fetchISSFlyOverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body);
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};


const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
            .then(fetchCoordsByIP)
            .then(fetchISSFlyOverTimes)
            .then((data) => {
              const {response} = JSON.parse(data)
              return response;
            })
}
module.exports = { nextISSTimesForMyLocation };
