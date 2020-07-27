
const { Result } = require('express-validator');


const convertMS = (milliseconds) => {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }


  const calPerDay = (goalDate  ,weight , targetWeight , tdee) => {
    let now = Date.now()
    let milliSec = new Date(goalDate).getTime()
    const days = milliSec - now
    let x = convertMS(days)

    let result = (((weight - targetWeight) * 3500) / x.day).toFixed(0)
    
    if (((weight - targetWeight) * 3500) / x.day > 1500) {
     return  result = false
    }
    
   return result = (tdee - result).toFixed(0)

  }


module.exports = calPerDay




