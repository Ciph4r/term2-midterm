
const calculateAge = (dob) => { 
    const diff_ms = Date.now() - dob.getTime();
    const agedt = new Date(diff_ms); 
  
    return Math.abs(agedt.getUTCFullYear() - 1970);
}


module.exports = calculateAge