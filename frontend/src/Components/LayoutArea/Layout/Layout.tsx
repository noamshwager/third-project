import { BrowserRouter } from "react-router-dom";
import Header from "../Header/Header";
import Menu from "../Menu/Menu";
import Routing from "../Routing/Routing";
import "./Layout.css";

function Layout(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="Layout">
                <header>
                    <Header />
                </header>
                <aside>
                    <Menu />
                </aside>
                <main>
                    <Routing />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default Layout;
