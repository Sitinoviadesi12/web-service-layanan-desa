import { ReportItem, VillageStat, FieldTeam, EmergencyContact } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1XotV8pFaL330qjp3YaGAnoaimQntfTUuHbboC_ffR50B4C-8EdM8DQMuIv7QfP2pAQXdQHwbUbhOYE4yqVjQymVPoGnKkj2BET9bxiJp2iXquHBxrHQ2AQ9mZZLBGQXEXxdV8c3EBZeyJmbJADlrfiKnwO3IiQx2_9ViMu1mDsL1DUJwL3X21C54FMBv0oMAbJujnuXS5GLTFXHnqXREr9aHgZoq62THmQNJvNwc0fA6Z7WZzbzPT4uzzs',
  avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1Xq0BgAzQ0X8OXJZMkbCK9oq5ETHjmoz7SeRMjxNmFG774VPnueBrKAtu6cbbT8CAo9-EFDkuOTplGCqF47mAsJYpgAibW_90enpfvhQq3KAuPCYF3O71ph-j-k5o-GXjyb0-rjgQ_puDKAHlIP0YDCjX41_3NOcNytxgnWOhlcj1Pg3k25HvVDzUDzh-b5lkBgkshznYV45LjBssQXhVg9J3oAt1XaUfi-G3bbxJPyjT99WsT5IcV4pR8s',
  heroBg: '/images/desa.png',
  mapBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz9xSZ8TyuiRhodrBHYvpqwmoggrjphoiPe9Igl7x_y-JJxtGSvPil2pCHs7lgKlcgHDz5fFTpgq6NWSNpzfVDCiEoBipEwNy4-_MAcPiKwfgjs5apQiPr_0nCi8-ziH1xBGRARg5unmC2IzW6kG2k8Eci1fatB9FLH7H8kdnzER1pYaxFOTr99FmrHMUQ2NCL5S2Lt09iTg4FUtBn-_FW0juP207Yx1_VZegYW1pT80lFDRlzyk8pHQ'
};

export const VILLAGE_DUSUNS = [
  'Dusun Krajan',
  'Dusun Sukamaju',
  'Dusun Melati',
  'Dusun Cempaka',
  'Blok Sawah Kidul',
  'Pusat Pasar Desa'
];

export const CATEGORY_OPTIONS = [
  {
    key: 'jalan',
    label: 'Jalan & Jembatan',
    icon: 'add_road',
    desc: 'Jalan berlubang, paving rusak, jembatan desa'
  },
  {
    key: 'irigasi',
    label: 'Saluran Air & Irigasi',
    icon: 'water_damage',
    desc: 'Irigasi mampet, selokan meluap, pintu air'
  },
  {
    key: 'penerangan',
    label: 'Penerangan Jalan',
    icon: 'light',
    desc: 'Lampu jalan mati, tiang miring, kabel kendor'
  },
  {
    key: 'kebersihan',
    label: 'Kebersihan & Sampah',
    icon: 'delete_sweep',
    desc: 'Tempat sampah liar, tumpukan sampah, TPS'
  },
  {
    key: 'fasilitas',
    label: 'Fasilitas & Balai',
    icon: 'roofing',
    desc: 'Poskamling rusak, balai RT, lapangan umum'
  },
  {
    key: 'taman',
    label: 'Taman & Pohon',
    icon: 'park',
    desc: 'Pohon tumbang/rindang membahayakan jalan'
  }
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    title: 'Posko Siaga Bencana Desa',
    phone: '0812-3456-7890',
    desc: 'Satgas penanggulangan banjir, pohon tumbang, tanggul jebol',
    icon: 'phone_in_talk',
    badge: '24 Jam'
  },
  {
    title: 'Bhabinkamtibmas (Polsek)',
    phone: '0812-3456-7890',
    desc: 'Aiptu Bambang Wijaya - Keamanan & ketertiban desa',
    icon: 'shield_person',
    badge: 'Polri'
  },
  {
    title: 'Babinsa Desa (Koramil)',
    phone: '0813-9876-5432',
    desc: 'Serma Hendra Kusuma - Pembina teritorial desa',
    icon: 'military_tech',
    badge: 'TNI-AD'
  },
  {
    title: 'Ambulans Siaga Desa Mandiri',
    phone: '(021) 555-0199',
    desc: 'Layanan antar pasien darurat 24 jam gratis untuk warga',
    icon: 'emergency',
    badge: 'Kesehatan'
  },
  {
    title: 'PLN Rayon Terdekat (Gangguan)',
    phone: '123',
    desc: 'Layanan aduan kabel putus dan trafo meledak',
    icon: 'bolt',
    badge: 'Kelistrikan'
  }
];

