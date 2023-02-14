class game {
	constructor(p1, p2) {
		this._ps = [p1, p2]
		p1.l = 'X'
		p1.playIn = 1
		p2.l = 'O'
		p2.playIn = 2


		this.turnsNum = 1
		this.sendToPlayers('game Started')
		this.board = {
			'r1' : [],
			'r2' : [],
			'r3' : [],
			'h1' : [],
			'h2' : [],
			'h3' : [],
			'o1' : [],
			'o2' : [],
		}
		this.boardCopy = JSON.parse(JSON.stringify(this.board))

		this._ps.forEach((p, pI) => {
			p.on('surrender', (msg) => {
				if (this._ps) {
					this.restart()
					this.sendWinMsgToPlayers(p.l + ' win')}
			})
			p.on('load', (text) => {
				this._ps = null
			})
			p.on('message', (text) => {
				this.sendToPlayers(text)
			})
			p.on('turn', (turn) => {
				if (this._ps) {
					this.onTurn(p, turn)
				}
			})
		})
	}
	sendToPlayers(msg) {
		if (this._ps) {
			this._ps.forEach(el => el.emit('message', msg))
		}
	}
	sendTurnsToPlayers(turn, who) {
		if (this._ps) {
			let turnWho = [turn, who]		
			this._ps.forEach(el => el.emit('boardP', turnWho))
		}
	}
	sendToPlayer(pI, msg) {
		this._ps[pI].emit('message', msg) 
	}
	sendWinMsgToPlayers (msg) {
		this._ps.forEach((p) => p.emit('restart', msg))
	}
	restart() {
		this._ps.forEach((p)=>{
			if (p.l=='X') {
				p.l = 'O'
				p.playIn = 2
			} else {
				p.l = 'X'
				p.playIn = 1
			}
		})
		this.turnsNum = 1
		this.boardCopy = JSON.parse(JSON.stringify(this.board))
	}
	onTurn(p, turn, ) {
		if (this._ps) {
			if (p.playIn == this.turnsNum) {
				p.playIn +=2
				this.turnsNum +=1
				if (this.turnsNum == 10) {
					this.restart()
					this.sendWinMsgToPlayers('it`s a Draw')			
				} else {
					this.sendTurnsToPlayers(turn, p.l)
					turn.forEach((e) => {
						this.boardCopy[e].push(p.l)

						if (this.boardCopy[e].join(' ') == [p.l, p.l, p.l].join(' ') ) {
							let l = p.l
							this.restart()
							this.sendWinMsgToPlayers(l + ' wins')
						}
					})
				}				
			}}}

	sendWinMsgToPlayers (msg) {
		this._ps.forEach((p) => p.emit('restart', msg))
	}
}

module.exports = game