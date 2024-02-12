/**
 * Copyright 2024 msedv/Markus Schwaiger
 * 
 * For Shellys with PM (power metering)
 * Problem: normally the device only sends the data (voltage, current, power) to the MQTT-server when the values change at least by 5%.
 * I wanted a continues sending.
 * This mini-script starts a timer which publishes the shellies/shellypmminig3-xxxxxxxxxxxx/status/pm1:0-topic each SEND_INTERVALL seconds
 *
 * Possible enhancements:
 * - check if PM is available
 * - actually only for 1 channel PMs
 * - "more" error handling
 * - make topic configurable
 * - don't always send but e.g. when the values are changed by 1% instead of 5%
**/

let SHELLY_ID = undefined;
let SEND_INTERVALL = 20; // seconds

function myCallback (result, error_code, error_message) {
  if (error_code == 0) {
    // console.log (SHELLY_ID + "/status/pm1:0", JSON.stringify (result));
    MQTT.publish (SHELLY_ID + "/status/pm1:0", JSON.stringify (result));
  }
  else {
    console.log ("Error:", error_code, error_message);
  }
}

Shelly.call ("Mqtt.GetConfig", "", function (res, err_code, err_msg, ud) {
  SHELLY_ID = res ["topic_prefix"];
});

Timer.set (SEND_INTERVALL * 1000, true, function () {
  Shelly.call ("PM1.GetStatus", {"id":0}, myCallback);
});
