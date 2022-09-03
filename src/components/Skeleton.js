import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

import './css/skeleton.css'

function Skeleton({ type }) {
    const COUNTER = 8
    const ProductSkeleton = () => (
        <div className="productSkeleton">
            <div className="productSkeleton_Img"></div>
            <div className="productSkeleton_Info">
                <div className="productSkeleton_Title"></div>
                <div className="productSkeleton_Rating"></div>
                <div className="productSkeleton_Price"></div>
            </div>
            <div className="productSkeleton_Button"></div>
        </div>
    );
    const CircularLoader = () => (
        <div className="productSkeleton">
            <CircularProgress />
        </div>
    );
    if (type === "products") return Array(COUNTER).fill(<ProductSkeleton />);
    if (type === "circle") return (<CircularLoader />);
    // return (
    //     <div>Skeleton</div>
    // )
}

export default Skeleton