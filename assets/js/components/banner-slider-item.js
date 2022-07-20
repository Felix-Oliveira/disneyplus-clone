const BannerSliderItem = (props)=>{
    return `
            <div class="banner-slider_item" data-banner="item" data-id="${props.id}">
                <a href="/${props.slug}" class="banner-slider_link">
                    <img class="banner-slider_cover" src="${props.imageCover}" alt="${props.title}">
                    <img class="banner-slider_title" src="${props.imageTitle}" alt="${props.title}" data-banner="img-title">
                    
                </a>
            </div>
        `
}

export default BannerSliderItem