const roundDate = (timeStamp) => {
    timeStamp -= timeStamp % (24 * 60 * 60 * 1000);
    timeStamp += new Date().getTimezoneOffset() * 60 * 1000;
    // return new Date(timeStamp);
    return timeStamp;
}


module.exports = {roundDate}
