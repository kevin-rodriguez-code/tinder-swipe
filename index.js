let isAnimating = false
let pullDistance = 0
const decisionPoint = 120

function startDrag (e) {
    if (isAnimating) return
        const actualCard = e.target.closest('article')
        const startX= e.pageX ?? e.touches[0].pageX

        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', onEnd)
        document.addEventListener('touchmove', onMove, {passive: true})
        document.addEventListener('touchend', onEnd, {passive: true})
        
        function onMove (e) {
            const currentX = e.pageX ?? e.touches[0].pageX
            pullDistance = currentX - startX
            if (pullDistance === 0) return
            isAnimating = true
            console.log(pullDistance)
            const deg = pullDistance/10
            actualCard.style.transform = `translateX(${pullDistance}px) rotate(${deg}deg)`
            actualCard.style.cursor = 'grabbing'

            const opacity = Math.abs(pullDistance) / 100
            const isRight = pullDistance > 0

            const choiceSide = isRight
                ? actualCard.querySelector('.choice.like')
                : actualCard.querySelector('.choice.nope')

            choiceSide.style.opacity = opacity
        }
        
        function onEnd (e) {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', onEnd)
            document.removeEventListener('touchmove', onMove, {passive: true})
            document.removeEventListener('touchend', onEnd, {passive: true})

            const decisionMade= Math.abs(pullDistance)>decisionPoint

            if(decisionMade) {
                const goRight = pullDistance >= 0
                const goLeft = !goRight

                actualCard.classList.add(goRight ? 'go-right' : 'go-left')
                actualCard.addEventListener('transitionend',() => {
                    actualCard.remove()
                }, {once: true})
            } else {
                actualCard.classList.add('reset')
                actualCard.classList.remove('go-right', 'go-left')
            }

            actualCard.addEventListener('transitionend', () => {
                actualCard.removeAttribute('style')
                actualCard.classList.remove('reset')
                actualCard.querySelectorAll('.choice').forEach(element => {
                    element.style.opacity = 0    
                });

                pullDistance = 0
                isAnimating = false
            })
        }
}


document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, {passive: true})