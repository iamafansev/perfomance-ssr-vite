import {FC, useState} from 'react';

import { AppBar } from "client/AppBar";

import './About.css';

export const About: FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div>
            <AppBar />
            <div className="content">
                <h1>About page</h1>
                <button type="button" onClick={() => setCount((prev) => prev + 1)}>
                    count is {count}
                </button>
            </div>
        </div>
    );
};
