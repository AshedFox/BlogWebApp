import React from 'react';
import {BeatLoader} from "react-spinners";

const Loader = () => {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"}}>
            <BeatLoader size={20} loading/>
        </div>
    );
};

export default Loader;