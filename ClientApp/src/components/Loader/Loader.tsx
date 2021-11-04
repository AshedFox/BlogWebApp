import React from 'react';
import {BeatLoader} from "react-spinners";

const Loader = () => {
    return (
        <div style={{display: "flex", alignItems: "center", height:"100%", justifyContent: "center"}}>
            <BeatLoader size={20} loading/>
        </div>
    );
};

export default Loader;