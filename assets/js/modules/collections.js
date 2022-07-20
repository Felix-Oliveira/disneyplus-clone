
const collectionsModule = ()=>{    
        const collections = document.querySelectorAll('[data-carousel="collection"]')

        const collectionData = []
        let currentCollectionIndex = 0
        let itemPerSlide = 5


        const preventDefault = (event) =>{
            event.preventDefault()
        }
        const translateSlide =(position) =>{
            const {state, carouselList} = collectionData[currentCollectionIndex]
            state.lastTranslatePosition = position
            carouselList.style.transform = `translateX(${position}px)`
        }

        const gatCenterPosition = (slideIndex)=>{
            const {state, carouselItem} = collectionData[currentCollectionIndex]
            const item = carouselItem[state.currentItemIndex]
            const itemWidth = item.offsetWidth
            const bodyWidth = document.body.clientWidth
            const slideWidth = itemWidth * itemPerSlide
            const margin = (bodyWidth - slideWidth) /2

            return margin - (slideWidth * slideIndex)

        }
        const getLasSlideIndex= ()=>{
            const {carouselItem} = collectionData[currentCollectionIndex]
            const lastItemIndex = carouselItem.length - 1
            return Math.floor(lastItemIndex / itemPerSlide)
        }

        const animateTransition = (active)=>{
            const {carouselList} = collectionData[currentCollectionIndex]
            if(active){
                carouselList.style.transition ='transform .3s'
            }else{
                carouselList.style.removeProperty('transition') 
            }
        }

        const activeCurrentItems = ()=>{
            const {carouselItem, state} = collectionData[currentCollectionIndex]
            carouselItem.forEach((item, itemIndex)=>{
                item.classList.remove('active')
                const firstItemIndex = state.currentSlideIndex * itemPerSlide

                if(itemIndex >= firstItemIndex && itemIndex <firstItemIndex +itemPerSlide){
                    item.classList.add('active')
                }
            })

        }

        const setArrowButtonsDisplay = ()=>{
            const {btnPrevious, btnNext, state} = collectionData[currentCollectionIndex]
            btnPrevious.style.display = state.currentSlideIndex === 0 ? 'none' : 'block'
            btnNext.style.display = state.currentSlideIndex === getLasSlideIndex() ? 'none' : 'block'
        }

        const setVisibleSlider = (slideIndex)=>{
            const {state} = collectionData[currentCollectionIndex]
            state.currentSlideIndex = slideIndex
            const centerPosition = gatCenterPosition(slideIndex)
            activeCurrentItems()
            setArrowButtonsDisplay()
            animateTransition(true)
            translateSlide(centerPosition)
        }

        const backwardSlide =()=>{
            const {state} = collectionData[currentCollectionIndex]
            if(state.currentSlideIndex > 0){
                setVisibleSlider(state.currentSlideIndex -1)
            }else{
                setVisibleSlider(state.currentSlideIndex)
            }
            
        }
        const forwardSlide =()=>{
            const {state} = collectionData[currentCollectionIndex]
            const lastSlideIndex = getLasSlideIndex()

            if(state.currentSlideIndex < lastSlideIndex){
                setVisibleSlider(state.currentSlideIndex +1)
            }else{
                setVisibleSlider(state.currentSlideIndex)
            }
        }

        const onMouseDown = (event, itemIndex) =>{
            const {state} = collectionData[currentCollectionIndex]
            const item = event.currentTarget
            state.mouseDownPosition = event.clientX
            state.currentSlidePosition = event.clientX - state.lastTranslatePosition
            state.currentItemIndex = itemIndex
            item.addEventListener('mousemove', onMouseMove)
            animateTransition(false)
        
        }

        const onMouseMove = (event) =>{
            const {state} = collectionData[currentCollectionIndex]
            state.movement = event.clientX - state.mouseDownPosition
            const position = event.clientX - state.currentSlidePosition
            translateSlide(position)
        
        }

        const onMouseUp = (event) =>{
            const {state} = collectionData[currentCollectionIndex]
            const movementQtd = event.type.includes('touch') ? 50 : 150

            if(state.movement > movementQtd){
                backwardSlide()
            }else if(state.movement < -movementQtd){
                forwardSlide()
            }else{
                setVisibleSlider(state.currentSlideIndex )
            }
            state.movement = 0

            const item = event.currentTarget
            item.removeEventListener('mousemove', onMouseMove)
            
        }
        const onMouseLeave = (event) =>{
            const item = event.currentTarget
            item.removeEventListener('mousemove', onMouseMove)
            
        }


        const onTouchStart = (event, itemIndex)=>{
            const item = event.currentTarget
            item.addEventListener('touchmove', onTouchMove)
            event.clientX = event.touches[0].clientX
            onMouseDown(event, itemIndex)
        }
        const onTouchMove = (event)=>{
            event.clientX = event.touches[0].clientX
            onMouseMove(event)

        }
        const onTouchEnd =(event)=>{
            const item = event.currentTarget
            item.removeEventListener('touchmove', onTouchMove)
            onMouseUp(event)
        }

        const insertCollectionData = (collection)=>{
            collectionData.push({
                carouselList: collection.querySelector('[data-carousel="list"]'),
                carouselItem: collection.querySelectorAll('[data-carousel="item"]'),
                btnNext: collection.querySelector('[data-carousel="btn-next"]'),
                btnPrevious: collection.querySelector('[data-carousel="btn-previous"]'),
            
                state: {
                mouseDownPosition: 0,
                movement: 0,
                lastTranslatePosition: 0,
                currentSlidePosition: 0,
                currentItemIndex: 0,
                currentSlideIndex:0
            
            
                },
            })
        }

        const setItemPerSlide= ()=>{
            if(document.body.clientWidth < 1024){
                itemPerSlide = 2
                return
            }
            itemPerSlide = 5
        }
        const setWindowResizeListener=()=>{
            let resizeTimeOut;
            window.addEventListener('resize',(event)=>{
                clearTimeout(resizeTimeOut)
                resizeTimeOut = setTimeout(() => {
                    setItemPerSlide()
                    collections.forEach((collection, collectionIndex)=>{
                        currentCollectionIndex = collectionIndex
                        setVisibleSlider(0)
                    })
                }, 1000);
            })

        }


    const setListeners = (collectionIndex)=>{
        const {btnNext, btnPrevious, carouselItem} = collectionData[collectionIndex]

        btnNext.addEventListener('click',()=> {
            currentCollectionIndex = collectionIndex
            forwardSlide()
        })
        btnPrevious.addEventListener('click',()=>{
            currentCollectionIndex = collectionIndex
            backwardSlide()
        } )
        carouselItem.forEach((item, itemIndex)=>{
            const link = item.querySelector('.movie-carousel_link')
            link.addEventListener('click', preventDefault)
            item.addEventListener('dragstart', preventDefault)

            item.addEventListener('mousedown',(event)=>{
                currentCollectionIndex = collectionIndex
                onMouseDown(event, itemIndex)
            } )
            
            item.addEventListener('mouseup', onMouseUp)
            item.addEventListener('mouseleave', onMouseLeave)

            item.addEventListener('touchstart',function(event){
                currentCollectionIndex = collectionIndex
                onTouchStart(event, itemIndex)
            } )
            item.addEventListener('touchend',onTouchEnd)
            
        })
    }

    const init =  () => {
        setItemPerSlide()
        setWindowResizeListener()
        collections.forEach((collection, collectionIndex)=>{
            currentCollectionIndex = collectionIndex
            insertCollectionData(collection)
            setListeners(collectionIndex)
            setVisibleSlider(0)
        }) 
    }
    return {
        init
    }
}

export default collectionsModule



