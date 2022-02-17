const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {

  const apiIP = "https://api.ipify.org?format=json";
  request(apiIP, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  const apiCoords = `https://api.freegeoip.app/json/${ip}?apikey=408125c0-9034-11ec-bd90-e3ef25c5e5ab`;
  request(apiCoords, (error, response, body) => {
    if (error) {
      return callback(error,null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg),null);
      return;
    }
    const coords = {
      "latitude": JSON.parse(body).latitude,
      "longitude": JSON.parse(body).longitude
    };
    callback(null, coords);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  const apiFlyover = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  
  request(apiFlyover, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status code ${response.statusCode} when fetching flyover. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    const flyover = JSON.parse(body).response;
    callback(null, flyover);
    
  });
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error,null);
    }
  fetchCoordsByIP(ip, (error, data) => {
    if (error) {
      return callback(error,null);
    }
  fetchISSFlyOverTimes(data, (error, data) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, data)
  })
  })
  });
  // fetchCoordsByIP(fetchMyIP, callback);
}



module.exports = { nextISSTimesForMyLocation };