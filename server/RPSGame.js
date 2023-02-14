class game {
	constructor(p1, p2) {
		this._ps = [p1, p2]
		this.turns = []
		this.sendToPlayers('game Started')
		this.group = {
			"rock": -2,
			"paper": 0,
			"scissors": 1,
		}
		this._ps.forEach((p, pI) => {
			p.on('load', (text) => {
				this._ps = null
			})
			p.on('message', (text) => {
				this.sendToPlayers(text)
			})
			p.on('turn', (turn) => {
				if (this._ps) {
					this.onTurn(pI, turn)
				}
			})
		})
	}
	sendToPlayers(msg) {
		if (this._ps) {
			this._ps.forEach(el => el.emit('message', msg))
		}
	}
	sendToPlayer(pI, msg) {
		this._ps[pI].emit('message', msg) 
	}
	onTurn(pI, turn, ) {
		if (this._ps) {
			this.turns[pI] = turn
			this.sendToPlayer(pI,  `you selected ${turn}`)
			this.checkGameOver()
		}
	}
	checkGameOver() {
    	const turns = this.turns;
	    if (turns[0] && turns[1]) {
	    	this.gameResult(turns)
			this.turns = [null, null]
			this.sendToPlayers('Next Round!!!!')
			
		}
	}
	winmsg(winner, loser) {
		const turns = this.turns;
		winner.emit('message' , 'You Won, But for what cost... ' + turns.join(' : '))
		loser.emit('message' , 'You Lost, You pethatic piece of sh** ' + turns.join(' : '))
	}
	gameResult(turns) {
		let p1 = this._ps[0]
		let p2 = this._ps[1]
		if (! turns[0] in this.group || ! turns[1] in this.group ) {
			this.sendToPlayers('there is a cheater in the game') 
		}
		else if (turns[0] == turns[1]) { 
			this.sendToPlayers( "it`s a Draw " + turns.join(' : '))
		} else if (Math.abs(this.group[turns[0]]) > 0 && Math.abs(this.group[turns[1]]) > 0) {

			if (Math.abs(this.group[turns[0]]) > Math.abs(this.group[turns[1]]) > 0) {
				this.winmsg(p1, p2)
					} else {
						this.winmsg(p2, p1)
					}
		} else if (this.group[turns[0]] > this.group[turns[1]]) {
			this.winmsg(p1, p2)
		} else {
			this.winmsg(p2, p1)
		}

	}
}



module.exports = game;