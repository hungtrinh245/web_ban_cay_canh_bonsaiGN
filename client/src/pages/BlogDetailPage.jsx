// client/src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../services/blogService'; 

const BlogDetailPage = () => {
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const data = await getPostById(id);
                setPost(data);
            } catch (err) {
                console.error("Không thể tải bài viết:", err);
                setError('Không tìm thấy bài viết hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        window.scrollTo(0, 0); // Cuộn lên đầu trang
    }, [id]); // Chạy lại khi ID thay đổi


    const pageContainerStyle = {
        maxWidth: '900px', // Chiều rộng nội dung bài viết
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
        lineHeight: '1.6',
    };

    const postTitleStyle = {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const postMetaStyle = {
        fontSize: '0.9em',
        color: '#777',
        textAlign: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
    };

    const postImageStyle = {
        width: '100%',
        maxHeight: '450px',
        objectFit: 'cover',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        marginBottom: '40px',
    };

    const postContentStyle = {
        fontSize: '1.1em',
        color: '#444',
        '& p': {
            marginBottom: '1em',
        },
        '& strong': {
            color: '#2c3e50',
        },
        '& ul': {
            listStyle: 'disc',
            marginLeft: '20px',
            marginBottom: '1em',
        }
    };


    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải bài viết...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center', padding: '50px' }}>{error}</p>;
    if (!post) return <p style={{ textAlign: 'center', padding: '50px' }}>Bài viết không tồn tại.</p>;

    // Định dạng ngày
    const formattedDate = new Date(post.createdAt).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div style={pageContainerStyle}>
            <h1 style={postTitleStyle}>{post.title}</h1>
            <p style={postMetaStyle}>
                {/* Bởi {post.author} vào ngày {formattedDate} */}
                {post.category && ` | Danh mục: ${post.category}`}
                {post.views > 0 && ` | Lượt xem: ${post.views}`}
            </p>
            {post.image && (
                <img src={post.image} alt={post.title} style={postImageStyle} />
            )}
            <div style={postContentStyle}>
               
                <p>{post.excerpt}</p> {/* Hiển thị excerpt trước */}
                <p>{post.content}</p> {/* Hiển thị nội dung chính */}
            </div>
        </div>
    );
};

export default BlogDetailPage;