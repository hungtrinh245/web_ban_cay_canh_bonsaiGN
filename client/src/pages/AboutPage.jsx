// client/src/pages/AboutPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaShippingFast, FaSmile, FaQuestionCircle, FaCertificate } from 'react-icons/fa';

const AboutPage = () => {
    const [openFaq, setOpenFaq] = useState(null);

    const faqs = [
        {
            question: "BonsaiGN Shop có bán cây cảnh thật không?",
            answer: "Có, tất cả cây cảnh tại BonsaiGN Shop đều là cây thật, được chăm sóc kỹ lưỡng từ các nhà vườn uy tín, đảm bảo sức sống và chất lượng tốt nhất khi đến tay khách hàng."
        },
        {
            question: "Làm sao để chọn được cây cảnh phù hợp cho không gian của tôi?",
            answer: "Bạn có thể tham khảo mục 'Mẹo chăm sóc' trên website của chúng tôi, hoặc liên hệ trực tiếp với đội ngũ tư vấn của BonsaiGN Shop qua hotline/email. Chúng tôi luôn sẵn lòng hỗ trợ bạn tìm được cây ưng ý nhất."
        },
        {
            question: "Chính sách bảo hành và đổi trả của BonsaiGN Shop như thế nào?",
            answer: "Chúng tôi có chính sách bảo hành rõ ràng cho từng loại cây và chính sách đổi trả linh hoạt trong vòng 7 ngày nếu cây có vấn đề về chất lượng hoặc không đúng mô tả. Vui lòng xem chi tiết tại mục 'Chính sách bảo hành' và 'Chính sách đổi trả' ở chân trang."
        },
        {
            question: "BonsaiGN Shop có giao hàng toàn quốc không?",
            answer: "Hiện tại, BonsaiGN Shop hỗ trợ giao hàng trên toàn quốc với dịch vụ đóng gói chuyên nghiệp, đảm bảo cây được vận chuyển an toàn và tươi tốt. Chi phí và thời gian giao hàng sẽ phụ thuộc vào địa điểm của bạn."
        },
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };


    const pageContainerStyle = {
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
        lineHeight: '1.6',
        backgroundColor: '#fcfaf5', 
        paddingBottom: '60px',
    };

    const heroSectionStyle = {
        position: 'relative',
        height: '60vh',

        background: `url(/images/banner-bancaydep.jpg) center center/cover no-repeat`, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
        marginBottom: '60px',
    };

    const heroOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.4)', 
        zIndex: 1,
    };

    const heroContentStyle = {
        position: 'relative',
        zIndex: 2,
        maxWidth: '800px',
        padding: '0 20px',
    };

    const heroTitleStyle = {
        fontSize: '3.5em',
        fontWeight: 'bold',
        marginBottom: '15px',
    };

    const heroSubtitleStyle = {
        fontSize: '1.5em',
        marginBottom: '30px',
    };

    const mainContentAreaStyle = {
        maxWidth: '1000px',
        margin: 'auto',
        padding: '0 20px',
    };

    const sectionStyle = {
        marginBottom: '60px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '40px',
        border: '1px solid #eee',
    };

    const sectionTitleStyle = {
        fontSize: '2.2em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '30px',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '15px',
        
    };

    const twoColumnLayout = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        alignItems: 'center',
    };

    const textColumnStyle = {
        flex: '1 1 450px',
        textAlign: 'left',
    };

    const imageColumnStyle = {
        flex: '1 1 400px',
        '& img': { 
            width: '100%',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        }
    };
  
    const imageColumnImgStyle = {
        width: '100%',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
    };


    const serviceGridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '30px',
        textAlign: 'center',
    };

    const serviceItemStyle = {
        background: '#f8f8f8',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        }
    };

    const serviceIconStyle = {
        fontSize: '3em',
        color: '#28a745',
        marginBottom: '15px',
    };

    const serviceTitleStyle = {
        fontSize: '1.3em',
        fontWeight: 'bold',
        marginBottom: '10px',
        color: '#2c3e50',
    };

    const faqSectionStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '40px',
        border: '1px solid #eee',
    };

    const faqItemStyle = {
        marginBottom: '15px',
        borderBottom: '1px solid #eee',
        paddingBottom: '15px',
        cursor: 'pointer',
    };

    const faqQuestionStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
        fontSize: '1.1em',
        color: '#333',
        '&:hover': {
            color: '#28a745',
        }
    };

    const faqAnswerStyle = {
        fontSize: '0.95em',
        color: '#666',
        marginTop: '10px',
        paddingLeft: '15px',
        borderLeft: '3px solid #28a745',
    };

    const callToActionStyle = {
        textAlign: 'center',
        padding: '60px 20px',
        background: '#e9f5e9', 
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        marginTop: '60px',
    };

    const ctaTitleStyle = {
        fontSize: '2em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '20px',
    };

    const ctaButton = {
        padding: '15px 35px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        textDecoration: 'none',
        fontSize: '1.2em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'translateY(-3px)',
        }
    };

    // Helper functions for hover effects (since inline styles don't directly support :hover)
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);

    return (
        <div style={pageContainerStyle}>
            {/* Hero Section */}
            <div style={heroSectionStyle}>
                <div style={heroOverlayStyle}></div>
                <div style={heroContentStyle}>
                    <h1 style={heroTitleStyle}>Về BonsaiGN Shop</h1>
                    <p style={heroSubtitleStyle}>Hơn cả những chậu cây, chúng tôi mang đến không gian xanh và sự bình yên cho ngôi nhà bạn.</p>
                </div>
            </div>

            <div style={mainContentAreaStyle}>
                {/* Our Story/Mission Section */}
                <div style={sectionStyle}>
                    {/* Sử dụng className để áp dụng pseudo-element từ thẻ <style> */}
                    <h2 style={{...sectionTitleStyle}} className="section-title">Câu chuyện của chúng tôi</h2>
                    <div style={twoColumnLayout}>
                        <div style={textColumnStyle}>
                            <p>BonsaiGN Shop ra đời từ niềm đam mê vô tận với cây cảnh và mong muốn lan tỏa vẻ đẹp cũng như giá trị của chúng đến mọi không gian sống. Chúng tôi tin rằng, mỗi chậu cây không chỉ là vật trang trí mà còn là một tác phẩm nghệ thuật, một người bạn đồng hành mang lại sự thư thái, cân bằng cho tâm hồn.</p>
                            <p>Từ những ngày đầu khởi nghiệp với một cửa hàng nhỏ, BonsaiGN Shop đã không ngừng học hỏi, tìm tòi và phát triển để trở thành điểm đến tin cậy cho những người yêu cây cảnh. Chúng tôi tự hào mang đến bộ sưu tập đa dạng, từ những cây để bàn nhỏ xinh đến những tác phẩm bonsai cổ thụ quý hiếm.</p>
                        </div>
                        <div style={imageColumnStyle}>
                            
                            <img src="/images/sample-sanh-co.jpg" alt="Our Story" style={imageColumnImgStyle} />
                        </div>
                    </div>
                </div>

               
                <div style={sectionStyle}>
                    <h2 style={{...sectionTitleStyle}} className="section-title">Tại sao chọn BonsaiGN Shop?</h2>
                    <div style={serviceGridStyle}>
                        <div style={serviceItemStyle}
                            onMouseOver={(e) => applyHover(e, serviceItemStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, serviceItemStyle)}
                        >
                            <div style={serviceIconStyle}><FaLeaf /></div>
                            <h3 style={serviceTitleStyle}>Cây Trồng Chất Lượng</h3>
                            <p>Tuyển chọn kỹ lưỡng từ những nhà vườn uy tín, đảm bảo sức sống và vẻ đẹp vượt trội.</p>
                        </div>
                        <div style={serviceItemStyle}
                            onMouseOver={(e) => applyHover(e, serviceItemStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, serviceItemStyle)}
                        >
                            <div style={serviceIconStyle}><FaShippingFast /></div>
                            <h3 style={serviceTitleStyle}>Giao Hàng Nhanh Chóng</h3>
                            <p>Đóng gói cẩn thận, giao hàng tận nơi, đảm bảo cây luôn tươi tốt và an toàn.</p>
                        </div>
                        <div style={serviceItemStyle}
                            onMouseOver={(e) => applyHover(e, serviceItemStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, serviceItemStyle)}
                        >
                            <div style={serviceIconStyle}><FaSmile /></div>
                            <h3 style={serviceTitleStyle}>Tư Vấn Tận Tình</h3>
                            <p>Đội ngũ chuyên gia sẵn lòng hỗ trợ bạn chọn cây và chia sẻ bí quyết chăm sóc.</p>
                        </div>
                        <div style={serviceItemStyle}
                            onMouseOver={(e) => applyHover(e, serviceItemStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, serviceItemStyle)}
                        >
                            <div style={serviceIconStyle}><FaCertificate /></div> 
                            <h3 style={serviceTitleStyle}>Chính sách bảo hành</h3>
                            <p>Cam kết bảo hành rõ ràng, hỗ trợ đổi trả nếu sản phẩm có lỗi từ nhà sản xuất.</p>
                        </div>
                    </div>
                </div>

                {/* FAQs Section */}
                <div style={faqSectionStyle}>
                    <h2 style={{...sectionTitleStyle}} className="section-title">Câu hỏi thường gặp</h2>
                    <div>
                        {faqs.map((faq, index) => (
                            <div key={index} style={faqItemStyle}>
                                <div 
                                    style={faqQuestionStyle} 
                                    onClick={() => toggleFaq(index)}
                                    onMouseOver={(e) => applyHover(e, faqQuestionStyle['&:hover'])}
                                    onMouseOut={(e) => removeHover(e, faqQuestionStyle)}
                                >
                                    <span>{faq.question}</span>
                                    <FaQuestionCircle size={18} style={{ color: openFaq === index ? '#28a745' : '#aaa' }} />
                                </div>
                                {openFaq === index && (
                                    <p style={faqAnswerStyle}>{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action Section */}
                <div style={callToActionStyle}>
                    <h2 style={ctaTitleStyle}>Khám phá không gian xanh của bạn ngay hôm nay!</h2>
                    <Link 
                        to="/shop" 
                        style={ctaButton}
                        onMouseOver={(e) => applyHover(e, ctaButton['&:hover'])}
                        onMouseOut={(e) => removeHover(e, ctaButton)}
                    >
                        ĐẾN CỬA HÀNG
                    </Link>
                </div>
            </div>

            {/* Global Styles for pseudo-elements */}
            <style>
                {`
                .section-title::after {
                    content: "";
                    width: 80px;
                    height: 4px;
                    background: #28a745;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
                `}
            </style>
        </div>
    );
};

export default AboutPage;