import React, {useEffect, useState} from "react";


function Page({data,setUrl}){

    useEffect(() => {
        setUrl('/api/page'); // Login 컴포넌트 진입 시 URL 변경
    }, [setUrl]);

    //page 데이터 상태 관리 변수
    const [pageId, setpageId] = useState(''); // id 상태 추가
    const [pagePath, setpagePath] = useState('');
    const [pageName, setpageName] = useState('');


    const handlepageIdChange = (e) =>{

        setpageId(e.target.value);
    }

    const handlepagePathChange = (e) =>{

        setpagePath(e.target.value);

    }

    const handlepageNamedChange = (e) =>{

        setpageName(e.target.value);

    }

    // submit 버튼 클릭 시 fetch 통해 로그인 컨트롤러에 데이터 요청
    const handleFormSubmit = async (e) => {
        e.preventDefault();// 이벤트 버블링 방지

        const userCredentials = {
            pageId: pageId,
            pagePath: pagePath,
            pageName:pageName
        };

        // 로그인 요청 백엔드 서버로 보내기
        const response = await fetch("/api/page",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // JSON 데이터 전송을 알림
            },
            body: JSON.stringify(userCredentials), // JSON 데이터
        });


        const contentType = response.headers.get("Content-Type");
        let data='';
        //백엔드 서버로부터 응답 받기
        if(response.ok){

            //1) contentType이 null 또는 undefined 인지 확인 
            //2) "application/json" 을 포함하고 있는지
            if (contentType && contentType.includes("application/json")) {
                // JSON 응답일 경우
                try {
                    data = await response.json(); // JSON 파싱
                    // data.message를 사용하려면 응답 데이터에 해당 속성이 있어야 함
                    if (data && data.message) {
                        console.log("응답 메시지:", data.message);
                    }
                } catch (error) {
                    console.error("JSON 파싱 오류:", error);
                }
            }else {
                // 텍스트 응답일 경우
                data = await response.text();
                console.log("응답 텍스트:", data);
            }

            return data;

        }else{
            console.log("failed insert",response.status);
        }


    };




    //배역일 때와 배열 아닐때 설정해줘야 에러안남
    const Listdata = Array.isArray(data) ? data : [];

    return(
        <div>
            <p>페이지</p>
            <ul>
                {Listdata.map((item, index) => (
                    <li key={index}>
                        <span>{item.pageId}</span>
                        <span>{item.pagePath}</span>
                    </li>
                ))}
            </ul>


            <form  onSubmit={handleFormSubmit}>

                <label>
                    <input
                        type="text"
                        name="pageId"
                        placeholder="페이지ID"
                        value={pageId}
                        onChange={handlepageIdChange} // id 상태 업데이트
                    />
                </label>
                <br/>
                <label>
                    페이지경로:
                    <input
                        type="text"
                        name="pagePath"
                        placeholder="페이지경로"
                        value={pagePath}
                        onChange={handlepagePathChange}
                    />
                </label>
                <label>
                    페이지명:
                    <input
                        type="text"
                        name="pageName"
                        placeholder="페이지명"
                        value={pageName}
                        onChange={handlepageNamedChange}
                    />
                </label>
                <br/>
                <button type="submit">insert</button>
            </form>

        </div>

    );
}

export default Page;