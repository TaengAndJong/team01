import React, { useState, useEffect } from 'react';
import {Outlet} from "react-router-dom";
import LeftMenu from "../../layout/LeftMenu.jsx"
import AdminDashboard from "../adminBoard/components/adminDashboard.jsx"
import "../../../dist/assets/pages/admin/admin.css"






function Admin() {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/admin", {
                    method: "GET",
                    credentials: 'include',  // 쿠키와 인증 정보를 포함한 요청
                });

                if (response.ok) {
                    const contentType = response.headers.get("Content-Type");

                    if (contentType && contentType.includes("application/json")) {
                        const jsonData = await response.json();
                        setData(jsonData);  // 인증된 데이터 처리
                    } else {
                        const textData = await response.text();
                        setData({ message: textData });  // 비인증 응답 처리
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
        <div className="page admin">
                <div className="top">
                    <h1>관리자 페이지</h1>
                    {data ? (
                        <div>
                            <p>메시지: {data.message}</p>
                            <p>시간: {data.timestamp}</p>
                        </div>
                    ) : (
                        <p>데이터를 불러오는 중...</p>
                    )}
                </div>
            <div  className="bottom">
                <AdminDashboard/>
            </div>
        </div>
    );
}

export default Admin;
