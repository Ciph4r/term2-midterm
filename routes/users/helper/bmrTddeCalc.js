




module.exports = {
   bmrCalc: (gender , age , weightInKg, heightInCm) => {
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

   tdeeCalc : (bmr,activity) => {
    let tdee = 0
      switch(activity) {
        case "Sedentary":
          tdee = Math.round(bmr * 1.2)
          break;
        case "Lightly Active":
          tdee = Math.round(bmr * 1.375)
          break;
        case "Moderately Active":
          tdee = Math.round(bmr * 1.55)
          break;
        case "Very Active":
          tdee = Math.round(bmr * 1.725)
          break;
        case "Extremely Active":
          tdee = Math.round(bmr * 1.9)
          break;
      }
    return tdee
  }

}
