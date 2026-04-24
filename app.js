const sortSelect = document.querySelector('#sort-select')
const todayDate = document.querySelector('#today-date')

const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1
const day = now.getDate()
todayDate.textContent = `${year}.${month}.${day}`

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
const cloudBtn = document.querySelector('#cloud-btn')
const cloudModal = document.querySelector('#cloud-modal')
const cloudInput = document.querySelector('#cloud-input')
const cloudSave = document.querySelector('#cloud-save')
const cloudCancel = document.querySelector('#cloud-cancel')
const cloudList = document.querySelector('.cloud-list')
let cardCount = 0
let timerSeconds = 1500
let timerInterval = null
let isRunning =false 
let todos = []


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
            <button class="delete-btn">🗑️</button>
        </div>
        <div class="detail-content">
            ${modalDetail.value}
        </div>
    `

    todoList.appendChild(li)

    const todoData = {
        text: text,
        date: date, 
        priority: priority, 
        detail: modalDetail.value,
        savedDate: new Date().toLocaleDateString('ko-KR'),
        completed: false

    }
    todos.push(todoData)
    saveTodos()

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
                const title = card.querySelector('.todo-title').textContent
                todos = todos.map(function(todo){
                    if(todo.text === title.replace('🔄', '').trim()){
                        todo.completed = true
                    }
                    return todo
                })
                saveTodos()
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
            card.style.display = 'flex'
        },5000)
    }
})

cloudBtn.addEventListener('click', function(){
    const text = todoInput.value
    cloudInput.value = text 
    cloudModal.style.display = 'block'
})

cloudCancel.addEventListener('click', function(){
    cloudModal.style.display = 'none'
    cloudInput.value = ''
})


cloudSave.addEventListener('click', function(){
    const text = cloudInput.value

    if(text === '') return

    const li = document.createElement('li')
    li.innerHTML = `<span>${text}</span>`

    cloudList.appendChild(li)
    cloudInput.value = ''
    
    
})

todoList.addEventListener('click', function(e){
    if(e.target.tagName === 'BUTTON') return

    const card = e.target.closest('.todo-card')
    if(card) {
        card.classList.toggle('active')
    }
})

function saveTodos(){
    localStorage.setItem('todos', JSON.stringify(todos))
}

function loadTodos() {
    const saved = localStorage.getItem('todos')
    if(saved === null) return 

    todos = JSON.parse(saved)

    const today = new Date().toLocaleDateString('ko-KR')

    todos.forEach(function(todo) {
        const li = document.createElement('li')
        li.className = 'todo-card'

        const isRolledOver = todo.savedDate !== today

        li.innerHTML = `
            <div class="card-left">
                <span class="priority-badge">${todo.priority}</span>
            </div>
            <div class="card-middle">
                <span class="todo-title">
                    ${isRolledOver ?'🔄':''}${todo.text}
                </span>
                <span class="todo-date">기한: ${todo.date}</span>
            </div>
            <div class="card-right">
                <button class="checkbox">✅</button>
                <button class="clock-btn">🕒</button>
                <button class="hourglass-btn">⏳</button>
                <button class="delete-btn">🗑️</button>
            </div>
            <div class="detail-content">
                ${todo.detail}
            </div>

        `
        if(todo.completed) {
            li.classList.add('completed')
            completedList.appendChild(li)
        } else {
            todoList.appendChild(li)
        }
    })
}

loadTodos()

todoList.addEventListener('click', function(e){
        if(e.target.classList.contains('delete-btn')) {
            const card = e.target.closest('.todo-card')
            
            card.classList.add('card-removing')
            
            setTimeout(function() {
                const title = card.querySelector('.todo-title').textContent

                todos = todos.filter(function(todo){
                    return title.replace('🔄', '').trim() !== todo.text
                })
                saveTodos()
                card.remove()
            }, 400)
            
        }
    })
    

completedList.addEventListener('click', function(e){
    if(e.target.classList.contains('checkbox')){
       const card = e.target.closest('.todo-card')

       card.classList.remove('completed')
       todoList.appendChild(card)
       const title = card.querySelector('.todo-title').textContent
    todos = todos.map(function(todo){
        if(todo.text === title.replace('🔄', '').trim()){
            todo.completed = false
        }
        return todo
        
    })
    saveTodos()
    }
    
})

sortSelect.addEventListener('change', function(){
    const value = sortSelect.value

    if(value === 'priority') {
        todos.sort(function(a,b) {
            return a.priority - b.priority
        })
    }

    if(value === 'date'){
        todos.sort(function(a, b){
            return new Date(a.date) - new Date(b.date)
        })
    }
    //화면 다시 그리기 
    todoList.innerHTML = ''
    todos.forEach(function(todo){
        if(todo.completed) return
        const li = document.createElement('li')
        li.className = 'todo-card'
        li.innerHTML = `
            <div class="card-left">
                <span class="priority-badge">${todo.priority}</span>
            </div>
            <div class="card-middle">
                <span class="todo-title">${todo.text}</span>
                <span class="todo-date">기한: ${todo.date}</span>
            </div>
            <div class="card-right">
                <button class="checkbox">✅</button>
                <button class="clock-btn">🕒</button>
                <button class="hourglass-btn">⏳</button>
                <button class="delete-btn">🗑️</button>
            </div>
            <div class="detail-content">${todo.detail}</div>
        `

        todoList.appendChild(li)
    })
})