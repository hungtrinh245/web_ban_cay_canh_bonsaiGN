// client/src/components/home/BlogSection.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLatestPosts } from '../../services/blogService'; // <-- IMPORT HÀM MỚI

const BlogSection = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const data = await getLatestPosts(); // Lấy các bài viết mới nhất
                setPosts(data);
            } catch (err) {
                console.error("Không thể tải bài viết:", err);
                setError('Không thể tải bài viết. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const sectionStyle = {
        padding: '60px 20px',
        background: '#fcfaf5',
    };
    const containerStyle = {
        maxWidth: '1200px',
        margin: 'auto',
        textAlign: 'center'
    };
    const titleStyle = {
        fontSize: '2em',
        marginBottom: '40px'
    };
    const gridStyle = {
        display: 'flex',
        gap: '30px',
        justifyContent: 'center',
        flexWrap: 'wrap'
    };
    const postCardStyle = {
        flex: 1,
        minWidth: '300px',
        maxWidth: '350px',
        background: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
        textAlign: 'left',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Hiệu ứng hover
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        }
    };
    const imgStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    };
    const contentStyle = {
        padding: '20px'
    };
    const postTitleLinkStyle = {
        textDecoration: 'none',
        color: '#333',
        fontSize: '1.2em',
        fontWeight: 'bold',
        transition: 'color 0.2s',
        '&:hover': {
            color: '#28a745',
        }
    };
    const postExcerptStyle = {
        color: '#777',
        fontSize: '0.95em',
        lineHeight: '1.6',
    };

    
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);


    return (
        <div style={sectionStyle}>
            <div style={containerStyle}>
                <h2 style={titleStyle}>BÀI VIẾT & MẸO CHĂM SÓC</h2>
                {loading ? (
                    <p>Đang tải bài viết...</p>
                ) : error ? (
                    <p style={{color: 'red'}}>{error}</p>
                ) : (
                    <div style={gridStyle}>
                        {posts.map(post => (
                            <div 
                                key={post._id} // SỬ DỤNG _id TỪ MONGODB LÀM KEY
                                style={postCardStyle}
                                onMouseOver={(e) => applyHover(e, postCardStyle['&:hover'])}
                                onMouseOut={(e) => removeHover(e, postCardStyle)}
                            >
                                <img src={post.image || 'https://via.placeholder.com/200x150?text=No+Image'} alt={post.title} style={imgStyle}/>
                                <div style={contentStyle}>
                                    <h3 style={{margin: '0 0 10px 0'}}>
                                        <Link 
                                            to={`/blog/${post._id}`} // LINK ĐẾN TRANG CHI TIẾT BÀI VIẾT
                                            style={postTitleLinkStyle}
                                            onMouseOver={(e) => applyHover(e, postTitleLinkStyle['&:hover'])}
                                            onMouseOut={(e) => removeHover(e, postTitleLinkStyle)}
                                        >
                                            {post.title}
                                        </Link>
                                    </h3>
                                    <p style={postExcerptStyle}>{post.excerpt}</p>
                                </div>
                            </div>
                        ))}
                        {posts.length === 0 && <p>Không có bài viết nào để hiển thị.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogSection;