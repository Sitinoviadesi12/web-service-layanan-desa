
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Layanan Desa Mandiri API</title>
    <style>
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            color: #17352a;
            background: linear-gradient(135deg, #e4f8eb, #a7dcae);
            min-height: 100vh;
        }
        header {
            background: white;
            padding: 20px 7%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            box-shadow: 0 2px 12px #174b2415;
        }
        header h2 { margin: 0; color: #087b49; }
        header p { margin: 5px 0 0; color: #64756c; }
        nav a {
            margin-left: 18px;
            color: #176b46;
            text-decoration: none;
            font-weight: bold;
        }
        main {
            max-width: 850px;
            margin: 38px auto;
            padding: 0 18px;
        }
        .panel {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 12px 35px #164d2518;
        }
        .hero { text-align: center; margin-bottom: 28px; }
        .logo {
            margin: auto;
            width: 66px;
            height: 66px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: #078247;
            color: white;
            font-size: 22px;
            font-weight: bold;
        }
        .hero h1 { margin-bottom: 8px; }
        .hero p { color: #6b7b71; }
        h3 { margin-top: 28px; }
        .endpoint {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 13px;
            margin: 9px 0;
            border: 1px solid #e0eee4;
            border-radius: 10px;
            flex-wrap: wrap;
        }
        .method {
            min-width: 58px;
            text-align: center;
            padding: 6px;
            color: white;
            border-radius: 6px;
            font-weight: bold;
            font-size: 12px;
        }
        .get { background: #159447; }
        .post { background: #2878d0; }
        code { font-weight: bold; overflow-wrap: anywhere; }
        .description { margin-left: auto; color: #64756c; }
        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-top: 25px;
        }
        .stat {
            background: #087b43;
            color: white;
            padding: 20px 10px;
            text-align: center;
            border-radius: 12px;
        }
        .stat strong { display: block; font-size: 25px; }
        .stat span { font-size: 12px; }
        .actions {
            display: flex;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 25px;
        }
        .btn {
            padding: 12px 20px;
            border-radius: 24px;
            background: #087b43;
            color: white;
            text-decoration: none;
            font-weight: bold;
        }
        .btn.outline {
            color: #087b43;
            background: white;
            border: 1px solid #087b43;
        }
        footer {
            text-align: center;
            color: #718077;
            font-size: 13px;
            margin-top: 28px;
        }
        @media (max-width: 600px) {
            header { padding: 18px; }
            nav a { margin: 0 8px 0 0; }
            .panel { padding: 20px 14px; }
            .stats { grid-template-columns: 1fr; }
            .description { margin-left: 0; width: 100%; }
        }
    </style>
</head>
<body>
    <header>
        <div>
            <h2>🏡 Layanan Desa Mandiri</h2>
            <p>API Pengaduan Warga Desa</p>
        </div>
        <nav>
            <a href="#beranda">Beranda</a>
            <a href="#endpoint">Endpoint</a>
            <a href="#tentang">Tentang</a>
        </nav>
    </header>

    <main id="beranda">
        <section class="panel">
            <div class="hero">
                <div class="logo">API</div>
                <h1>Layanan Desa Mandiri API</h1>
                <p>Portal API Pengaduan dan Pelayanan Warga Desa</p>
            </div>

            <h3 id="endpoint">📡 Endpoint API</h3>

            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/reports</code>
                <span class="description">Daftar laporan warga</span>
            </div>

            <div class="endpoint">
                <span class="method post">POST</span>
                <code>/api/reports</code>
                <span class="description">Membuat laporan baru</span>
            </div>

            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/reports/stats</code>
                <span class="description">Statistik laporan</span>
            </div>

            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/teams</code>
                <span class="description">Data tim pengelola</span>
            </div>

            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/daily-notes</code>
                <span class="description">Catatan harian</span>
            </div>

            <div class="endpoint">
                <span class="method get">GET</span>
                <code>/api/emergency-contacts</code>
                <span class="description">Kontak darurat</span>
            </div>

            <div class="actions">
                <a class="btn" href="/">Website Desa</a>
               <a class="btn outline"
   href="/docs/openapi.yaml"
   target="_blank"
   rel="noopener noreferrer">
    Dokumentasi API
</a>
            </div>

            <footer id="tentang">
                <p><strong>Layanan Desa Mandiri · API v1</strong></p>
                <p>Portal dokumentasi API untuk pelayanan pengaduan warga.</p>
            </footer>
        </section>
    </main>
</body>
</html>
