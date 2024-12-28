import { useEffect, useState } from 'react';
import { crudData } from "../../../assets/crudData.jsx";
import { useNavigate, Link } from 'react-router-dom';

const qnaList = () => {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 사용
    useEffect(() => {
        setPosts(crudData); // 데이터를 state로 설정
    }, []);


    return (
        <>
            <div>
                <div>
                    <h1>QnA 게시판</h1>
                </div>
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <Link to={`/post/${post.id}`}>{post.title}</Link> {/* 클릭 시 dtail 컴포넌트로 이동*/}
                            <div>{post.date}</div> {/* DB에 저장된 생성 날짜*/}
                        </li>
                    ))}
                    <div>
                        <button
                            className="qna-write-button"
                            onClick={() => navigate('/create')}
                        >글 쓰기
                        </button>
                        {/* 버튼 클릭 시 게시판 글 작성 컴포넌트로 이동 */}
                    </div>
                </ul>
            </div>
        </>
    )
}

export default qnaList;