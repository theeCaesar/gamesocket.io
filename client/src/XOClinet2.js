const btnRef = document.querySelectorAll(".button-option");
const popupRef = document.querySelector(".popupmsg");
const surrenderBtn = document.getElementById("surrender");
const p = document.querySelector(".rps-wrapper")
const btn = document.getElementById("display-chat")
btn.addEventListener('click', () => {
   if (p.style.display == 'flex') {
      p.style.display = 'none'
      btn.innerText = 'Open Chat'
   } else {
      p.style.display = 'flex' 
      btn.innerText = 'Close Chat'
   }
})


const sock = io()

const onSend = (e) => {
   e.preventDefault()
   const input = document.querySelector('#chat')
   const text = input.value;
   input.value = ''

   sock.emit('message', text);
}


const displayMsg = (text) => {
   const p = document.querySelector('#events')
   const el = document.createElement('li')
   el.innerHTML = text

   p.appendChild(el)
   p.scrollTop = p.scrollHeight
}
displayMsg('it`s on')

const onRoom = (e) => {
   e.preventDefault()
   const input = document.querySelector('#roomId')
   const roomId = input.value;
   input.value = ''
   roomId.toString()

   sock.emit('roomId', [roomId, 'X/O']);
}

document.querySelector('#chat-form').addEventListener('submit', onSend)
document.querySelector('#roomId-form').addEventListener('submit', onRoom)

sock.on('message', (text)=> {
   displayMsg(text)
})

sock.on('roomId', (text)=> {
   let roomP = document.querySelector('#room')
   roomP.innerHTML = "current room id is : " + text
})

//when the other player leave the room or disconnect
sock.on('load', (text)=> {
   restart()
   sock.emit('load', text);
})

//clear the board
const restart = () => {
   btnRef.forEach((e) => {
      e.innerText = ''
      e.disabled = false
   })
}




btnRef.forEach((e) => {
   e.addEventListener("click", () => {
      sock.emit('turn', e.getAttribute('p').split(' '))
   })
})

//when you move or the other player does
sock.on('boardP', (turnWho)=> {
   const clickedB = document.querySelector(`[p="${turnWho[0].join(' ')}"]`)
   clickedB.innerText = turnWho[1]
   clickedB.disabled = true
})

//when the game finsh or the other player disconnected
sock.on('restart', (msg) => {
   popupRef.style.display = 'flex'
   popupRef.querySelector('p').innerText = msg
   setTimeout(() => popupRef.style.display = 'none', 5000)
   restart()
})

surrenderBtn.addEventListener("click", () => {
      sock.emit('surrender', 'this player surrenderrd')

   })



