import { Children } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";


function AdminRoute({children}) {
    const { currentUser, role } = useSelector((state) => state.user);
    console.log(role);

    if(role == "admin"){
        return children
    } else {
     
    return <h2>Access Denied. Admin Only</h2>
    }
}

export default AdminRoute;