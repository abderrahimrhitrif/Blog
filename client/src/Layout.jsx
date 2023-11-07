import { Outlet } from "react-router-dom";
import Header from "./Header";
import "./Layout.css"

function Layout(){
    return(
        <main>
            <Header />
            <div className="pt-5 mt-2"><Outlet/></div>
            
        </main>
    )
}
export default Layout