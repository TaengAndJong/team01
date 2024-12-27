import React, { useState, useEffect } from 'react'; // React에서 useState와 useEffect를 가져옵니다.
import { useParams, Link } from 'react-router-dom';
import { crudData } from "../../../assets/crudData.jsx";

const qnaDetail = () =>{
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const foundPost = crudData.find((item) => item.id === parseInt(id));
        if (foundPost) {
            setPost(foundPost);
        }
    }, [id]);


    return (

        <>
            {post ? (
                <>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                    <Link to={`/edit/${id}`}>수정</Link>
                </>
            ) : (
                <p>Post not found</p>
            )}
        </>
    )
}

export default qnaDetail;