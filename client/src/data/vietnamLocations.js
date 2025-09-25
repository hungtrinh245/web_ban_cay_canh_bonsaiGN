// Dữ liệu đầy đủ 63 tỉnh/thành phố Việt Nam (2024)
// Với các quận/huyện và xã/phường tiêu biểu

const vietnamLocations = [
  {
    value: 'an_giang',
    label: 'An Giang',
    children: [
      {
        value: 'long_xuyen',
        label: 'Thành phố Long Xuyên',
        children: [
          { value: 'my_binh', label: 'Phường Mỹ Bình' },
          { value: 'my_long', label: 'Phường Mỹ Long' },
          { value: 'my_xuyen', label: 'Phường Mỹ Xuyên' },
          { value: 'binh_duc', label: 'Phường Bình Đức' },
          { value: 'binh_khanh', label: 'Phường Bình Khánh' }
        ]
      },
      {
        value: 'chau_doc',
        label: 'Thành phố Châu Đốc',
        children: [
          { value: 'chau_phu_b', label: 'Phường Châu Phú B' },
          { value: 'nuc_tuong', label: 'Phường Núc Tượng' },
          { value: 'vinh_my', label: 'Phường Vĩnh Mỹ' },
          { value: 'chau_phu_a', label: 'Phường Châu Phú A' }
        ]
      }
    ]
  },
  {
    value: 'ba_ria_vung_tau',
    label: 'Bà Rịa - Vũng Tàu',
    children: [
      {
        value: 'vung_tau',
        label: 'Thành phố Vũng Tàu',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'thang_tam', label: 'Phường Thắng Tam' }
        ]
      },
      {
        value: 'ba_ria',
        label: 'Thành phố Bà Rịa',
        children: [
          { value: 'phuoc_hiep', label: 'Phường Phước Hiệp' },
          { value: 'phuoc_nguyen', label: 'Phường Phước Nguyên' },
          { value: 'phuoc_trung', label: 'Phường Phước Trung' },
          { value: 'kim_dinh', label: 'Phường Kim Dinh' }
        ]
      }
    ]
  },
  {
    value: 'bac_giang',
    label: 'Bắc Giang',
    children: [
      {
        value: 'bac_giang_city',
        label: 'Thành phố Bắc Giang',
        children: [
          { value: 'le_loi', label: 'Phường Lê Lợi' },
          { value: 'song_mai', label: 'Phường Sông Mai' },
          { value: 'tran_nguyen_han', label: 'Phường Trần Nguyên Hãn' },
          { value: 'duc_giang', label: 'Phường Đức Giang' }
        ]
      },
      {
        value: 'yen_the',
        label: 'Huyện Yên Thế',
        children: [
          { value: 'bo_ha', label: 'Thị trấn Bố Hạ' },
          { value: 'cam_dan', label: 'Xã Cẩm Đàn' },
          { value: 'luc_nam', label: 'Xã Lục Nam' }
        ]
      }
    ]
  },
  {
    value: 'bac_kan',
    label: 'Bắc Kạn',
    children: [
      {
        value: 'bac_kan_city',
        label: 'Thành phố Bắc Kạn',
        children: [
          { value: 'duc_xuan', label: 'Phường Đức Xuân' },
          { value: 'pham_ngu_lao', label: 'Phường Phạm Ngũ Lão' },
          { value: 'song_cau', label: 'Phường Sông Cầu' }
        ]
      }
    ]
  },
  {
    value: 'bac_lieu',
    label: 'Bạc Liêu',
    children: [
      {
        value: 'bac_lieu_city',
        label: 'Thành phố Bạc Liêu',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_5', label: 'Phường 5' }
        ]
      }
    ]
  },
  {
    value: 'bac_ninh',
    label: 'Bắc Ninh',
    children: [
      {
        value: 'bac_ninh_city',
        label: 'Thành phố Bắc Ninh',
        children: [
          { value: 'tien_an', label: 'Phường Tiền An' },
          { value: 'dong_nguyen', label: 'Phường Đông Nguyên' },
          { value: 'khuc_xuyen', label: 'Phường Khúc Xuyên' },
          { value: 'suong_nguyet', label: 'Phường Sương Nguyệt' }
        ]
      }
    ]
  },
  {
    value: 'ben_tre',
    label: 'Bến Tre',
    children: [
      {
        value: 'ben_tre_city',
        label: 'Thành phố Bến Tre',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'phu_tan', label: 'Phường Phú Tân' }
        ]
      }
    ]
  },
  {
    value: 'binh_dinh',
    label: 'Bình Định',
    children: [
      {
        value: 'quy_nhon',
        label: 'Thành phố Quy Nhon',
        children: [
          { value: 'le_hong_phong', label: 'Phường Lê Hồng Phong' },
          { value: 'le_loi', label: 'Phường Lê Lợi' },
          { value: 'tran_hung_dao', label: 'Phường Trần Hưng Đạo' },
          { value: 'tran_phu', label: 'Phường Trần Phú' }
        ]
      }
    ]
  },
  {
    value: 'binh_duong',
    label: 'Bình Dương',
    children: [
      {
        value: 'thu_dau_mot',
        label: 'Thành phố Thủ Dầu Một',
        children: [
          { value: 'chanh_nghia', label: 'Phường Chánh Nghĩa' },
          { value: 'dinh_hoa', label: 'Phường Định Hòa' },
          { value: 'hien_thanh', label: 'Phường Hiệp Thành' },
          { value: 'phu_cuong', label: 'Phường Phú Cường' }
        ]
      }
    ]
  },
  {
    value: 'binh_phuoc',
    label: 'Bình Phước',
    children: [
      {
        value: 'dong_xoai',
        label: 'Thành phố Đồng Xoài',
        children: [
          { value: 'tan_binh', label: 'Phường Tân Bình' },
          { value: 'tan_dong', label: 'Phường Tân Đông' },
          { value: 'tan_phu', label: 'Phường Tân Phú' },
          { value: 'tan_thanh', label: 'Phường Tân Thành' }
        ]
      }
    ]
  },
  {
    value: 'binh_thuan',
    label: 'Bình Thuận',
    children: [
      {
        value: 'phan_thiet',
        label: 'Thành phố Phan Thiết',
        children: [
          { value: 'binh_hung', label: 'Phường Bình Hưng' },
          { value: 'duc_long', label: 'Phường Đức Long' },
          { value: 'duc_nghia', label: 'Phường Đức Nghĩa' },
          { value: 'ham_tien', label: 'Phường Hàm Tiến' }
        ]
      }
    ]
  },
  {
    value: 'ca_mau',
    label: 'Cà Mau',
    children: [
      {
        value: 'ca_mau_city',
        label: 'Thành phố Cà Mau',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' }
        ]
      }
    ]
  },
  {
    value: 'can_tho',
    label: 'Cần Thơ',
    children: [
      {
        value: 'ninh_kieu',
        label: 'Quận Ninh Kiều',
        children: [
          { value: 'cai_khe', label: 'Phường Cái Khế' },
          { value: 'tan_an', label: 'Phường Tân An' },
          { value: 'an_cu', label: 'Phường An Cư' },
          { value: 'an_hoa', label: 'Phường An Hòa' }
        ]
      },
      {
        value: 'binh_thuy',
        label: 'Quận Bình Thủy',
        children: [
          { value: 'binh_thuy', label: 'Phường Bình Thủy' },
          { value: 'tra_an', label: 'Phường Trà An' },
          { value: 'tra_noc', label: 'Phường Trà Nóc' },
          { value: 'an_thoi', label: 'Phường An Thới' }
        ]
      }
    ]
  },
  {
    value: 'cao_bang',
    label: 'Cao Bằng',
    children: [
      {
        value: 'cao_bang_city',
        label: 'Thành phố Cao Bằng',
        children: [
          { value: 'song_ban', label: 'Phường Sông Bằng' },
          { value: 'song_hien', label: 'Phường Sông Hiến' },
          { value: 'de_tham', label: 'Phường Đề Thám' },
          { value: 'hop_giang', label: 'Phường Hợp Giang' }
        ]
      }
    ]
  },
  {
    value: 'da_nang',
    label: 'Đà Nẵng',
    children: [
      {
        value: 'hai_chau',
        label: 'Quận Hải Châu',
        children: [
          { value: 'thach_thang', label: 'Phường Thạch Thang' },
          { value: 'phuoc_ninh', label: 'Phường Phước Ninh' },
          { value: 'hai_chau_1', label: 'Phường Hải Châu I' },
          { value: 'hai_chau_2', label: 'Phường Hải Châu II' }
        ]
      },
      {
        value: 'thanh_khe',
        label: 'Quận Thanh Khê',
        children: [
          { value: 'tam_thuan', label: 'Phường Tam Thuận' },
          { value: 'thanh_khe_tay', label: 'Phường Thanh Khê Tây' },
          { value: 'thanh_khe_dong', label: 'Phường Thanh Khê Đông' },
          { value: 'xuan_ha', label: 'Phường Xuân Hà' }
        ]
      },
      {
        value: 'son_tra',
        label: 'Quận Sơn Trà',
        children: [
          { value: 'tho_quang', label: 'Phường Thọ Quang' },
          { value: 'man_thai', label: 'Phường Mân Thái' },
          { value: 'an_hai_bac', label: 'Phường An Hải Bắc' },
          { value: 'phuoc_my', label: 'Phường Phước Mỹ' }
        ]
      }
    ]
  },
  {
    value: 'dak_lak',
    label: 'Đắk Lắk',
    children: [
      {
        value: 'buon_ma_thuot',
        label: 'Thành phố Buôn Ma Thuột',
        children: [
          { value: 'thong_nhat', label: 'Phường Thống Nhất' },
          { value: 'thang_loi', label: 'Phường Thắng Lợi' },
          { value: 'ea_tam', label: 'Phường Ea Tam' },
          { value: 'khanh_xuan', label: 'Phường Khánh Xuân' }
        ]
      }
    ]
  },
  {
    value: 'dien_bien',
    label: 'Điện Biên',
    children: [
      {
        value: 'dien_bien_phu',
        label: 'Thành phố Điện Biên Phủ',
        children: [
          { value: 'noong_bua', label: 'Phường Noong Bua' },
          { value: 'him_lam', label: 'Phường Him Lam' },
          { value: 'tan_thanh', label: 'Phường Tân Thanh' },
          { value: 'muong_thanh', label: 'Phường Mường Thanh' }
        ]
      }
    ]
  },
  {
    value: 'dong_nai',
    label: 'Đồng Nai',
    children: [
      {
        value: 'bien_hoa',
        label: 'Thành phố Biên Hòa',
        children: [
          { value: 'an_binh', label: 'Phường An Bình' },
          { value: 'an_hoa', label: 'Phường An Hòa' },
          { value: 'binh_da', label: 'Phường Bình Đa' },
          { value: 'buu_hoa', label: 'Phường Bửu Hòa' }
        ]
      }
    ]
  },
  {
    value: 'dong_thap',
    label: 'Đồng Tháp',
    children: [
      {
        value: 'cao_lanh',
        label: 'Thành phố Cao Lãnh',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' }
        ]
      }
    ]
  },
  {
    value: 'gia_lai',
    label: 'Gia Lai',
    children: [
      {
        value: 'pleiku',
        label: 'Thành phố Pleiku',
        children: [
          { value: 'dinh_tien_hoang', label: 'Phường Đinh Tiên Hoàng' },
          { value: 'hoa_lu', label: 'Phường Hoa Lư' },
          { value: 'le_loi', label: 'Phường Lê Lợi' },
          { value: 'phu_dong', label: 'Phường Phù Đổng' }
        ]
      }
    ]
  },
  {
    value: 'ha_giang',
    label: 'Hà Giang',
    children: [
      {
        value: 'ha_giang_city',
        label: 'Thành phố Hà Giang',
        children: [
          { value: 'nguyen_trai', label: 'Phường Nguyễn Trãi' },
          { value: 'tran_phu', label: 'Phường Trần Phú' },
          { value: 'nguyen_du', label: 'Phường Nguyễn Du' },
          { value: 'minh_khai', label: 'Phường Minh Khai' }
        ]
      }
    ]
  },
  {
    value: 'ha_nam',
    label: 'Hà Nam',
    children: [
      {
        value: 'phu_ly',
        label: 'Thành phố Phủ Lý',
        children: [
          { value: 'le_loi', label: 'Phường Lê Lợi' },
          { value: 'minh_khai', label: 'Phường Minh Khai' },
          { value: 'tien_tien', label: 'Phường Tiền Tiến' },
          { value: 'tri_phong', label: 'Phường Trì Phong' }
        ]
      }
    ]
  },
  {
    value: 'hanoi',
    label: 'Hà Nội',
    children: [
      {
        value: 'ba_dinh',
        label: 'Quận Ba Đình',
        children: [
          { value: 'phuc_xa', label: 'Phường Phúc Xá' },
          { value: 'truc_bach', label: 'Phường Trúc Bạch' },
          { value: 'vong_thi', label: 'Phường Vọng Thị' },
          { value: 'cong_vi', label: 'Phường Cống Vị' },
          { value: 'lieu_giai', label: 'Phường Liễu Giai' },
          { value: 'kim_ma', label: 'Phường Kim Mã' },
          { value: 'giang_vo', label: 'Phường Giảng Võ' },
          { value: 'dien_bien', label: 'Phường Điện Biên' }
        ]
      },
      {
        value: 'hoan_kiem',
        label: 'Quận Hoàn Kiếm',
        children: [
          { value: 'phan_chu_trinh', label: 'Phường Phan Chu Trinh' },
          { value: 'hang_bac', label: 'Phường Hàng Bạc' },
          { value: 'hang_bai', label: 'Phường Hàng Bài' },
          { value: 'hang_dao', label: 'Phường Hàng Đào' },
          { value: 'dong_xuan', label: 'Phường Đồng Xuân' },
          { value: 'ly_thai_to', label: 'Phường Lý Thái Tổ' },
          { value: 'tran_hung_dao', label: 'Phường Trần Hưng Đạo' },
          { value: 'trang_tien', label: 'Phường Tràng Tiền' }
        ]
      },
      {
        value: 'dong_da',
        label: 'Quận Đống Đa',
        children: [
          { value: 'cat_linh', label: 'Phường Cát Linh' },
          { value: 'van_mieu', label: 'Phường Văn Miếu' },
          { value: 'quoc_tu_giam', label: 'Phường Quốc Tử Giám' },
          { value: 'lang_thuong', label: 'Phường Láng Thượng' },
          { value: 'o_cho_dua', label: 'Phường Ô Chợ Dừa' },
          { value: 'lang_ha', label: 'Phường Láng Hạ' },
          { value: 'kham_thien', label: 'Phường Khâm Thiên' },
          { value: 'tho_quan', label: 'Phường Thổ Quan' }
        ]
      },
      {
        value: 'hai_ba_trung',
        label: 'Quận Hai Bà Trưng',
        children: [
          { value: 'nguyen_du', label: 'Phường Nguyễn Du' },
          { value: 'bach_dang', label: 'Phường Bạch Đằng' },
          { value: 'le_dai_hanh', label: 'Phường Lê Đại Hành' },
          { value: 'dong_nhan', label: 'Phường Đồng Nhân' },
          { value: 'pho_hue', label: 'Phường Phố Huế' },
          { value: 'minh_khai', label: 'Phường Minh Khai' },
          { value: 'vinh_tuy', label: 'Phường Vĩnh Tuy' },
          { value: 'bach_khoa', label: 'Phường Bách Khoa' }
        ]
      },
      {
        value: 'cau_giay',
        label: 'Quận Cầu Giấy',
        children: [
          { value: 'nghia_do', label: 'Phường Nghĩa Đô' },
          { value: 'nghia_tan', label: 'Phường Nghĩa Tân' },
          { value: 'mai_dich', label: 'Phường Mai Dịch' },
          { value: 'dich_vong', label: 'Phường Dịch Vọng' },
          { value: 'quan_hoa', label: 'Phường Quan Hoa' },
          { value: 'yen_hoa', label: 'Phường Yên Hòa' },
          { value: 'trung_hoa', label: 'Phường Trung Hòa' }
        ]
      }
    ]
  },
  {
    value: 'hai_duong',
    label: 'Hải Dương',
    children: [
      {
        value: 'hai_duong_city',
        label: 'Thành phố Hải Dương',
        children: [
          { value: 'le_thanh_nghi', label: 'Phường Lê Thanh Nghị' },
          { value: 'nguyen_duc_canh', label: 'Phường Nguyễn Đức Cảnh' },
          { value: 'phan_boi_chau', label: 'Phường Phan Bội Châu' },
          { value: 'quang_trung', label: 'Phường Quang Trung' }
        ]
      }
    ]
  },
  {
    value: 'hai_phong',
    label: 'Hải Phòng',
    children: [
      {
        value: 'hong_bang',
        label: 'Quận Hồng Bàng',
        children: [
          { value: 'so_dau', label: 'Phường Sở Dầu' },
          { value: 'phan_boi_chau', label: 'Phường Phan Bội Châu' },
          { value: 'hoang_van_thu', label: 'Phường Hoàng Văn Thụ' },
          { value: 'minh_khai', label: 'Phường Minh Khai' }
        ]
      },
      {
        value: 'ngo_quyen',
        label: 'Quận Ngô Quyền',
        children: [
          { value: 'may_to', label: 'Phường Máy Tơ' },
          { value: 'may_chai', label: 'Phường Máy Chai' },
          { value: 'dong_khe', label: 'Phường Đông Khê' },
          { value: 'cau_tre', label: 'Phường Cầu Tre' }
        ]
      }
    ]
  },
  {
    value: 'ho_chi_minh',
    label: 'Thành phố Hồ Chí Minh',
    children: [
      {
        value: 'quan_1',
        label: 'Quận 1',
        children: [
          { value: 'tan_dinh', label: 'Phường Tân Định' },
          { value: 'da_kao', label: 'Phường Đa Kao' },
          { value: 'ben_nghe', label: 'Phường Bến Nghé' },
          { value: 'ben_thanh', label: 'Phường Bến Thành' },
          { value: 'nguyen_thai_binh', label: 'Phường Nguyễn Thái Bình' },
          { value: 'pham_ngu_lao', label: 'Phường Phạm Ngũ Lão' },
          { value: 'cau_ong_lanh', label: 'Phường Cầu Ông Lãnh' },
          { value: 'co_giang', label: 'Phường Cô Giang' }
        ]
      },
      {
        value: 'quan_3',
        label: 'Quận 3',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'ward_6', label: 'Phường 6' },
          { value: 'ward_9', label: 'Phường 9' },
          { value: 'ward_10', label: 'Phường 10' }
        ]
      },
      {
        value: 'quan_7',
        label: 'Quận 7',
        children: [
          { value: 'tan_thuan_dong', label: 'Phường Tân Thuận Đông' },
          { value: 'tan_thuan_tay', label: 'Phường Tân Thuận Tây' },
          { value: 'tan_kien', label: 'Phường Tân Kiểng' },
          { value: 'tan_huan', label: 'Phường Tân Hưng' },
          { value: 'binh_thuan', label: 'Phường Bình Thuận' },
          { value: 'tan_quy', label: 'Phường Tân Quy' },
          { value: 'phu_thuan', label: 'Phường Phú Thuận' },
          { value: 'phu_my', label: 'Phường Phú Mỹ' }
        ]
      },
      {
        value: 'thu_duc',
        label: 'Thành phố Thủ Đức',
        children: [
          { value: 'linh_dong', label: 'Phường Linh Đông' },
          { value: 'binh_tho', label: 'Phường Bình Thọ' },
          { value: 'linh_tay', label: 'Phường Linh Tay' },
          { value: 'tam_binh', label: 'Phường Tam Bình' },
          { value: 'tam_phu', label: 'Phường Tam Phú' },
          { value: 'linh_chieu', label: 'Phường Linh Chiểu' },
          { value: 'linh_trung', label: 'Phường Linh Trung' },
          { value: 'truong_tho', label: 'Phường Trường Thọ' }
        ]
      }
    ]
  },
  {
    value: 'ha_tinh',
    label: 'Hà Tĩnh',
    children: [
      {
        value: 'ha_tinh_city',
        label: 'Thành phố Hà Tĩnh',
        children: [
          { value: 'tran_phu', label: 'Phường Trần Phú' },
          { value: 'nam_ha', label: 'Phường Nam Hà' },
          { value: 'bac_ha', label: 'Phường Bắc Hà' },
          { value: 'tay_ha', label: 'Phường Tây Hà' }
        ]
      }
    ]
  },
  {
    value: 'hau_giang',
    label: 'Hậu Giang',
    children: [
      {
        value: 'vi_thanh',
        label: 'Thành phố Vị Thanh',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_5', label: 'Phường 5' }
        ]
      }
    ]
  },
  {
    value: 'hoa_binh',
    label: 'Hòa Bình',
    children: [
      {
        value: 'hoa_binh_city',
        label: 'Thành phố Hòa Bình',
        children: [
          { value: 'phuong_lam', label: 'Phường Phương Lâm' },
          { value: 'thong_nhat', label: 'Phường Thống Nhất' },
          { value: 'tan_thinh', label: 'Phường Tân Thịnh' },
          { value: 'hoa_binh_ward', label: 'Phường Hòa Bình' }
        ]
      }
    ]
  },
  {
    value: 'hung_yen',
    label: 'Hưng Yên',
    children: [
      {
        value: 'hung_yen_city',
        label: 'Thành phố Hưng Yên',
        children: [
          { value: 'le_loi', label: 'Phường Lê Lợi' },
          { value: 'an_tao', label: 'Phường An Tảo' },
          { value: 'hien_nam', label: 'Phường Hiến Nam' },
          { value: 'lam_son', label: 'Phường Lam Sơn' }
        ]
      }
    ]
  },
  {
    value: 'khanh_hoa',
    label: 'Khánh Hòa',
    children: [
      {
        value: 'nha_trang',
        label: 'Thành phố Nha Trang',
        children: [
          { value: 'vinh_hai', label: 'Phường Vĩnh Hải' },
          { value: 'vinh_phuoc', label: 'Phường Vĩnh Phước' },
          { value: 'loc_tho', label: 'Phường Lộc Thọ' },
          { value: 'tan_lap', label: 'Phường Tân Lập' },
          { value: 'phuoc_hai', label: 'Phường Phước Hải' },
          { value: 'phuoc_tan', label: 'Phường Phước Tân' },
          { value: 'van_thanh', label: 'Phường Vạn Thạnh' },
          { value: 'van_thang', label: 'Phường Vạn Thắng' }
        ]
      },
      {
        value: 'cam_ranh',
        label: 'Thành phố Cam Ranh',
        children: [
          { value: 'cam_hai_dong', label: 'Phường Cam Hải Đông' },
          { value: 'cam_hai_tay', label: 'Phường Cam Hải Tây' },
          { value: 'cam_nghia', label: 'Phường Cam Nghĩa' },
          { value: 'cam_phuc_bac', label: 'Phường Cam Phúc Bắc' }
        ]
      }
    ]
  },
  {
    value: 'kien_giang',
    label: 'Kiên Giang',
    children: [
      {
        value: 'rach_gia',
        label: 'Thành phố Rạch Giá',
        children: [
          { value: 'vinh_thanh_van', label: 'Phường Vĩnh Thanh Vân' },
          { value: 'vinh_lac', label: 'Phường Vĩnh Lạc' },
          { value: 'vinh_bao', label: 'Phường Vĩnh Bảo' },
          { value: 'an_binh', label: 'Phường An Bình' },
          { value: 'an_hoa', label: 'Phường An Hòa' },
          { value: 'rach_soi', label: 'Phường Rạch Sỏi' }
        ]
      },
      {
        value: 'ha_tien',
        label: 'Thành phố Hà Tiên',
        children: [
          { value: 'to_chau', label: 'Phường Tô Châu' },
          { value: 'dong_ho', label: 'Phường Đông Hồ' },
          { value: 'tay_ho', label: 'Phường Tây Hồ' },
          { value: 'my_duc', label: 'Phường Mỹ Đức' }
        ]
      },
      {
        value: 'phu_quoc',
        label: 'Thành phố Phú Quốc',
        children: [
          { value: 'duong_dong', label: 'Phường Dương Đông' },
          { value: 'an_thoi', label: 'Phường An Thới' },
          { value: 'cua_can', label: 'Xã Cửa Cạn' },
          { value: 'ganh_dau', label: 'Xã Gành Dầu' }
        ]
      }
    ]
  },
  {
    value: 'kon_tum',
    label: 'Kon Tum',
    children: [
      {
        value: 'kon_tum_city',
        label: 'Thành phố Kon Tum',
        children: [
          { value: 'quang_trung', label: 'Phường Quang Trung' },
          { value: 'ba_dinh', label: 'Phường Ba Đình' },
          { value: 'duy_tan', label: 'Phường Duy Tân' },
          { value: 'thong_nhat', label: 'Phường Thống Nhất' }
        ]
      }
    ]
  },
  {
    value: 'lai_chau',
    label: 'Lai Châu',
    children: [
      {
        value: 'lai_chau_city',
        label: 'Thành phố Lai Châu',
        children: [
          { value: 'dong_phong', label: 'Phường Đông Phong' },
          { value: 'tan_phong', label: 'Phường Tân Phong' },
          { value: 'quynh_hoa', label: 'Phường Quyết Thắng' },
          { value: 'san_xay', label: 'Phường Sân Xây' }
        ]
      }
    ]
  },
  {
    value: 'lang_son',
    label: 'Lạng Sơn',
    children: [
      {
        value: 'lang_son_city',
        label: 'Thành phố Lạng Sơn',
        children: [
          { value: 'ky_lua', label: 'Phường Kỳ Lừa' },
          { value: 'tam_thanh', label: 'Phường Tam Thanh' },
          { value: 'chi_lang', label: 'Phường Chi Lăng' },
          { value: 'hoang_van_thu', label: 'Phường Hoàng Văn Thụ' }
        ]
      }
    ]
  },
  {
    value: 'lao_cai',
    label: 'Lào Cai',
    children: [
      {
        value: 'lao_cai_city',
        label: 'Thành phố Lào Cai',
        children: [
          { value: 'dong_xuyen', label: 'Phường Duyên Hải' },
          { value: 'kim_tan', label: 'Phường Kim Tân' },
          { value: 'lao_cai_ward', label: 'Phường Lào Cai' },
          { value: 'pho_moi', label: 'Phường Phố Mới' }
        ]
      },
      {
        value: 'sa_pa',
        label: 'Thị xã Sa Pa',
        children: [
          { value: 'sa_pa_ward', label: 'Phường Sa Pa' },
          { value: 'ham_rong', label: 'Phường Hàm Rồng' },
          { value: 'o_quy_ho', label: 'Phường Ô Quý Hồ' },
          { value: 'phan_si_pang', label: 'Xã Phan Si Păng' }
        ]
      }
    ]
  },
  {
    value: 'long_an',
    label: 'Long An',
    children: [
      {
        value: 'tan_an',
        label: 'Thành phố Tân An',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'khanh_hau', label: 'Phường Khánh Hậu' }
        ]
      }
    ]
  },
  {
    value: 'nam_dinh',
    label: 'Nam Định',
    children: [
      {
        value: 'nam_dinh_city',
        label: 'Thành phố Nam Định',
        children: [
          { value: 'phuong_1', label: 'Phường Trường Thi' },
          { value: 'phuong_2', label: 'Phường Phan Đình Phùng' },
          { value: 'phuong_3', label: 'Phường Nguyễn Du' },
          { value: 'phuong_4', label: 'Phường Bà Triệu' },
          { value: 'phuong_5', label: 'Phường Tran Hưng Đạo' },
          { value: 'phuong_6', label: 'Phường Lộc Vượng' }
        ]
      }
    ]
  },
  {
    value: 'nghe_an',
    label: 'Nghệ An',
    children: [
      {
        value: 'vinh',
        label: 'Thành phố Vinh',
        children: [
          { value: 'le_loi', label: 'Phường Lê Lợi' },
          { value: 'quang_trung', label: 'Phường Quang Trung' },
          { value: 'dong_vinh', label: 'Phường Đông Vĩnh' },
          { value: 'ha_huy_tap', label: 'Phường Hà Huy Tập' },
          { value: 'ben_thuy', label: 'Phường Bến Thủy' },
          { value: 'vinh_tan', label: 'Phường Vinh Tân' },
          { value: 'cua_nam', label: 'Phường Cửa Nam' },
          { value: 'hung_dung', label: 'Phường Hưng Dũng' }
        ]
      },
      {
        value: 'cua_lo',
        label: 'Thị xã Cửa Lò',
        children: [
          { value: 'cua_lo_ward', label: 'Phường Cửa Lò' },
          { value: 'ngh_hai', label: 'Phường Nghi Hải' },
          { value: 'ngh_hun', label: 'Phường Nghi Hưng' },
          { value: 'ngh_thuy', label: 'Phường Nghi Thủy' }
        ]
      }
    ]
  },
  {
    value: 'ninh_binh',
    label: 'Ninh Bình',
    children: [
      {
        value: 'ninh_binh_city',
        label: 'Thành phố Ninh Bình',
        children: [
          { value: 'dong_thanh', label: 'Phường Đông Thành' },
          { value: 'tay_thanh', label: 'Phường Tây Thành' },
          { value: 'thanh_binh', label: 'Phường Thanh Bình' },
          { value: 'van_giang', label: 'Phường Vân Giang' },
          { value: 'bac_mon', label: 'Phường Bắc Môn' },
          { value: 'nam_mon', label: 'Phường Nam Môn' }
        ]
      },
      {
        value: 'tam_diep',
        label: 'Thành phố Tam Điệp',
        children: [
          { value: 'nam_thanh', label: 'Phường Nam Thành' },
          { value: 'bac_thanh', label: 'Phường Bắc Thành' },
          { value: 'dong_thanh', label: 'Phường Đông Thành' },
          { value: 'tay_thanh', label: 'Phường Tây Thành' }
        ]
      }
    ]
  },
  {
    value: 'ninh_thuan',
    label: 'Ninh Thuận',
    children: [
      {
        value: 'phan_rang_thap_cham',
        label: 'Thành phố Phan Rang-Tháp Chàm',
        children: [
          { value: 'ba_ngoi', label: 'Phường Bà Ngọi' },
          { value: 'duc_long', label: 'Phường Đức Long' },
          { value: 'my_hai', label: 'Phường Mỹ Hải' },
          { value: 'my_hiep', label: 'Phường Mỹ Hiệp' },
          { value: 'my_hoa', label: 'Phường Mỹ Hòa' },
          { value: 'phuoc_my', label: 'Phường Phước Mỹ' },
          { value: 'thanh_son', label: 'Phường Thanh Sơn' },
          { value: 'thap_cham', label: 'Phường Tháp Chàm' }
        ]
      }
    ]
  },
  {
    value: 'phu_tho',
    label: 'Phú Thọ',
    children: [
      {
        value: 'viet_tri',
        label: 'Thành phố Việt Trì',
        children: [
          { value: 'dich_vong', label: 'Phường Dịch Vọng' },
          { value: 'nong_trang', label: 'Phường Nông Trang' },
          { value: 'gia_cam', label: 'Phường Gia Cẩm' },
          { value: 'tien_cat', label: 'Phường Tiên Cát' },
          { value: 'thong_nhat', label: 'Phường Thống Nhất' },
          { value: 'ben_got', label: 'Phường Bến Gót' },
          { value: 'van_phu', label: 'Phường Vân Phú' },
          { value: 'van_co', label: 'Phường Vân Cơ' }
        ]
      },
      {
        value: 'phu_tho_city',
        label: 'Thành phố Phú Thọ',
        children: [
          { value: 'hung_vuong', label: 'Phường Hùng Vương' },
          { value: 'thanh_minh', label: 'Phường Thanh Minh' },
          { value: 'van_lang', label: 'Phường Văn Lang' },
          { value: 'gia_cam', label: 'Phường Gia Cẩm' }
        ]
      }
    ]
  },
  {
    value: 'phu_yen',
    label: 'Phú Yên',
    children: [
      {
        value: 'tuy_hoa',
        label: 'Thành phố Tuy Hòa',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'ward_6', label: 'Phường 6' },
          { value: 'ward_7', label: 'Phường 7' },
          { value: 'ward_8', label: 'Phường 8' },
          { value: 'ward_9', label: 'Phường 9' }
        ]
      },
      {
        value: 'song_cau',
        label: 'Thị xã Sông Cầu',
        children: [
          { value: 'song_cau_ward', label: 'Phường Sông Cầu' },
          { value: 'xuan_binh', label: 'Phường Xuân Bình' },
          { value: 'xuan_hai', label: 'Phường Xuân Hải' },
          { value: 'xuan_thanh', label: 'Phường Xuân Thành' }
        ]
      }
    ]
  },
  {
    value: 'quang_binh',
    label: 'Quảng Bình',
    children: [
      {
        value: 'dong_hoi',
        label: 'Thành phố Đồng Hới',
        children: [
          { value: 'bac_ly', label: 'Phường Bắc Lý' },
          { value: 'nam_ly', label: 'Phường Nam Lý' },
          { value: 'dong_phu', label: 'Phường Đồng Phú' },
          { value: 'dong_hai', label: 'Phường Đồng Hải' },
          { value: 'dong_son', label: 'Phường Đồng Sơn' },
          { value: 'hoa_hoi', label: 'Phường Hóa Hợi' }
        ]
      },
      {
        value: 'ba_don',
        label: 'Thị xã Ba Đồn',
        children: [
          { value: 'ba_don_ward', label: 'Phường Ba Đồn' },
          { value: 'quang_thuan', label: 'Phường Quảng Thuận' },
          { value: 'quang_long', label: 'Phường Quảng Long' },
          { value: 'quang_phong', label: 'Phường Quảng Phong' }
        ]
      }
    ]
  },
  {
    value: 'quang_nam',
    label: 'Quảng Nam',
    children: [
      {
        value: 'tam_ky',
        label: 'Thành phố Tam Kỳ',
        children: [
          { value: 'tan_thinh', label: 'Phường Tân Thịnh' },
          { value: 'an_my', label: 'Phường An Mỹ' },
          { value: 'an_phu', label: 'Phường An Phú' },
          { value: 'an_xuan', label: 'Phường An Xuân' },
          { value: 'an_son', label: 'Phường An Sơn' },
          { value: 'phuoc_hoa', label: 'Phường Phước Hòa' }
        ]
      },
      {
        value: 'hoi_an',
        label: 'Thành phố Hội An',
        children: [
          { value: 'minh_an', label: 'Phường Minh An' },
          { value: 'tran_phu', label: 'Phường Trần Phú' },
          { value: 'son_phong', label: 'Phường Sơn Phong' },
          { value: 'cam_chau', label: 'Phường Cẩm Châu' },
          { value: 'cam_nam', label: 'Phường Cẩm Nam' },
          { value: 'thanh_ha', label: 'Phường Thanh Hà' }
        ]
      }
    ]
  },
  {
    value: 'quang_ngai',
    label: 'Quảng Ngãi',
    children: [
      {
        value: 'quang_ngai_city',
        label: 'Thành phố Quảng Ngãi',
        children: [
          { value: 'le_hong_phong', label: 'Phường Lê Hồng Phong' },
          { value: 'tran_hung_dao', label: 'Phường Trần Hưng Đạo' },
          { value: 'cham_khe', label: 'Phường Chấm Khê' },
          { value: 'nghia_chanh', label: 'Phường Nghĩa Chánh' },
          { value: 'nghia_ly', label: 'Phường Nghĩa Lộ' },
          { value: 'quang_phu', label: 'Phường Quảng Phú' }
        ]
      }
    ]
  },
  {
    value: 'quang_ninh',
    label: 'Quảng Ninh',
    children: [
      {
        value: 'ha_long',
        label: 'Thành phố Hạ Long',
        children: [
          { value: 'bach_dang', label: 'Phường Bạch Đằng' },
          { value: 'cao_thang', label: 'Phường Cao Thắng' },
          { value: 'cao_xanh', label: 'Phường Cao Xanh' },
          { value: 'giai_oanh', label: 'Phường Giếng Đáy' },
          { value: 'ha_khanh', label: 'Phường Hà Khanh' },
          { value: 'ha_lam', label: 'Phường Hà Lầm' },
          { value: 'ha_phong', label: 'Phường Hà Phong' },
          { value: 'ha_tu', label: 'Phường Hà Tư' }
        ]
      },
      {
        value: 'cam_pha',
        label: 'Thành phố Cẩm Phả',
        children: [
          { value: 'cam_binh', label: 'Phường Cẩm Bình' },
          { value: 'cam_dong', label: 'Phường Cẩm Đông' },
          { value: 'cam_hai', label: 'Phường Cẩm Hải' },
          { value: 'cam_hung', label: 'Phường Cẩm Hưng' },
          { value: 'cam_son', label: 'Phường Cẩm Sơn' },
          { value: 'cam_tay', label: 'Phường Cẩm Tây' }
        ]
      },
      {
        value: 'mong_cai',
        label: 'Thành phố Móng Cái',
        children: [
          { value: 'ka_long', label: 'Phường Ka Long' },
          { value: 'ninh_duong', label: 'Phường Ninh Dương' },
          { value: 'tran_phu', label: 'Phường Trần Phú' },
          { value: 'hai_yen', label: 'Phường Hải Yên' }
        ]
      }
    ]
  },
  {
    value: 'quang_tri',
    label: 'Quảng Trị',
    children: [
      {
        value: 'dong_ha',
        label: 'Thành phố Đông Hà',
        children: [
          { value: 'dong_giang', label: 'Phường Đông Giang' },
          { value: 'dong_le', label: 'Phường Đông Lễ' },
          { value: 'dong_luong', label: 'Phường Đông Lương' },
          { value: '1', label: 'Phường 1' },
          { value: '2', label: 'Phường 2' },
          { value: '3', label: 'Phường 3' },
          { value: '4', label: 'Phường 4' },
          { value: '5', label: 'Phường 5' }
        ]
      }
    ]
  },
  {
    value: 'soc_trang',
    label: 'Sóc Trăng',
    children: [
      {
        value: 'soc_trang_city',
        label: 'Thành phố Sóc Trăng',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'ward_6', label: 'Phường 6' },
          { value: 'ward_7', label: 'Phường 7' },
          { value: 'ward_8', label: 'Phường 8' }
        ]
      }
    ]
  },
  {
    value: 'son_la',
    label: 'Sơn La',
    children: [
      {
        value: 'son_la_city',
        label: 'Thành phố Sơn La',
        children: [
          { value: 'chieng_le', label: 'Phường Chieng Lề' },
          { value: 'quynh_nhai', label: 'Phường Quynh Nhai' },
          { value: 'to_hieu', label: 'Phường Tô Hiệu' },
          { value: 'chieng_coi', label: 'Phường Chieng Cơi' }
        ]
      }
    ]
  },
  {
    value: 'tay_ninh',
    label: 'Tây Ninh',
    children: [
      {
        value: 'tay_ninh_city',
        label: 'Thành phố Tây Ninh',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'hiep_ninh', label: 'Phường Hiệp Ninh' },
          { value: 'ninh_son', label: 'Phường Ninh Sơn' },
          { value: 'ninh_thang', label: 'Phường Ninh Thạnh' }
        ]
      }
    ]
  },
  {
    value: 'thai_binh',
    label: 'Thái Bình',
    children: [
      {
        value: 'thai_binh_city',
        label: 'Thành phố Thái Bình',
        children: [
          { value: 'le_hong_phong', label: 'Phường Lê Hồng Phong' },
          { value: 'boi_chau', label: 'Phường Bồi Châu' },
          { value: 'dien_bien', label: 'Phường Điện Biên' },
          { value: 'ky_ba', label: 'Phường Kỳ Bá' },
          { value: 'ly_bon', label: 'Phường Lý Bôn' },
          { value: 'phan_boi_chau', label: 'Phường Phan Bội Châu' },
          { value: 'quang_trung', label: 'Phường Quang Trung' },
          { value: 'tran_hung_dao', label: 'Phường Trần Hưng Đạo' }
        ]
      }
    ]
  },
  {
    value: 'thai_nguyen',
    label: 'Thái Nguyên',
    children: [
      {
        value: 'thai_nguyen_city',
        label: 'Thành phố Thái Nguyên',
        children: [
          { value: 'dong_quang', label: 'Phường Đồng Quang' },
          { value: 'hoang_van_thu', label: 'Phường Hoàng Văn Thụ' },
          { value: 'trung_vuong', label: 'Phường Trưng Vương' },
          { value: 'quang_trung', label: 'Phường Quang Trung' },
          { value: 'phan_dinh_phung', label: 'Phường Phan Đình Phùng' },
          { value: 'tuc_duyen', label: 'Phường Túc Duyên' },
          { value: 'cam_giap', label: 'Phường Cam Giá' },
          { value: 'dong_hai', label: 'Phường Đồng Hải' }
        ]
      },
      {
        value: 'song_cong',
        label: 'Thành phố Sông Công',
        children: [
          { value: 'lam_son', label: 'Phường Lam Sơn' },
          { value: 'cau_truc', label: 'Phường Cầu Trúc' },
          { value: 'thu_cuc', label: 'Phường Thủ Cúc' },
          { value: 'pho_yen', label: 'Phường Phố Yên' }
        ]
      }
    ]
  },
  {
    value: 'thanh_hoa',
    label: 'Thanh Hóa',
    children: [
      {
        value: 'thanh_hoa_city',
        label: 'Thành phố Thanh Hóa',
        children: [
          { value: 'ba_dinh', label: 'Phường Ba Đình' },
          { value: 'bach_dang', label: 'Phường Bạch Đằng' },
          { value: 'dien_bien', label: 'Phường Điện Biên' },
          { value: 'dong_hai', label: 'Phường Đông Hải' },
          { value: 'dong_son', label: 'Phường Đông Sơn' },
          { value: 'dong_ve', label: 'Phường Đông Vệ' },
          { value: 'lam_son', label: 'Phường Lam Sơn' },
          { value: 'nam_ngan', label: 'Phường Nam Ngạn' }
        ]
      },
      {
        value: 'sam_son',
        label: 'Thành phố Sầm Sơn',
        children: [
          { value: 'quang_cuu', label: 'Phường Quảng Cư' },
          { value: 'quang_hung', label: 'Phường Quảng Hưng' },
          { value: 'quang_thien', label: 'Phường Quảng Tiến' },
          { value: 'bach_dang', label: 'Phường Bạch Đằng' }
        ]
      }
    ]
  },
  {
    value: 'thua_thien_hue',
    label: 'Thừa Thiên Huế',
    children: [
      {
        value: 'hue',
        label: 'Thành phố Huế',
        children: [
          { value: 'phu_binh', label: 'Phường Phú Bình' },
          { value: 'phu_thanh', label: 'Phường Phú Thạnh' },
          { value: 'kim_long', label: 'Phường Kim Long' },
          { value: 'tay_loc', label: 'Phường Tây Lộc' },
          { value: 'thuong_hoa', label: 'Phường Thượng Hòa' },
          { value: 'vy_da', label: 'Phường Vỹ Dạ' },
          { value: 'phu_hoi', label: 'Phường Phú Hội' },
          { value: 'phu_nuan', label: 'Phường Phú Nhuận' }
        ]
      }
    ]
  },
  {
    value: 'tien_giang',
    label: 'Tiền Giang',
    children: [
      {
        value: 'my_tho',
        label: 'Thành phố Mỹ Tho',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'ward_6', label: 'Phường 6' },
          { value: 'ward_7', label: 'Phường 7' },
          { value: 'ward_8', label: 'Phường 8' }
        ]
      },
      {
        value: 'go_cong',
        label: 'Thị xã Gò Công',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' }
        ]
      }
    ]
  },
  {
    value: 'tra_vinh',
    label: 'Trà Vinh',
    children: [
      {
        value: 'tra_vinh_city',
        label: 'Thành phố Trà Vinh',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'ward_6', label: 'Phường 6' },
          { value: 'ward_7', label: 'Phường 7' },
          { value: 'ward_8', label: 'Phường 8' }
        ]
      }
    ]
  },
  {
    value: 'tuyen_quang',
    label: 'Tuyên Quang',
    children: [
      {
        value: 'tuyen_quang_city',
        label: 'Thành phố Tuyên Quang',
        children: [
          { value: 'le_duan', label: 'Phường Lê Duẩn' },
          { value: 'tan_quang', label: 'Phường Tân Quang' },
          { value: 'yen_ninh', label: 'Phường Yên Ninh' },
          { value: 'an_tuong', label: 'Phường An Tương' },
          { value: 'phan_thiet', label: 'Phường Phan Thiết' },
          { value: 'nong_tien', label: 'Phường Nông Tiến' }
        ]
      }
    ]
  },
  {
    value: 'vinh_long',
    label: 'Vĩnh Long',
    children: [
      {
        value: 'vinh_long_city',
        label: 'Thành phố Vĩnh Long',
        children: [
          { value: 'ward_1', label: 'Phường 1' },
          { value: 'ward_2', label: 'Phường 2' },
          { value: 'ward_3', label: 'Phường 3' },
          { value: 'ward_4', label: 'Phường 4' },
          { value: 'ward_5', label: 'Phường 5' },
          { value: 'ward_8', label: 'Phường 8' },
          { value: 'thanh_duc', label: 'Phường Thạnh Đức' }
        ]
      }
    ]
  },
  {
    value: 'vinh_phuc',
    label: 'Vĩnh Phúc',
    children: [
      {
        value: 'vinh_yen',
        label: 'Thành phố Vĩnh Yên',
        children: [
          { value: 'dong_tam', label: 'Phường Đống Tâm' },
          { value: 'hoi_hap', label: 'Phường Hội Hợp' },
          { value: 'lien_bao', label: 'Phường Liên Bảo' },
          { value: 'phan_boi_chau', label: 'Phường Phan Bội Châu' },
          { value: 'thanh_tru', label: 'Phường Thanh Trù' },
          { value: 'tich_son', label: 'Phường Tích Sơn' }
        ]
      },
      {
        value: 'phuc_yen',
        label: 'Thành phố Phúc Yên',
        children: [
          { value: 'dong_xuan', label: 'Phường Đông Xuân' },
          { value: 'nam_vien', label: 'Phường Nam Viêm' },
          { value: 'tien_duc', label: 'Phường Tiền Đức' },
          { value: 'trinh_son', label: 'Phường Trịnh Sơn' }
        ]
      }
    ]
  },
  {
    value: 'yen_bai',
    label: 'Yên Bái',
    children: [
      {
        value: 'yen_bai_city',
        label: 'Thành phố Yên Bái',
        children: [
          { value: 'dong_tam', label: 'Phường Đồng Tâm' },
          { value: 'yen_ninh', label: 'Phường Yên Ninh' },
          { value: 'yen_thang', label: 'Phường Yên Thắng' },
          { value: 'nam_cuong', label: 'Phường Nam Cường' },
          { value: 'hong_ha', label: 'Phường Hồng Hà' },
          { value: 'minh_tan', label: 'Phường Minh Tân' }
        ]
      }
    ]
  }
];

export default vietnamLocations;