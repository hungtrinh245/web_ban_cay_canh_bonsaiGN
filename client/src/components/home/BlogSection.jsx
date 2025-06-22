// client/src/components/home/BlogSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const posts = [
    { id: 1, title: 'Nên tưới cây bằng nước máy hay nước đun sôi?', image: '/images/sample-luoi-ho.jpg', excerpt: 'Vì sao lại lựa chọn hai loại nước này? Vì nếu bạn ở thành phố và văn phòng thì...' },
    { id: 2, title: '8 yếu tố giúp cây trồng trong nhà luôn xanh tốt', image: '/images/sample-trau-ba.jpg', excerpt: 'Trong thời đại hiện nay, cây trồng trong nhà không chỉ để trang trí mà còn mang lại...' },
    { id: 3, title: '10 loại cây trừ tà ma, xua đuổi vận xui hiệu quả', image: '/images/sample-xuong-rong-tai-tho.jpg', excerpt: 'Trồng cây xanh không chỉ giúp thanh lọc không khí mà còn có ý nghĩa phong thủy sâu sắc...' },
];

const BlogSection = () => {
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
        textAlign: 'left'
    };
    const imgStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    };
    const contentStyle = {
        padding: '20px'
    };

    return (
        <div style={sectionStyle}>
            <div style={containerStyle}>
                <h2 style={titleStyle}>BÀI VIẾT & MẸO CHĂM SÓC</h2>
                <div style={gridStyle}>
                    {posts.map(post => (
                        <div key={post.id} style={postCardStyle}>
                            <img src={post.image} alt={post.title} style={imgStyle}/>
                            <div style={contentStyle}>
                                <h3 style={{fontSize: '1.2em'}}><Link to={`/blog/${post.id}`} style={{textDecoration: 'none', color: 'inherit'}}>{post.title}</Link></h3>
                                <p style={{color: '#777'}}>{post.excerpt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogSection;