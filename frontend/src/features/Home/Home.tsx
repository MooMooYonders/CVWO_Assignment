import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Home: React.FC= () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default Home;