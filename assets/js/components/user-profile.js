const UserProfile = (props)=>{
    return ` 
        <li class="user-menu_item" data-id="${props.id}">
            <div class="user-profile ">
                <img src="${props.avatar}" alt="" class="user-profile_avatar">
                <span class="user-profile_title">${props.name}</span>
            </div>
        </li>
        `
}

export default UserProfile