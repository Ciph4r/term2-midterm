
const mealNum = document.getElementById('mealNum')
const mealArea = document.getElementById('mealArea')
let mealQuantity =document.getElementById('mealQuantity')

const clearMealArea = () => {
    const select = document.getElementById('mealArea')
    while(select.hasChildNodes()) {
        select.firstChild.remove();
      }
    }



    mealNum.addEventListener('input' , (event) => {
        event.preventDefault()
        clearMealArea()
        let num = 0
        for (let i = 0 ; i < mealNum.value ; i++){
            const createDiv = document.createElement('div')
            createDiv.setAttribute('class' , "col-md-4")
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



