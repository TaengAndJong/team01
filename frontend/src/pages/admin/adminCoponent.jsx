import React, { useState, useEffect } from 'react';
import AdminDashboard from "../admin/components/adminDashboard.jsx";
import adminDeliveryBoard from "../adminBoard/components/deliveryBoard.jsx"
import adminProductBoard from "../adminBoard/components/productBoard.jsx"
import adminOneBoard from "../adminBoard/components/qnaOneBoard.jsx"

import PathsData from "../../assets/pathsData.jsx"
import {Link, Route, Routes} from "react-router-dom";


function Admin() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/admin", {
                    method: "GET",
                });

                if (response.ok) {
                    const contentType = response.headers.get("Content-Type");

                    if (contentType && contentType.includes("application/json")) {
                        const jsonData = await response.json();
                        setData(jsonData);
                    } else {
                        const textData = await response.text();
                        setData({ message: textData });
                    }
                } else {
                    console.error("HTTP Error:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>

            <Routes>
                <Route path="/admin" exact component={AdminDashboard}/>
                <Route path={PathsData.adminDeliveryBoard} component={adminDeliveryBoard}/>
                <Route path={PathsData.adminProductBoard} component={adminProductBoard}/>
                <Route path={PathsData.adminOneBoard} component={adminOneBoard}/>
            </Routes>


            <h1>관리자 페이지</h1>
            {data ? (
                <div>
                    <p>메시지: {data.message}</p>
                    <p>시간: {data.timestamp}</p>
                </div>
            ) : (
                <p>데이터를 불러오는 중...</p>
            )}

            <AdminDashboard/>

        </div>
    );
}

export default Admin;
