const bannerSliderModule =()=>{

        const sliderItems = document.querySelectorAll('[data-banner="item"]')
        const slider = document.querySelector('[data-banner="slider"]')
        const btnNext = document.querySelector('[data-banner="btn-next"]')
        const btnPrevious = document.querySelector('[data-banner="btn-previous"]')
        const btnControls = document.querySelectorAll('[data-banner="btn-control"]')
        const imgTitles = document.querySelectorAll('[data-banner="img-title"]')

        const state = {
            mouseDownPosition: 0,
            movementPosition:0,
            lastTranslatePosition: 0,
            currentSlidePosition: 0,
            currentSlideIndex: 0,

        }

        function translateSlide(position){
            state.lastTranslatePosition = position
            slider.style.transform = `translateX(${position}px)`

        }



        function getCenterPosition (index){
            const slide = sliderItems[index]
            const margin = (document.body.clientWidth- slide.offsetWidth) /2
            const centerPosition = margin - (slide.offsetWidth * index)
            return centerPosition
        }



        function AnimateTransition(active){
            if(active){
                slider.style.transition = 'transform .3s'
            }else{
                slider.style.removeProperty('transition')
            }
        }

        function activeControlButton(index){
            btnControls.forEach((item)=>{
                item.classList.remove('active')
            })
            const btnControl = btnControls[index]
            btnControl.classList.add('active')
        }
        function activeImageTitle(index){
            imgTitles.forEach((item)=>{
                item.classList.remove('active')
            })
            const imgTitle = imgTitles[index]
            imgTitle.classList.add('active')
        }
        const activeCurrentSlides = ()=>{
            sliderItems.forEach((slide, slideIndex)=>{
                slide.classList.remove('active')
                if(slideIndex === state.currentSlideIndex){
                    slide.classList.add('active')
                }
            })

        }

        function setArrowButtonsDisplay(){
            btnPrevious.style.display = state.currentSlideIndex === 0 ? 'none' : 'block'
            btnNext.style.display = state.currentSlideIndex === (sliderItems.length - 1) ? 'none' : 'block'
        }

        function setVisibleSlider(index){
            state.currentSlideIndex = index
            const position = getCenterPosition(index)
            activeCurrentSlides()
            setArrowButtonsDisplay()
            AnimateTransition(true)
            translateSlide(position)
            activeControlButton(index)
            activeImageTitle(index)
        }

        function forwardSlider(){
            if(state.currentSlideIndex < sliderItems.length -1){
                setVisibleSlider(state.currentSlideIndex+1)
                
            }else{
                setVisibleSlider(state.currentSlideIndex)
                
            }
        }    
        function backwardSlider(){    
            if(state.currentSlideIndex > 0){
                setVisibleSlider(state.currentSlideIndex-1)

            }else{
                setVisibleSlider(state.currentSlideIndex)

            }
        }

        function preventDefault (event){
            event.preventDefault()

        }

        function onControlButtonClick (event, index){
            const controlBtn = event.currentTarget
            setVisibleSlider(index)
            
        }

        function onMouseDown (event, index){
            const slide = event.currentTarget
            state.mouseDownPosition = event.clientX
            state.currentSlidePosition = event.clientX - state.lastTranslatePosition
            state.currentSlideIndex = index
            AnimateTransition(false)
            slide.addEventListener('mousemove', onMouseMove)

        }
        function onMouseMove (event){
            state.movementPosition = event.clientX - state.mouseDownPosition
            translateSlide(event.clientX - state.currentSlidePosition)

        }
        function onMouseUp (event){
            const slide = event.currentTarget
            const movementQtd = event.type.includes('touch') ? 50 : 150

            if(state.movementPosition > movementQtd){
                backwardSlider()
            }else if(state.movementPosition < -movementQtd){
                forwardSlider()
            }else{
                setVisibleSlider(state.currentSlideIndex)
            }
            state.movementPosition = 0
            slide.removeEventListener('mousemove', onMouseMove)


        }


        function onMouseLeave (event){
            const slide = event.currentTarget

            slide.removeEventListener('mousemove', onMouseMove)
            
        }

        function onTouchStart (event, index){
            const slide = event.currentTarget
            slide.addEventListener('touchmove', onTouchMove)
            event.clientX = event.touches[0].clientX
            onMouseDown(event, index)
        }
        function onTouchMove(event){
            event.clientX = event.touches[0].clientX
            onMouseMove(event)

        }
        function onTouchEnd(event){
            const slide = event.currentTarget
            slide.removeEventListener('touchmove', onTouchMove)
            onMouseUp(event)
        }


        function setListeners (){
            btnNext.addEventListener('click', forwardSlider)
            btnPrevious.addEventListener('click', backwardSlider)
            sliderItems.forEach(function(slide, index){
                const link = slide.querySelector('.banner-slider_link')
                link.addEventListener('click',preventDefault)
                slide.addEventListener('dragstart', preventDefault)



                slide.addEventListener('mousedown', function(event){
                    onMouseDown(event, index)
                } )
                slide.addEventListener('mouseup', onMouseUp)
                slide.addEventListener('mouseleave', onMouseLeave)
                btnControls[index].addEventListener('click', function(event){ 
                    onControlButtonClick(event, index)
                })
                slide.addEventListener('touchstart',function(event){
                    onTouchStart(event, index)
                } )
                slide.addEventListener('touchend',onTouchEnd)
                
            })

            let resizeTimeOut;
            window.addEventListener('resize', function(event){
                clearTimeout(resizeTimeOut)
                resizeTimeOut = setTimeout(function(){
                    setVisibleSlider(state.currentSlideIndex)
                }, 1000)
                
            })

        }

        function init(){
            setVisibleSlider(2)
            setListeners()
        }







        return{
            init
        }

}
export default bannerSliderModule