
const mealNum = document.getElementById('mealNum')
const area = document.getElementById('targetArea')
const weight = document.getElementById('weight')
let date = document.getElementById('completeDate')
//////////////
const {bmrCalc , tdeeCalc} = require('../routes/users/helper/bmrTddeCalc')
/////////////////
const clearArea = () => {
    const select = document.getElementById('targetArea')
    while(select.hasChildNodes()) {
        select.firstChild.remove();
      }
    }



weight.addEventListener('input' , (event) => {
    event.preventDefault()
    clearArea()
    const createDiv = document.createElement('div')
    createDiv.setAttribute('class' , "col-md-3")
    area.appendChild(createDiv)
    const createPara = document.createElement('p')
    createPara.innerText = 'ghjghjghj'
    createDiv.appendChild(createPara)

})


    mealNum.addEventListener('input' , (event) => {
        event.preventDefault()
        clearArea()
        let num = 0
        for (let i = 0 ; i < mealNum.value ; i++){
            const createDiv = document.createElement('div')
            createDiv.setAttribute('class' , "col-md-3")
            const createInput = document.createElement('input')
            createInput.setAttribute('type' , 'time')
            createInput.setAttribute('class' , 'form-control')
            createInput.setAttribute('name' , `mealTime${num}`)
            createInput.setAttribute('id' , `mealTime${num}`)
            createDiv.appendChild(createInput)
            mealArea.appendChild(createDiv)
            num++
        }
        mealQuantity.value = num
    })

