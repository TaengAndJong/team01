import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { crudData } from '../../../assets/crudData.jsx';

const qnaEdit = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        const post = crudData.find((item) => item.id === parseInt(id));
        if (post) {
            setTitle(post.title);
            setContent(post.content);
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Post:', { id, title, content });
        alert('Post updated (console log for testing)');
        window.location.href = `/post/${id}`;
    };

    return (
        <form onSubmit={handleSubmit}>

            <div>
                <span>제목 : </span>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목"/>
            </div>
            <div>
                <span>내용 : </span>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용"/>
            </div>
            <button type="submit">수정</button>
        </form>
    );
}

export default qnaEdit;