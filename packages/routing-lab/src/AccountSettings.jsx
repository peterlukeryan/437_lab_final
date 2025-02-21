import { MainLayout } from "./MainLayout.jsx";
import { useState } from "react";

export function AccountSettings(props) {

    return (
        <MainLayout>
            <h2>Account settings</h2>
            <label>
                Username <input onChange={(e) => {props.toggle(e.target.value)}}/>
            </label>
            <p><i>Changes are auto-saved.</i></p>
        </MainLayout>
    );
}
