const todoInput = document.querySelector('#todo-input')
const addBtn = document.querySelector('#add-btn')
const todoList =  document.querySelector('.todo-list')
const modal = document.querySelector('#modal')
const modalTitle = document.querySelector('#modal-title')
const modalDate = document.querySelector('#modal-date')
const modalPriority = document.querySelector('#modal-priority')
const modalDetail = document.querySelector('#modal-detail')
const modalCancel = document.querySelector('#modal-cancel')
const modalSave = document.querySelector('#modal-save')
const completedList = document.querySelector('.completed-list')
const timerModal = document.querySelector('#timer-modal')
const timerTitle = document.querySelector('#timer-title')
const timerDisplay = document.querySelector('#timer-display')
const timerStart = document.querySelector('#timer-start')
const timerCancel = document.querySelector('#timer-cancel')
let cardCount = 0
let timerSeconds = 1500
let timerInterval = null
let isRunning =false 



addBtn.addEventListener('click', function(){
    const text = todoInput.value
    if(text === '')return 

    modalTitle.value = text

    modal.style.display = 'block'

    
})

modalCancel.addEventListener('click', function(){
    modal.style.display = 'none'
    todoInput.value = ''
})

modalSave.addEventListener('click', function(){
    const text = modalTitle.value
    const date = modalDate.value
    const priority = modalPriority.value 

    if(text === '') return

    const li = document.createElement('li')
    li.className = 'todo-card'
    li.innerHTML = `
    <div class="card-left">
            <span class="priority-badge">${priority}</span>
        </div>
        <div class="card-middle">
            <span class="todo-title">${text}</span>
            <span class="todo-date">기한: ${date}</span>
        </div>
        <div class="card-right">
            <button class="checkbox">✅</button>
            <button class="clock-btn">🕒</button>
            <button class="hourglass-btn">⏳</button>
        </div>
    `

    todoList.appendChild(li)

    modal.style.display = 'none'
    todoInput.value = ''
    modalDate.value = ''
    modalDetail.value = ''

    
})

//버튼 클릭하면 카드 삭제
    todoList.addEventListener('click', function(e){
        if(e.target.classList.contains('checkbox')) {
            const card = e.target.closest('.todo-card')
            
            card.classList.add('card-removing')
            
            setTimeout(function() {
                card.classList.remove('card-removing')
                card.classList.add('completed')
                completedList.appendChild(card)
            }, 400)
            
        }
    })


todoList.addEventListener('click', function(e){
    if(e.target.classList.contains('clock-btn')) {
        const card = e.target.closest('.todo-card')
        const title = card.querySelector('.todo-title').textContent

        timerTitle.textContent = title
        timerSeconds = 1500
        timerDisplay.textContent = '25:00'
        timerModal.style.display = 'block'
    }
})

timerStart.addEventListener('click', function(){
    if(isRunning) {
        clearInterval(timerInterval)
        isRunning = false
        timerStart.textContent = '▶ 시작'
    } else {
        isRunning = true
        timerStart.textContent = '⏸ 일시정지'
        
        timerInterval = setInterval(function() {
            timerSeconds = timerSeconds - 1
            const min = Math.floor(timerSeconds / 60)
            const sec = timerSeconds % 60
            timerDisplay.textContent = `${min}:${sec < 10 ? '0' + sec : sec}`
            if(timerSeconds === 0){
                clearInterval(timerInterval)
                isRunning = false
                timerDisplay.textContent = '완료! 🎉'
                timerStart.textContent = '▶ 시작'
            }
        },1000)  
    }
})

timerCancel.addEventListener('click', function(){
    clearInterval(timerInterval)
    isRunning = false 
    timerSeconds = 1500
    timerDisplay.textContent = '25:00'
    timerStart.textContent = '▶ 시작'
    timerModal.style.display = 'none'
})

todoList.addEventListener('click', function(e){
    if(e.target.classList.contains('hourglass-btn')){
        const card = e.target.closest('.todo-card')
        card.style.display = 'none'

        setTimeout(function(){
            card.style.display = 'block'
        },5000)
    }
})