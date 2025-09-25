const express = require('express');
const router = express.Router();
const qs = require('qs');
const dayjs = require('dayjs');
const { sortObject, hmacSHA512 } = require('../utils/vnpay.helper');

router.post('/vnpay/create', async (req, res) => {
  try {
    const { amount, orderId, orderInfo } = req.body;
    if (!amount || !orderId) {
      return res.status(400).json({ message: 'Thiếu amount hoặc orderId' });
    }

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;
    const returnUrl = process.env.VNP_RETURN_URL;

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Amount: Number(amount) * 100, // nhân 100
      vnp_CurrCode: 'VND',
      vnp_TxnRef: String(orderId),
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Locale: process.env.VNP_LOCALE || 'vn',
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      vnp_CreateDate: dayjs().format('YYYYMMDDHHmmss')
    };

    const sorted = sortObject(vnpParams);
    const signData = qs.stringify(sorted, { encode: false });
    const secureHash = hmacSHA512(secretKey, signData);

    sorted['vnp_SecureHash'] = secureHash;
    const paymentUrl = vnpUrl + '?' + qs.stringify(sorted, { encode: false });

    return res.json({ paymentUrl });
  } catch (error) {
    console.error('Create VNPay URL error:', error);
    res.status(500).json({ message: 'Tạo URL thanh toán thất bại' });
  }
});

router.get('/vnpay/ipn', async (req, res) => {
  try {
    const vnpParams = { ...req.query };
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sorted = sortObject(vnpParams);
    const signData = qs.stringify(sorted, { encode: false });
    const secretKey = process.env.VNP_HASH_SECRET;
    const checkHash = hmacSHA512(secretKey, signData);

    if (secureHash !== checkHash) {
      return res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }

    const rspCode = vnpParams['vnp_ResponseCode'];
    const txnRef = vnpParams['vnp_TxnRef'];
    const amount = Number(vnpParams['vnp_Amount']) / 100;

    // ✅ Xử lý kết quả thanh toán
    if (rspCode === '00') {
      console.log(`Đơn hàng ${txnRef} thanh toán thành công, số tiền: ${amount}`);
      // TODO: cập nhật DB -> paid
    } else {
      console.log(`Đơn hàng ${txnRef} thanh toán thất bại, mã lỗi: ${rspCode}`);
      // TODO: cập nhật DB -> failed
    }

    return res.status(200).json({ RspCode: '00', Message: 'Confirm Success' });
  } catch (err) {
    console.error('VNPay IPN error:', err);
    return res.status(200).json({ RspCode: '99', Message: 'Unknown error' });
  }
});

module.exports = router;
