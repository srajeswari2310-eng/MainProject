import { Children } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


function UserRoute({children}) {
     const { currentUser, role } = useSelector((state) => state.user);
    console.log(role);

    if(role == "user" || role == "admin"){
        return children
    } else {
     
    return <h2>Access Denied. User Only</h2>
    }
}

export default UserRoute;