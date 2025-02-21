import { MainLayout } from "./MainLayout.jsx";

export function Homepage(props) {
    return (
        <div>
            <h2>Welcome, {props.name}</h2>
            <p>This is the content of the home page.</p>
        </div>
    );
}
