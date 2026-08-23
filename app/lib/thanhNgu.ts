// Thành ngữ – tục ngữ Việt Nam cho bé — giải nghĩa dễ hiểu + ví dụ. Nghe câu / nghĩa bằng giọng Việt.

export type ThanhNgu = { cau: string; nghia: string; vd: string };
export type ThanhNguGroup = { slug: string; emoji: string; title: string; items: ThanhNgu[] };

export const THANH_NGU_GROUPS: ThanhNguGroup[] = [
  {
    slug: 'cham-chi', emoji: '📚', title: 'Chăm chỉ – Học hành',
    items: [
      { cau: 'Có công mài sắt, có ngày nên kim', nghia: 'Kiên trì, chăm chỉ làm việc khó thì cuối cùng sẽ thành công.', vd: 'Bé tập viết mỗi ngày, đúng là có công mài sắt có ngày nên kim.' },
      { cau: 'Đi một ngày đàng, học một sàng khôn', nghia: 'Đi nhiều, trải nghiệm nhiều thì học được nhiều điều hay.', vd: 'Được đi tham quan bảo tàng, em học thêm bao điều — đi một ngày đàng, học một sàng khôn.' },
      { cau: 'Kiến tha lâu cũng đầy tổ', nghia: 'Làm việc nhỏ nhưng bền bỉ thì dần dần cũng có kết quả lớn.', vd: 'Mỗi ngày để dành một chút, kiến tha lâu cũng đầy tổ.' },
      { cau: 'Học thầy không tày học bạn', nghia: 'Học từ bạn bè đôi khi cũng bổ ích không kém học từ thầy cô.', vd: 'Bạn chỉ em cách giải nhanh — học thầy không tày học bạn.' },
    ],
  },
  {
    slug: 'doan-ket', emoji: '🤝', title: 'Đoàn kết – Yêu thương',
    items: [
      { cau: 'Lá lành đùm lá rách', nghia: 'Người có điều kiện hơn thì nên giúp đỡ, che chở người khó khăn.', vd: 'Cả lớp góp quà giúp bạn nghèo — lá lành đùm lá rách.' },
      { cau: 'Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao', nghia: 'Đoàn kết nhiều người lại thì làm được việc lớn.', vd: 'Cả tổ cùng làm nên báo tường thật đẹp — ba cây chụm lại nên hòn núi cao.' },
      { cau: 'Anh em như thể tay chân', nghia: 'Anh chị em ruột thịt phải yêu thương, gắn bó, giúp đỡ nhau.', vd: 'Anh nhường em phần bánh — anh em như thể tay chân.' },
      { cau: 'Thương người như thể thương thân', nghia: 'Hãy yêu thương, giúp đỡ người khác như yêu thương chính mình.', vd: 'Thấy cụ già qua đường, em dắt cụ đi — thương người như thể thương thân.' },
    ],
  },
  {
    slug: 'biet-on', emoji: '❤️', title: 'Biết ơn – Đạo đức',
    items: [
      { cau: 'Ăn quả nhớ kẻ trồng cây', nghia: 'Được hưởng thành quả thì phải nhớ ơn người đã làm ra nó.', vd: 'Ăn cơm ngon, nhớ ơn bác nông dân — ăn quả nhớ kẻ trồng cây.' },
      { cau: 'Uống nước nhớ nguồn', nghia: 'Phải biết ơn cội nguồn, ông bà tổ tiên và những người đi trước.', vd: 'Ngày giỗ tổ, cả nhà tưởng nhớ ông bà — uống nước nhớ nguồn.' },
      { cau: 'Tiên học lễ, hậu học văn', nghia: 'Học làm người, học lễ phép trước, rồi mới học kiến thức.', vd: 'Cô dạy phải lễ phép trước tiên — tiên học lễ, hậu học văn.' },
      { cau: 'Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra', nghia: 'Công lao cha mẹ vô cùng to lớn, con cái phải hiếu thảo.', vd: 'Em chăm ngoan để đền đáp cha mẹ — công cha như núi Thái Sơn.' },
    ],
  },
  {
    slug: 'tinh-cach', emoji: '🌟', title: 'Tính cách – Sống đẹp',
    items: [
      { cau: 'Gần mực thì đen, gần đèn thì rạng', nghia: 'Sống gần người tốt sẽ tốt lên, gần người xấu dễ nhiễm thói xấu.', vd: 'Chơi với bạn chăm học, em cũng chăm hơn — gần đèn thì rạng.' },
      { cau: 'Tốt gỗ hơn tốt nước sơn', nghia: 'Phẩm chất, tính tốt bên trong quý hơn vẻ đẹp bề ngoài.', vd: 'Bạn ấy hiền và tốt bụng — tốt gỗ hơn tốt nước sơn.' },
      { cau: 'Đói cho sạch, rách cho thơm', nghia: 'Dù nghèo khó cũng phải giữ phẩm giá, sống trong sạch.', vd: 'Nhặt được của rơi em trả lại — đói cho sạch, rách cho thơm.' },
      { cau: 'Ăn ngay nói thật, mọi tật mọi lành', nghia: 'Sống trung thực, thật thà thì mọi việc đều tốt đẹp.', vd: 'Em nhận lỗi thành thật nên được cô khen — ăn ngay nói thật, mọi tật mọi lành.' },
    ],
  },
];

export const totalThanhNgu = () => THANH_NGU_GROUPS.reduce((n, g) => n + g.items.length, 0);