export const INITIAL_STATS: VillageStat[] = [
  {
    value: '98.5%',
    title: 'Ditanggapi',
    description: 'Respon awal petugas desa dalam kurun waktu 1x24 jam kerja.',
    icon: 'quickreply'
  },
  {
    value: '24',
    title: 'Petugas Siaga',
    description: 'Tim teknis & satgas gotong royong aktif di 6 dusun wilayah desa.',
    icon: 'engineering'
  },
  {
    value: '1.450+',
    title: 'Warga Aktif',
    description: 'Warga terdaftar yang berpartisipasi menjaga fasilitas desa.',
    icon: 'groups'
  }
];

export const FIELD_TEAMS: FieldTeam[] = [
  {
    id: 'team-bm',
    code: 'BM',
    name: 'Regu Bina Marga (Jalan & Jembatan)',
    division: 'Infrastruktur Jalan',
    leader: 'Suryadi (Koordinator Jalan)',
    activeMembers: 6,
    status: 'Bertugas',
    currentLocation: 'Dusun Krajan (Perbaikan Tambal Cepat)',
    assignedTickets: ['#LAP-0419', '#LAP-0413'],
    vehicle: 'Pick-Up L300 & Stamper Mesin',
  },
  {
    id: 'team-ta',
    code: 'TA',
    name: 'Tim Tata Air & Irigasi Desa',
    division: 'Pengairan & Drainase',
    leader: 'Mansur Efendi',
    activeMembers: 5,
    status: 'Bertugas',
    currentLocation: 'Blok Sawah Kidul (Pembersihan Sedimentasi)',
    assignedTickets: ['#LAP-0417'],
    vehicle: 'Alkon Pompa 3 Inch & Gerobak Dorong',
  },
  {
    id: 'team-pju',
    code: 'PJU',
    name: 'Regu Kelistrikan & PJU',
    division: 'Penerangan Umum',
    leader: 'Agus Salim',
    activeMembers: 4,
    status: 'Siaga',
    currentLocation: 'Bengkel Balai Desa Mandiri',
    assignedTickets: ['#LAP-0418'],
    vehicle: 'Mobil Tangga Hidrolik Mini',
  },
  {
    id: 'team-kth',
    code: 'KTH',
    name: 'Satgas Kebersihan & Ruang Hijau',
    division: 'Lingkungan Hidup',
    leader: 'Teguh Wibowo',
    activeMembers: 8,
    status: 'Bertugas',
    currentLocation: 'TPS Pasar Tradisional & Depan SDN 1',
    assignedTickets: ['#LAP-0416', '#LAP-0414'],
    vehicle: 'Truk Dump Sampah & Chainsaw',
  }
];

