let area = document.getElementById('targetArea')
const weight = document.getElementById('weight')
const targetWeight = document.getElementById('targetWeight')
let date = document.getElementById('completeDate')
const userbmr = document.getElementById('userbmr')
const useract = document.getElementById('useract')
const birthday = document.getElementById('birthday')
const gender = document.getElementById('gender')
const height = document.getElementById('height')


const clearArea = () => {
  const select = document.getElementById('targetArea')
  while (select.hasChildNodes()) {
    select.firstChild.remove();
  }
}
const clearArea2 = () => {
  const select = document.getElementById('targetArea2')
  while (select.hasChildNodes()) {
    select.firstChild.remove();
  }
}
const clearArea3 = () => {
  const select = document.getElementById('targetArea3')
  while (select.hasChildNodes()) {
    select.firstChild.remove();
  }
}


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


let tdeeCalc = (bmr, activity) => {
  let tdee = 0
  switch (activity) {
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

let bmrCalc = (gender, age, weightInKg, heightInCm) => {
  if (gender === "Female") {
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
}
const calculateAge = (dob) => {
  const diff_ms = Date.now() - dob.getTime();
  const agedt = new Date(diff_ms);

  return Math.abs(agedt.getUTCFullYear() - 1970);
}

const goal = () => {
  let area = document.getElementById('targetArea2')
  clearArea2()
  const createDiv = document.createElement('div')
  createDiv.setAttribute('class', "col-md-3")
  area.appendChild(createDiv)
  const createPara = document.createElement('p')
  createPara.innerText = (weight.value - targetWeight.value) * 3500
  createDiv.appendChild(createPara)
}



const fillDate = () => {
  let area = document.getElementById('targetArea3')
  clearArea3()
  let now = Date.now()
  let milliSec = new Date(date.value).getTime()
  const days = milliSec - now
  let x = convertMS(days)
  let result = (((weight.value - targetWeight.value) * 3500) / x.day).toFixed(0)
  if (((weight.value - targetWeight.value) * 3500) / x.day > 1500) {
    result = 'Not a Realistic Goal'
  }
  const createDiv = document.createElement('div')
  createDiv.setAttribute('class', "col-md-3")
  area.appendChild(createDiv)
  const createPara = document.createElement('p')
  const createPara2 = document.createElement('p')

  createPara.innerText = `Calorie Deficit Per day: ${result}`
  createDiv.appendChild(createPara)
  createPara2.innerText = `Avalible Calorie Per Day: ${(tdeeCalc( bmr, useract.value)  - result).toFixed(0)}`
  createDiv.appendChild(createPara2)
}

const fillWeight = () => {
  let area = document.getElementById('targetArea')
  clearArea()
  const createDiv = document.createElement('div')
  createDiv.setAttribute('class', "col-md-3")
  area.appendChild(createDiv)
  const createPara = document.createElement('p')
  createPara.setAttribute('name', "tdee")
  createPara.setAttribute('id', "tdee")
  const date = birthday.value.split('-')
  const age = calculateAge(new Date(Number(date[0]), Number(date[1]), Number(date[2])))
  const bmr = bmrCalc(gender.value, age, (weight.value * 1) / 2.205, height.value * 2.54)
  createPara.innerText = `Your TDEE IS : ${tdeeCalc( bmr, useract.value)}`
  createDiv.appendChild(createPara)


}



weight.addEventListener('input', (event) => {
  event.preventDefault()
  fillWeight()
  if (targetWeight.value) {
    goal()
  }
  if (date) {
    fillDate()
  }

})

targetWeight.addEventListener('input', (event) => {
  event.preventDefault()
  goal()
  if (weight) {
    fillWeight()
  }
  if (date) {
    fillDate()
  }



})

date.addEventListener('input', (event) => {
  event.preventDefault()
  fillDate()
})