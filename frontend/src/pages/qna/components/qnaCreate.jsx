import { useState } from 'react';

const qnaCreate = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New Post:', { title, content });
        alert('Post created (console log for testing)');
        window.location.href = '/';
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
            <button type="submit">작성</button>
        </form>
    );
}

export default qnaCreate;