import React, { useState, useEffect } from 'react';





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


                <h1>관리자 페이지</h1>
                {data ? (
                    <div>
                        <p>메시지: {data.message}</p>
                        <p>시간: {data.timestamp}</p>
                    </div>
                ) : (
                    <p>데이터를 불러오는 중...</p>
                )}
            {/*왼쪽 메뉴 Link 설정*/}

                {/*오른쪽 컨텐츠*/}
                <div className="right">
                    <div className="content">
                        {/*{content}*/}
                    </div>
                </div>


            </div>
            );
            }

export default Admin;
