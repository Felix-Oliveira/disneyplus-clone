// import header from "./modules/header.js";
// import bannerSlider from "./modules/banner-slider.js"

// import collections from "./modules/collections.js";

import { getHomeContent } from "./services/getHomeContent.js";
import Home from "./pages/home.js"


// header.init()
// bannerSlider.init()
// collections.init()

getHomeContent()
    .then((data)=>{
        Home(data)
    }).catch((error)=>{
        console.log(error)
    })