export const INITIAL_REPORTS: ReportItem[] = [
  {
    id: '#LAP-0412',
    title: 'Jalan berlubang cukup dalam dekat Jembatan Kali Putih',
    category: 'jalan',
    categoryLabel: 'Jalan & Aspal',
    categoryIcon: 'add_road',
    status: 'Diajukan',
    location: 'Dusun Krajan RT 03 / RW 02, arah makam barat',
    dusun: 'Dusun Krajan',
    description: 'Lubang sedalam 15 cm membahayakan pengendara motor dan anak-anak berangkat sekolah, perlu pengurukan aspal dingin segera.',
    timeAgo: '1 jam lalu',
    createdAt: '2026-10-04 06:30',
    priority: 'Sedang',
    officerBadge: 'Prioritas: Sedang',
    officerBadgeType: 'priority',
    coordinates: {
      lat: -2.5710,
      lng: 121.1985,
      xPercent: 72,
      yPercent: 72
    },
    reporterName: 'Budi Santoso',
    isAnonymous: false,
    upvotes: 38,
    timeline: [
      {
        title: 'Laporan Diterima Sistem',
        time: 'Hari ini, 06:30 WIB',
        description: 'Laporan berhasil dibuat oleh warga dengan nomor tiket #LAP-0412.',
        actor: 'Sistem Portal Desa',
        isCompleted: true
      },
      {
        title: 'Verifikasi Kaur Pelayanan Desa',
        time: 'Hari ini, 07:15 WIB',
        description: 'Data dan titik koordinat telah diverifikasi ke Pak RT 03 Dusun Krajan.',
        actor: 'Kaur Pelayanan (Bpk. Mulyono)',
        isCompleted: true
      },
      {
        title: 'Penjadwalan Eksekusi Aspal Dingin',
        time: 'Sedang Menunggu Satgas',
        description: 'Menunggu pengiriman material cold-mix dari dinas PU kecamatan.',
        actor: 'Satgas Jalan Desa',
        isCompleted: false
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'Siti Rahmawati (Warga RT 02)',
        role: 'Warga Dusun Krajan',
        text: 'Betul sekali, kemarin tetangga saya sempat tergelincir ban depannya pas lewat malam hari.',
        time: '45 menit lalu'
      },
      {
        id: 'c2',
        author: 'Pak RT 03 Dusun Krajan',
        role: 'Ketua RT',
        text: 'Sudah kami pasang tanda pembatas bambu sementara agar kendaraan roda dua tidak terperosok.',
        time: '30 menit lalu'
      }
    ]
  },
  {
    id: '#LAP-0409',
    title: 'Pembersihan tumpukan sampah menyumbat pintu air sawah timur',
    category: 'irigasi',
    categoryLabel: 'Saluran Air & Irigasi',
    categoryIcon: 'water_damage',
    status: 'Selesai',
    location: 'Saluran Irigasi Blok Sawah Kidul RT 01',
    dusun: 'Blok Sawah Kidul',
    description: 'Sampah ranting dan plastik telah diangkat oleh satgas irigasi bersama warga gotong royong. Aliran air kembali lancar normal.',
    timeAgo: 'Selesai kemarin',
    createdAt: '2026-10-02 08:15',
    priority: 'Tinggi',
    officerBadge: 'Ketua RW 01 & Kaur',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -2.5735,
      lng: 121.2050,
      xPercent: 18,
      yPercent: 26
    },
    reporterName: 'Warga Blok Kidul',
    isAnonymous: true,
    upvotes: 64,
    timeline: [
      {
        title: 'Laporan Diterima',
        time: '02 Okt 2026, 08:15 WIB',
        description: 'Laporan penyumbatan pintu air persawahan warga.',
        actor: 'Portal Mandiri',
        isCompleted: true
      },
      {
        title: 'Peninjauan Lapangan',
        time: '02 Okt 2026, 10:00 WIB',
        description: 'Ketua RW 01 dan Kaur Kesra meninjau tumpukan batang bambu dan plastik.',
        actor: 'Kaur Kesra',
        isCompleted: true
      },
      {
        title: 'Kerja Bakti Tanggap Darurat',
        time: '03 Okt 2026, 07:00 WIB',
        description: '25 warga bersama 4 personel satgas mengangkat sedimen dan sampah.',
        actor: 'Satgas Irigasi & Warga',
        isCompleted: true
      },
      {
        title: 'Pemeriksaan Debit Air & Penutupan Laporan',
        time: '03 Okt 2026, 14:00 WIB',
        description: 'Aliran 120 liter/detik normal kembali menuju 18 hektar persawahan timur.',
        actor: 'Kaur Pelayanan',
        isCompleted: true
      }
    ],
    comments: [
      {
        id: 'c3',
        author: 'H. Sudirman (Kelompok Tani Makmur)',
        role: 'Ketua Poktan',
        text: 'Alhamdulillah matur nuwun respon kilat perangkat desa dan bapak-bapak yang gotong royong.',
        time: 'Kemarin, 15:30 WIB'
      }
    ]
  },
  {
    id: '#LAP-0411',
    title: 'Lampu PJU mati di pertigaan Poskamling Dusun Sukamaju',
    category: 'penerangan',
    categoryLabel: 'Penerangan Jalan (PJU)',
    categoryIcon: 'light',
    status: 'Sedang Dikerjakan',
    location: 'JL. Mawar Indah No. 14, Dusun Sukamaju',
    dusun: 'Dusun Sukamaju',
    description: 'Kabel fitting putus dan bohlam LED terbakar. Petugas teknis desa sedang mengganti modul ballast dan lampu baru.',
    timeAgo: 'Dikerjakan hari ini',
    createdAt: '2026-10-03 19:40',
    priority: 'Sedang',
    officerBadge: 'Tim Kelistrikan',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -2.5780,
      lng: 121.2010,
      xPercent: 25,
      yPercent: 73
    },
    reporterName: 'Agus Triono',
    isAnonymous: false,
    upvotes: 42,
    timeline: [
      {
        title: 'Laporan Dibuat',
        time: '03 Okt 2026, 19:40 WIB',
        description: 'Pertigaan jalan raya gelap membahayakan pemuda ronda dan pelintas jalan.',
        actor: 'Agus Triono',
        isCompleted: true
      },
      {
        title: 'Pengecekan Komponen Listrik',
        time: 'Hari ini, 08:30 WIB',
        description: 'Modul trafo fitting mengalami lonjakan voltase pasca hujan lebat.',
        actor: 'Tim Kelistrikan Desa',
        isCompleted: true
      },
      {
        title: 'Pemasangan Modul LED 60W Baru',
        time: 'Hari ini, 10:15 WIB',
        description: 'Teknisi sedang menaiki tiang menggunakan tangga hidrolik pikap desa.',
        actor: 'Teknisi PLN Desa',
        isCompleted: true
      }
    ]
  },
  {
    id: '#LAP-0413',
    title: 'Dahan pohon trembesi menutupi kabel listrik & rambu jalan',
    category: 'taman',
    categoryLabel: 'Taman & Pohon',
    categoryIcon: 'park',
    status: 'Diajukan',
    location: 'Depan SDN 1 Mandiri, Jl. Raya Desa',
    dusun: 'Dusun Krajan',
    description: 'Dahan rimbun berisiko patah saat angin kencang hujan deras dan menggesek kabel PLN, mohon pemangkasan segera.',
    timeAgo: '3 jam lalu',
    createdAt: '2026-10-04 04:10',
    priority: 'Tinggi',
    officerBadge: 'Antrean Pemangkasan',
    officerBadgeType: 'priority',
    coordinates: {
      lat: -2.5750,
      lng: 121.1960,
      xPercent: 50,
      yPercent: 80
    },
    reporterName: 'Ibu Ratna (Guru SDN 1)',
    isAnonymous: false,
    upvotes: 29,
    timeline: [
      {
        title: 'Laporan Masuk',
        time: 'Hari ini, 04:10 WIB',
        description: 'Kekhawatiran dahan menimpa pagar sekolah dan menggesek kabel transmisi.',
        actor: 'Ibu Ratna',
        isCompleted: true
      },
      {
        title: 'Koordinasi dengan Satgas DLH & PLN',
        time: 'Hari ini, 06:45 WIB',
        description: 'Surat tugas pemangkasan telah diterbitkan kantor desa.',
        actor: 'Sekretaris Desa',
        isCompleted: true
      }
    ]
  },
  {
    id: '#LAP-0405',
    title: 'Pengangkutan kontainer sampah pasar desa yang meluber',
    category: 'kebersihan',
    categoryLabel: 'Kebersihan',
    categoryIcon: 'delete_sweep',
    status: 'Selesai',
    location: 'Area TPS Pasar Tradisional Desa Mandiri',
    dusun: 'Pusat Pasar Desa',
    description: 'Armada pikap kebersihan desa telah mengangkut seluruh residu ke TPA kecamatan dan area sekitar sudah disemprot bersih.',
    timeAgo: '2 hari lalu',
    createdAt: '2026-10-01 11:20',
    priority: 'Sedang',
    officerBadge: 'Pengelola Pasar',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -2.5740,
      lng: 121.2030,
      xPercent: 43,
      yPercent: 71
    },
    reporterName: 'Warga Pasar Mandiri',
    isAnonymous: true,
    upvotes: 51,
    timeline: [
      {
        title: 'Laporan Sampah Meluap',
        time: '01 Okt 2026, 11:20 WIB',
        description: 'Volume sampah akhir pekan meningkat pesat pasca hari pasaran legi.',
        actor: 'Pengurus Paguyuban Pasar',
        isCompleted: true
      },
      {
        title: 'Pengerahan Armada Dumptruck',
        time: '01 Okt 2026, 14:00 WIB',
        description: '2 ritase pengangkutan langsung menuju TPA Regional.',
        actor: 'Satgas Kebersihan Desa',
        isCompleted: true
      },
      {
        title: 'Pembersihan & Desinfektan',
        time: '02 Okt 2026, 09:00 WIB',
        description: 'Area TPS disemprot air bertekanan dan cairan penghilang bau busuk.',
        actor: 'Satpol PP & Pengelola Pasar',
        isCompleted: true
      }
    ]
  },
  {
    id: '#LAP-0408',
    title: 'Pengecatan dan perbaikan atap Pos Ronda Dusun Melati',
    category: 'fasilitas',
    categoryLabel: 'Fasilitas Umum',
    categoryIcon: 'roofing',
    status: 'Dijadwalkan',
    location: 'Poskamling RT 05 RW 03',
    dusun: 'Dusun Melati',
    description: 'Genteng bocor 4 bilah dan lantai retak. Telah dijadwalkan pada agenda kerja bakti Minggu pagi bersama karang taruna.',
    timeAgo: 'Minggu, 07:00 WIB',
    createdAt: '2026-10-02 16:00',
    priority: 'Rendah',
    officerBadge: 'Karang Taruna',
    officerBadgeType: 'officer',
    coordinates: {
      lat: -2.5765,
      lng: 121.2075,
      xPercent: 85,
      yPercent: 35
    },
    reporterName: 'Deni Kurniawan',
    isAnonymous: false,
    upvotes: 21,
    timeline: [
      {
        title: 'Pengajuan Renovasi Ringan Poskamling',
        time: '02 Okt 2026, 16:00 WIB',
        description: 'Genteng pecah mengakibatkan air hujan masuk saat ronda malam.',
        actor: 'Deni Kurniawan',
        isCompleted: true
      },
      {
        title: 'Persetujuan Alokasi Cat & Genteng Swadaya',
        time: '03 Okt 2026, 11:00 WIB',
        description: 'Kas RT dan bantuan cat dari Desa siap diserahkan.',
        actor: 'Kepala Dusun Melati',
        isCompleted: true
      },
      {
        title: 'Eksekusi Kerja Bakti Bersama',
        time: 'Minggu Depan, 07:00 WIB',
        description: 'Akan dikerjakan serentak oleh Karang Taruna Tunas Harapan.',
        actor: 'Karang Taruna & Warga',
        isCompleted: false
      }
    ]
  }
];
