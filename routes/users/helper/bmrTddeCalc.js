




module.exports = {
  const bmrCalc: (gender , age , weightInKg, heightInCm) => {
    let result = 0
    if (gender === "Female"){
        let femaleBmr = 655 + (9.6 * weightInKg) + (1.8 * heightInCm);
        bmr = (femaleBmr) - (4.7 * age);
        bmr = Math.round(bmr);
        return bmr
      } else {
        let maleBmr = 66 + (13.7 * weightInKg) + (5 * heightInCm);
        bmr = (maleBmr) - (6.8 * age);
        bmr = Math.round(bmr);
        return bmr
      }
  },

  const tddeCalc : () => {
    
  }
}
