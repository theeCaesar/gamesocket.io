const sock = io()

const we = (text) => {
	const p = document.querySelector('#events')
	const el = document.createElement('li')
	el.innerHTML = text

	p.appendChild(el)
	p.scrollTop = p.scrollHeight
}
we('it`s on')
  
const onSend = (e) => {
	e.preventDefault()
	const input = document.querySelector('#chat')
	const text = input.value;
	input.value = ''

	sock.emit('message', text);
}

const addb = () => {
	['rock', 'paper', 'scissors'].forEach((id) => {
		const b = document.querySelector(`#${id}`)
		b.addEventListener('click', () => {
			sock.emit('turn', id)
		})
	})
}
 
 const onRoom = (e) => {
	e.preventDefault()
	const input = document.querySelector('#roomId')
	const roomId = input.value;
	input.value = ''
	roomId.toString()

	sock.emit('roomId', [roomId, 'RPS']);
}


document.querySelector('#chat-form').addEventListener('submit', onSend)
document.querySelector('#roomId-form').addEventListener('submit', onRoom)

sock.on('message', (text)=> {
	we(text)
})
sock.on('roomId', (text)=> {
	p = document.querySelector('#room')
	p.innerHTML = "current room id is : " + text
})
sock.on('load', (text)=> {
	sock.emit('load', text);
})


addb()