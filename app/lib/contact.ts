// Kênh liên hệ chính thức của Bé Hay Học — dùng chung cho nút nổi, trang hỗ trợ, khu Toán IQ.

export const CONTACT = {
  zalo: '0966900893',
  zaloDisplay: '0966 900 893',
  facebookPage: 'https://www.facebook.com/profile.php?id=61593302216660',
  /** Messenger của fanpage (m.me/<ID trang>). */
  messenger: 'https://m.me/61593302216660',
  supportPath: '/ho-tro',
  guidePath: '/huong-dan',
  donatePath: '/ung-ho',
};

export const zaloLink = (phone = CONTACT.zalo) => `https://zalo.me/${phone}`;
