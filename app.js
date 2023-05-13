const square = document.querySelector('.container')
const resultDisplay = document.querySelector('#result')
const scoreDisplay = document.querySelector('#score')
const btnONOff = document.querySelector('#start')
let currentIndexShooter = 202
const width = 15
const height = 302
let invaderStatus = true
let position = 1
let invaderId = null
let aliensRemoved = []
let score = 0

for(let i = 0; i < 225; i++) {
   const squares = document.createElement('div')
   squares.classList.add('square')
   square.appendChild(squares)
}

const squares = [...document.querySelectorAll('.container div')]

const alienInvader = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function drawInvader() {
    for(let i = 0; i < alienInvader.length; i++) {
      if(!aliensRemoved.includes(i)) {
        squares[alienInvader[i]].classList.add('invader')
      }
    }
}

drawInvader()

function removeInvader() {
    for(let i = 0; i < alienInvader.length; i++) {
        squares[alienInvader[i]].classList.remove('invader')
    }
}

function moveInvader() {
   let leftEdge = alienInvader[0] % width === 0
   let rightEdge = alienInvader[alienInvader.length - 1] % width === width -1

   removeInvader()

   if(rightEdge && invaderStatus) {
     for(let i = 0; i < alienInvader.length; i++) {
        alienInvader[i] += width+1
        position = -1
        invaderStatus = false
     }
   }

   if(leftEdge && !invaderStatus) {
     for(let i = 0; i < alienInvader.length; i++) {
        alienInvader[i] += width-1
        position = 1
        invaderStatus = true
     }
   }
   
   for(let i = 0; i < alienInvader.length; i++) {
       alienInvader[i] += position
    }
    
    drawInvader()

    if(squares[currentIndexShooter].classList.contains('invader')) {
        clearInterval(timerId)
        resultDisplay.textContent = 'Game Over!'
        document.removeEventListener('keydown',  moveShooter)
        document.removeEventListener("keydown", boom)
      }
      
      /*for(let i = 0; i < alienInvader.length; i++) {
        if(alienInvader[i] < (squares.length)) {
          resultDisplay.textContent = 'Game Over!'
          clearInterval(timerId)
      }
    }*/

    if(aliensRemoved.length === alienInvader.length) {
      resultDisplay.textContent = 'You Win!'
      clearInterval(invaderId)
      document.removeEventListener('keydown',  moveShooter)
      document.removeEventListener("keydown", boom)
    }

}

btnONOff.addEventListener('click', () => {
  if(invaderId) {
    clearInterval(invaderId)
    invaderId = null
    btnONOff.innerHTML = `Play <i class='fa-solid fa-play'></i>`
    document.removeEventListener('keydown',  moveShooter)
    document.removeEventListener("keydown", boom)
  } else {
    invaderId = setInterval(moveInvader, 500)
    btnONOff.innerHTML = "Pause " +  "<i class='fa-solid fa-pause'></i>"
    document.addEventListener('keydown',  moveShooter)
    document.addEventListener("keydown", boom)
  }
})


squares[currentIndexShooter].classList.add("shooter")

function moveShooter(e) {
   squares[currentIndexShooter].classList.remove("shooter")
   switch(e.key) {
      case 'ArrowLeft':
        currentIndexShooter % width !== 0 ? currentIndexShooter -=1 : null
      break
      case 'ArrowRight':
        currentIndexShooter % width < width -1 ? currentIndexShooter +=1 : null
      break
   }

   squares[currentIndexShooter].classList.add("shooter")
}

document.addEventListener('keydown',  moveShooter)

function boom(e) {
  let timerIdTwo
  let currentLazer = currentIndexShooter
 
  function moveLazer() {
    squares[currentLazer].classList.remove("lazer")
    currentLazer -= width
    squares[currentLazer].classList.add("lazer")

    if(squares[currentLazer].classList.contains('invader')) {
      squares[currentLazer].classList.remove('invader')
      squares[currentLazer].classList.remove('lazer')
      squares[currentLazer].classList.add('boom')

      setTimeout(() => squares[currentLazer].classList.remove('boom')) 
      clearInterval(timerIdTwo)

      const alienRemoved = alienInvader.indexOf(currentLazer)
      aliensRemoved.push(alienRemoved)
      score++
      scoreDisplay.textContent = score
    }

}

  e.key === "ArrowUp" ? timerIdTwo = setInterval(moveLazer, 100) : null

}

document.addEventListener("keydown", boom)

