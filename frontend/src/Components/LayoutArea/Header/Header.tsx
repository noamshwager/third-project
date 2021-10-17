import AuthMenu from "../../AuthArea/AuthMenu/AuthMenu";

function Header(): JSX.Element {
    return (
        <div className="Header">
            <AuthMenu />
            <h1 style={{color:"darkcyan"}}>Vacation Following</h1>
        </div>
    );
}

export default Header;
