// client/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { sendMessage } from '../services/contactService'; 

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formStatus, setFormStatus] = useState(''); // 'success', 'error', ''

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus('');

        //validation
        if (!name || !email || !phone || !message) {
            setFormStatus('error');
            setLoading(false);
            return;
        }

        try {
            // GỌI API GỬI TIN NHẮN TẠI ĐÂY (sendMessage đã được import)
            const response = await sendMessage({ name, email, phone, message });
            console.log('Message sent:', response);

            setFormStatus('success');
            alert(response.message); // Hiển thị thông báo thành công từ backend
            // Reset form
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
        } catch (err) {
            console.error('Lỗi khi gửi tin nhắn:', err);
            setFormStatus('error');
            // Kiểm tra nếu lỗi có message từ backend
            alert(err.message || 'Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.'); 
        } finally {
            setLoading(false);
        }
    };

    // --- CÁC STYLE CHO TRANG LIÊN HỆ ---
    const pageContainerStyle = {
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
    };

    const pageTitleStyle = {
        fontSize: '2.8em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '40px',
        textAlign: 'center',
        position: 'relative',
        paddingBottom: '15px',
    };

    const pageTitleUnderlineStyle = {
        width: '80px',
        height: '4px',
        background: '#28a745',
        margin: '0 auto',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    const contentWrapperStyle = {
        display: 'flex',
        gap: '40px',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    };

    const infoColumnStyle = {
        flex: '1 1 450px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        border: '1px solid #eee',
    };

    const formColumnStyle = {
        flex: '1 1 450px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        padding: '30px',
        border: '1px solid #eee',
    };

    const sectionTitleStyle = {
        fontSize: '1.5em',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '25px',
        paddingBottom: '10px',
        borderBottom: '2px solid #ddd',
        marginTop: '0',
    };

    const contactInfoItemStyle = {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '15px',
        gap: '15px',
        fontSize: '1.05em',
        color: '#555',
    };

    const contactIconStyle = {
        fontSize: '1.5em',
        color: '#28a745',
        flexShrink: 0,
    };

    const mapContainerStyle = {
        width: '100%',
        height: '350px',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginTop: '30px',
        border: '1px solid #eee',
    };

    const formGroupStyle = {
        marginBottom: '20px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    };

    const inputStyle = {
        width: '100%',
        padding: '12px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        fontSize: '1em',
        boxSizing: 'border-box',
    };

    const textareaStyle = {
        ...inputStyle,
        minHeight: '120px',
        resize: 'vertical',
    };

    const submitButtonStyle = {
        width: '100%',
        padding: '15px',
        background: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease, transform 0.2s',
        '&:hover': {
            backgroundColor: '#218838',
            transform: 'translateY(-2px)',
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
    };

    const formStatusMessageStyle = {
        textAlign: 'center',
        marginTop: '20px',
        padding: '10px',
        borderRadius: '5px',
        fontWeight: 'bold',
    };

    const successMessageStyle = {
        ...formStatusMessageStyle,
        background: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb',
    };

    const errorMessageStyle = {
        ...formStatusMessageStyle,
        background: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
    };


    // Helper functions for hover effects
    const applyHover = (e, hoverStyle) => Object.assign(e.currentTarget.style, hoverStyle);
    const removeHover = (e, baseStyle) => Object.assign(e.currentTarget.style, baseStyle);

    return (
        <div style={pageContainerStyle}>
            <h1 style={pageTitleStyle}>
                Liên hệ với chúng tôi
                <div style={pageTitleUnderlineStyle}></div>
            </h1>

            <div style={contentWrapperStyle}>
                {/*Thông tin và Bản đồ */}
                <div style={infoColumnStyle}>
                    <h2 style={sectionTitleStyle}>Thông tin liên hệ</h2>
                    <div style={contactInfoItemStyle}>
                        <div style={contactIconStyle}><FaMapMarkerAlt /></div>
                        <p><strong>Địa chỉ:</strong> TP Hà Nội, Việt Nam</p>
                    </div>
                    <div style={contactInfoItemStyle}>
                        <div style={contactIconStyle}><FaPhone /></div>
                        <p><strong>Hotline:</strong> 09 6688 9393</p>
                    </div>
                    <div style={contactInfoItemStyle}>
                        <div style={contactIconStyle}><FaEnvelope /></div>
                        <p><strong>Email:</strong> hotro@bonsaigarden.com</p>
                    </div>

                    <div style={mapContainerStyle}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.1039864270177!2d105.77660637500001!3d21.02677938062838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b52c02052f%3A0x6e788e0c8b2a3d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBRdeG7kWMgZ2lhIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1719946468499!5m2!1svi!2s" // Vui lòng thay thế bằng URL Google Maps của bạn
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="BonsaiGN Shop Location"
                        ></iframe>
                    </div>
                </div>

                {/*Form liên hệ */}
                <div style={formColumnStyle}>
                    <h2 style={sectionTitleStyle}>Gửi tin nhắn cho chúng tôi</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={formGroupStyle}>
                            <label htmlFor="contactName" style={labelStyle}>Họ và tên <span style={{color: 'red'}}>*</span></label>
                            <input
                                type="text"
                                id="contactName"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <label htmlFor="contactEmail" style={labelStyle}>Email <span style={{color: 'red'}}>*</span></label>
                            <input
                                type="email"
                                id="contactEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <label htmlFor="contactPhone" style={labelStyle}>Số điện thoại <span style={{color: 'red'}}>*</span></label>
                            <input
                                type="tel"
                                id="contactPhone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={formGroupStyle}>
                            <label htmlFor="contactMessage" style={labelStyle}>Lời nhắn <span style={{color: 'red'}}>*</span></label>
                            <textarea
                                id="contactMessage"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={textareaStyle}
                                required
                                placeholder="Viết tin nhắn của bạn tại đây..."
                            />
                        </div>
                        {formStatus === 'success' && (
                            <p style={successMessageStyle}>Tin nhắn của bạn đã được gửi thành công!</p>
                        )}
                        {formStatus === 'error' && (
                            <p style={errorMessageStyle}>Vui lòng điền đầy đủ các trường bắt buộc hoặc có lỗi xảy ra.</p>
                        )}
                        <button
                            type="submit"
                            style={submitButtonStyle}
                            onMouseOver={(e) => applyHover(e, submitButtonStyle['&:hover'])}
                            onMouseOut={(e) => removeHover(e, submitButtonStyle)}
                            disabled={loading}
                        >
                            {loading ? 'Đang gửi...' : 'GỬI'}
                            {loading && <div style={{marginLeft: '10px', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', width: '16px', height: '16px', animation: 'spin 1s linear infinite'}}></div>}
                        </button>
                    </form>
                </div>
            </div>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
        </div>
    );
};

export default ContactPage;