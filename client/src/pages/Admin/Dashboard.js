import { useAuth } from "../../context/auth";
import Jumbotron from "../../components/cards/Jumbotron";
import DashboardMenu from "../../components/nav/DashboardMenu";
export default function AdminDashboard() {
    const [auth, setAuth] = useAuth();

    return (
        <>
            <Jumbotron
                title={`Hello ${auth?.user?.firstName}`}
                directory={"Admin Dashboard"}
            />
            <div
                style={{ maxWidth: "1170px", minHeight: "500px" }}
                className="container-fluid"
            >
                <div className="row">
                    <div className="col-md-3">
                        <DashboardMenu id={0} menutype={"admin"} />
                    </div>
                    <div className="col-md-9">
                        <div className="p-3 mt-2 mb-2 h4 bg-light">
                            Admin Information
                        </div>
                        <ul className="list-group">
                            <li className="list-group-item">
                                {auth?.user?.firstName} {auth?.user?.lastName}
                            </li>
                            <li className="list-group-item">
                                {auth?.user?.email}
                            </li>
                            <li className="list-group-item">Admin</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
