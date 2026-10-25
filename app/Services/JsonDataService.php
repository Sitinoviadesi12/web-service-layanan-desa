<?php

namespace App\Services;

class JsonDataService
{
    protected string $dataDir;
    protected string $reportsFile;
    protected string $teamsFile;
    protected string $notesFile;
    protected string $contactsFile;
    protected string $citizensFile;

    public function __construct()
    {
        $this->dataDir = storage_path('app/data');
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0755, true);
        }

        $this->reportsFile = $this->dataDir . '/reports.json';
        $this->teamsFile = $this->dataDir . '/teams.json';
        $this->notesFile = $this->dataDir . '/daily_notes.json';
        $this->contactsFile = $this->dataDir . '/emergency_contacts.json';
        $this->citizensFile = $this->dataDir . '/citizens.json';

        $this->ensureInitialized();
    }

    /**
     * Ensure default JSON files exist with canonical data
     */
    protected function ensureInitialized(): void
    {
        if (!file_exists($this->reportsFile)) {
            $this->saveJson($this->reportsFile, $this->getDefaultReports());
        }

        if (!file_exists($this->teamsFile)) {
            $this->saveJson($this->teamsFile, $this->getDefaultTeams());
        }

        if (!file_exists($this->notesFile)) {
            $this->saveJson($this->notesFile, $this->getDefaultNotes());
        }

        if (!file_exists($this->contactsFile)) {
            $this->saveJson($this->contactsFile, $this->getDefaultContacts());
        }

        if (!file_exists($this->citizensFile)) {
            $this->saveJson($this->citizensFile, $this->getDefaultCitizens());
        }
    }

    protected function readJson(string $filePath): array
    {
        if (!file_exists($filePath)) {
            return [];
        }
        $content = file_get_contents($filePath);
        $data = json_decode($content, true);
        return is_array($data) ? $data : [];
    }

    protected function saveJson(string $filePath, array $data): bool
    {
        $content = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        return file_put_contents($filePath, $content, LOCK_EX) !== false;
    }

    /* ---------------- Reports Methods ---------------- */

    public function getReports(array $filters = []): array
    {
        $reports = $this->readJson($this->reportsFile);

        // Filter by Status Tab
        if (!empty($filters['status'])) {
            $statusFilter = strtolower($filters['status']);
            if ($statusFilter !== 'all' && $statusFilter !== 'semua') {
                $reports = array_values(array_filter($reports, function ($r) use ($statusFilter) {
                    $st = strtolower($r['status'] ?? '');
                    if ($statusFilter === 'diajukan' || $statusFilter === 'menunggu') {
                        return $st === 'diajukan' || $st === 'menunggu verifikasi';
                    }
                    if ($statusFilter === 'proses' || $statusFilter === 'sedang dikerjakan' || $statusFilter === 'sedang diproses') {
                        return $st === 'sedang dikerjakan' || $st === 'sedang diproses';
                    }
                    if ($statusFilter === 'dijadwalkan') {
                        return $st === 'dijadwalkan';
                    }
                    if ($statusFilter === 'selesai') {
                        return $st === 'selesai';
                    }
                    if ($statusFilter === 'ditolak') {
                        return $st === 'ditolak';
                    }
                    return $st === $statusFilter;
                }));
            }
        }

        // Filter by Category
        if (!empty($filters['category'])) {
            $catFilter = strtolower($filters['category']);
            $reports = array_values(array_filter($reports, function ($r) use ($catFilter) {
                $cat = strtolower($r['category'] ?? '');
                $catLabel = strtolower($r['categoryLabel'] ?? '');
                return $cat === $catFilter || str_contains($catLabel, $catFilter);
            }));
        }

        // Filter by Dusun
        if (!empty($filters['dusun'])) {
            $dusunFilter = strtolower($filters['dusun']);
            $reports = array_values(array_filter($reports, function ($r) use ($dusunFilter) {
                return str_contains(strtolower($r['dusun'] ?? ''), $dusunFilter);
            }));
        }

        // Search Query
        if (!empty($filters['search'])) {
            $q = strtolower(trim($filters['search']));
            $reports = array_values(array_filter($reports, function ($r) use ($q) {
                return str_contains(strtolower($r['id'] ?? ''), $q) ||
                       str_contains(strtolower($r['title'] ?? ''), $q) ||
                       str_contains(strtolower($r['reporterName'] ?? ''), $q) ||
                       str_contains(strtolower($r['location'] ?? ''), $q) ||
                       str_contains(strtolower($r['description'] ?? ''), $q);
            }));
        }

        // Sorting
        $sort = $filters['sort'] ?? 'terbaru';
        if ($sort === 'prioritas') {
            $priorityWeights = ['Mendesak' => 4, 'Tinggi' => 3, 'Sedang' => 2, 'Rendah' => 1];
            usort($reports, function ($a, $b) use ($priorityWeights) {
                $pA = $priorityWeights[$a['priority'] ?? 'Sedang'] ?? 2;
                $pB = $priorityWeights[$b['priority'] ?? 'Sedang'] ?? 2;
                return $pB <=> $pA;
            });
        } elseif ($sort === 'lokasi') {
            usort($reports, fn($a, $b) => strcmp($a['dusun'] ?? '', $b['dusun'] ?? ''));
        } else {
            // terbaru (by ID or createdAt desc)
            usort($reports, function ($a, $b) {
                return strcmp($b['createdAt'] ?? $b['id'], $a['createdAt'] ?? $a['id']);
            });
        }

        return $reports;
    }

    public function getReportById(string $id): ?array
    {
        $reports = $this->readJson($this->reportsFile);
        $cleanId = strtoupper(trim($id));
        if (!str_starts_with($cleanId, '#')) {
            $cleanId = '#' . $cleanId;
        }

        foreach ($reports as $report) {
            if (strtoupper($report['id']) === $cleanId) {
                return $report;
            }
        }
        return null;
    }

    public function createReport(array $input): array
    {
        $reports = $this->readJson($this->reportsFile);

        // Generate Ticket ID
        $newNumber = rand(1000, 9999);
        $ticketId = "#LAP-" . $newNumber;

        // Category mapping
        $catMeta = $this->getCategoryMeta($input['category'] ?? 'jalan');

        $isAnonymous = !empty($input['isAnonymous']);
        $reporterName = $isAnonymous ? 'Warga Anonim' : ($input['reporterName'] ?? 'Warga Desa');

        $priority = in_array($input['priority'] ?? '', ['Rendah', 'Sedang', 'Tinggi', 'Mendesak']) 
            ? $input['priority'] 
            : 'Sedang';

        $dusun = $input['dusun'] ?? 'Dusun Krajan';
        $location = !empty($input['rtRw']) 
            ? "{$dusun}, {$input['rtRw']}" 
            : ($input['location'] ?? "{$dusun}, Wilayah Desa Mandiri");

        $newReport = [
            'id' => $ticketId,
            'title' => trim($input['title'] ?? 'Laporan Baru Warga'),
            'category' => $catMeta['key'],
            'categoryLabel' => $catMeta['label'],
            'categoryIcon' => $catMeta['icon'],
            'status' => 'Diajukan',
            'location' => $location,
            'dusun' => $dusun,
            'description' => trim($input['description'] ?? ''),
            'timeAgo' => 'Baru saja',
            'createdAt' => date('Y-m-d H:i'),
            'priority' => $priority,
            'officerBadge' => "Prioritas: {$priority}",
            'officerBadgeType' => 'priority',
            'coordinates' => [
                'lat' => $input['coordinates']['lat'] ?? (-2.5740 + (mt_rand(-50, 50) / 10000)),
                'lng' => $input['coordinates']['lng'] ?? (121.2020 + (mt_rand(-50, 50) / 10000)),
                'xPercent' => $input['coordinates']['xPercent'] ?? rand(25, 75),
                'yPercent' => $input['coordinates']['yPercent'] ?? rand(25, 75),
            ],
            'reporterName' => $reporterName,
            'reporterRole' => $input['reporterRole'] ?? ($isAnonymous ? 'Warga' : 'Warga RT Setempat'),
            'reporterPhone' => $input['reporterPhone'] ?? $input['phone'] ?? null,
            'isAnonymous' => $isAnonymous,
            'upvotes' => 1,
            'hasUpvoted' => false,
            'assignedTeam' => null,
            'notes' => null,
            'timeline' => [
                [
                    'title' => 'Laporan Dikirimkan Warga',
                    'time' => date('d M Y, H:i') . ' WIB',
                    'description' => 'Laporan masuk antrean verifikasi Kaur Pelayanan.',
                    'actor' => $reporterName,
                    'isCompleted' => true
                ],
                [
                    'title' => 'Verifikasi dan Penjadwalan Satgas',
                    'time' => 'Menunggu verifikasi admin',
                    'description' => 'Akan ditinjau oleh perangkat desa dalam 1x24 jam kerja.',
                    'actor' => 'Kaur Pelayanan Desa',
                    'isCompleted' => false
                ]
            ],
            'photos' => !empty($input['photoUrl']) || !empty($input['photos']['before'])
                ? ['before' => $input['photoUrl'] ?? ($input['photos']['before'] ?? null)]
                : null,
            'comments' => []
        ];

        // Insert at beginning of array
        array_unshift($reports, $newReport);
        $this->saveJson($this->reportsFile, $reports);

        return $newReport;
    }

    public function updateReport(string $id, array $data, ?string $callerPhone = null, ?string $callerName = null, bool $isAdmin = false): array
    {
        $reports = $this->readJson($this->reportsFile);
        $cleanId = strtoupper(trim($id));
        if (!str_starts_with($cleanId, '#')) {
            $cleanId = '#' . $cleanId;
        }

        $foundIndex = -1;
        foreach ($reports as $index => $r) {
            if (strtoupper($r['id']) === $cleanId) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex === -1) {
            return ['success' => false, 'code' => 404, 'message' => 'Laporan tidak ditemukan', 'report' => null];
        }

        $report = $reports[$foundIndex];

        // Ownership authorization check
        if (!$isAdmin) {
            if (!empty($report['isAnonymous'])) {
                return [
                    'success' => false,
                    'code' => 403,
                    'message' => 'Laporan anonim hanya dapat dikelola oleh Administrator Desa.',
                    'report' => null
                ];
            }

            if (!empty($callerPhone) || !empty($callerName)) {
                $normCallerPhone = preg_replace('/[^0-9]/', '', $callerPhone ?? '');
                $normReportPhone = preg_replace('/[^0-9]/', '', $report['reporterPhone'] ?? '');
                $callerNameTrim = strtolower(trim($callerName ?? ''));
                $reportNameTrim = strtolower(trim($report['reporterName'] ?? ''));

                $isPhoneMatch = !empty($normCallerPhone) && !empty($normReportPhone) && $normCallerPhone === $normReportPhone;
                $isNameMatch = !empty($callerNameTrim) && !empty($reportNameTrim) && $callerNameTrim === $reportNameTrim;

                if (!$isPhoneMatch && !$isNameMatch) {
                    return [
                        'success' => false,
                        'code' => 403,
                        'message' => 'Akses ditolak: Hanya warga pelapor (' . ($report['reporterName'] ?? 'Pelapor') . ') yang berhak mengubah laporan ini.',
                        'report' => null
                    ];
                }
            }
        }

        // Merge fields
        foreach (['title', 'category', 'status', 'location', 'dusun', 'description', 'priority', 'assignedTeam', 'notes', 'rejectionReason', 'reporterName', 'reporterPhone', 'isAnonymous'] as $field) {
            if (isset($data[$field])) {
                $report[$field] = $data[$field];
            }
        }

        if (isset($data['photoUrl'])) {
            $report['photos'] = !empty($data['photoUrl']) ? ['before' => $data['photoUrl']] : null;
        } elseif (isset($data['photos'])) {
            $report['photos'] = $data['photos'];
        }

        // Update category label & icon if category changed
        if (isset($data['category'])) {
            $meta = $this->getCategoryMeta($data['category']);
            $report['category'] = $meta['key'];
            $report['categoryLabel'] = $meta['label'];
            $report['categoryIcon'] = $meta['icon'];
        }

        // If priority changed and no officer badge assigned yet, update officerBadge
        if (isset($data['priority']) && ($report['officerBadgeType'] ?? '') === 'priority') {
            $report['officerBadge'] = "Prioritas: {$data['priority']}";
        }

        // If status changed, ensure timeline reflects it
        if (!empty($data['status']) && $data['status'] !== $reports[$foundIndex]['status']) {
            $newStatus = $data['status'];
            $report['timeline'][] = [
                'title' => "Perubahan Status: {$newStatus}",
                'time' => date('d M Y, H:i') . ' WIB',
                'description' => $data['notes'] ?? "Status tiket diperbarui menjadi {$newStatus}.",
                'actor' => 'Administrator Desa',
                'isCompleted' => true
            ];
        }

        $reports[$foundIndex] = $report;
        $this->saveJson($this->reportsFile, $reports);

        return ['success' => true, 'code' => 200, 'message' => 'Laporan berhasil diperbarui', 'report' => $report];
    }

    public function deleteReport(string $id, ?string $callerPhone = null, ?string $callerName = null, bool $isAdmin = false): array
    {
        $reports = $this->readJson($this->reportsFile);
        $cleanId = strtoupper(trim($id));
        if (!str_starts_with($cleanId, '#')) {
            $cleanId = '#' . $cleanId;
        }

        $foundIndex = -1;
        foreach ($reports as $index => $r) {
            if (strtoupper($r['id']) === $cleanId) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex === -1) {
            return ['success' => false, 'code' => 404, 'message' => 'Laporan tidak ditemukan'];
        }

        $report = $reports[$foundIndex];

        // Authorization check:
        if (!$isAdmin) {
            // If anonymous
            if (!empty($report['isAnonymous'])) {
                return [
                    'success' => false,
                    'code' => 403,
                    'message' => 'Laporan diajukan secara anonim sehingga hanya dapat dikelola atau dihapus oleh Administrator Desa.'
                ];
            }

            $normCallerPhone = preg_replace('/[^0-9]/', '', $callerPhone ?? '');
            $normReportPhone = preg_replace('/[^0-9]/', '', $report['reporterPhone'] ?? '');
            $callerNameTrim = strtolower(trim($callerName ?? ''));
            $reportNameTrim = strtolower(trim($report['reporterName'] ?? ''));

            $isPhoneMatch = !empty($normCallerPhone) && !empty($normReportPhone) && $normCallerPhone === $normReportPhone;
            $isNameMatch = !empty($callerNameTrim) && !empty($reportNameTrim) && $callerNameTrim === $reportNameTrim;

            if (!$isPhoneMatch && !$isNameMatch) {
                return [
                    'success' => false,
                    'code' => 403,
                    'message' => 'Akses ditolak: Hanya warga pelapor (' . ($report['reporterName'] ?? 'Pelapor') . ') yang berhak menghapus laporan ini.'
                ];
            }
        }

        array_splice($reports, $foundIndex, 1);
        $this->saveJson($this->reportsFile, $reports);

        return ['success' => true, 'code' => 200, 'message' => 'Laporan berhasil dihapus', 'id' => $report['id']];
    }

    public function verifyReport(string $id, array $verificationData): ?array
    {
        $reports = $this->readJson($this->reportsFile);
        $cleanId = strtoupper(trim($id));
        if (!str_starts_with($cleanId, '#')) {
            $cleanId = '#' . $cleanId;
        }

        $foundIndex = -1;
        foreach ($reports as $index => $r) {
            if (strtoupper($r['id']) === $cleanId) {
                $foundIndex = $index;
                break;
            }
        }

        if ($foundIndex === -1) {
            return null;
        }

        $report = $reports[$foundIndex];

        $assignedTeam = $verificationData['assignedTeam'] ?? 'Regu Satgas Desa';
        $internalNotes = $verificationData['notes'] ?? 'Laporan sah dan diteruskan ke satgas penanganan.';
        $targetStatus = $verificationData['status'] ?? 'Sedang Dikerjakan';
        $priority = $verificationData['priority'] ?? $report['priority'];

        $report['status'] = $targetStatus;
        $report['assignedTeam'] = $assignedTeam;
        $report['notes'] = $internalNotes;
        $report['priority'] = $priority;
        $report['officerBadge'] = $assignedTeam;
        $report['officerBadgeType'] = 'officer';

        // Add verification timeline event
        $report['timeline'][] = [
            'title' => 'Verifikasi & Disposisi Penugasan',
            'time' => date('d M Y, H:i') . ' WIB',
            'description' => "Diverifikasi sah. Diteruskan ke {$assignedTeam}. Catatan: {$internalNotes}",
            'actor' => 'Kaur Pelayanan Desa',
            'isCompleted' => true
        ];

        // Also append to team assigned tickets
        $this->assignTicketToTeam($assignedTeam, $report['id']);

        $reports[$foundIndex] = $report;
        $this->saveJson($this->reportsFile, $reports);

        return $report;
    }

    public function toggleUpvote(string $id): ?array
    {
        $reports = $this->readJson($this->reportsFile);
        $cleanId = strtoupper(trim($id));
        if (!str_starts_with($cleanId, '#')) {
            $cleanId = '#' . $cleanId;
        }

        foreach ($reports as $i => $report) {
            if (strtoupper($report['id']) === $cleanId) {
                $hasUpvoted = !empty($report['hasUpvoted']);
                $report['hasUpvoted'] = !$hasUpvoted;
                $report['upvotes'] = $hasUpvoted ? max(0, $report['upvotes'] - 1) : ($report['upvotes'] + 1);
                $reports[$i] = $report;
                $this->saveJson($this->reportsFile, $reports);
                return $report;
            }
        }
        return null;
    }

    public function addComment(string $id, array $commentData): ?array
    {
        $reports = $this->readJson($this->reportsFile);
        $cleanId = strtoupper(trim($id));
        if (!str_starts_with($cleanId, '#')) {
            $cleanId = '#' . $cleanId;
        }

        foreach ($reports as $i => $report) {
            if (strtoupper($report['id']) === $cleanId) {
                $newComment = [
                    'id' => 'c_' . round(microtime(true) * 1000),
                    'author' => trim($commentData['author'] ?? 'Warga Desa'),
                    'role' => trim($commentData['role'] ?? 'Warga Masyarakat'),
                    'text' => trim($commentData['text'] ?? ''),
                    'time' => 'Baru saja (' . date('H:i') . ' WIB)',
                    'createdAt' => date('Y-m-d H:i:s')
                ];

                if (!isset($report['comments']) || !is_array($report['comments'])) {
                    $report['comments'] = [];
                }

                $report['comments'][] = $newComment;
                $reports[$i] = $report;
                $this->saveJson($this->reportsFile, $reports);
                return $report;
            }
        }
        return null;
    }

    public function getStats(): array
    {
        $reports = $this->readJson($this->reportsFile);
        $teams = $this->readJson($this->teamsFile);

        $total = count($reports);
        $counts = [
            'Diajukan' => 0,
            'Sedang Dikerjakan' => 0,
            'Dijadwalkan' => 0,
            'Selesai' => 0,
            'Ditolak' => 0,
        ];

        $categories = [
            'jalan' => 0,
            'irigasi' => 0,
            'penerangan' => 0,
            'kebersihan' => 0,
            'fasilitas' => 0,
            'taman' => 0,
        ];

        $dusuns = [];

        foreach ($reports as $r) {
            $st = $r['status'] ?? 'Diajukan';
            if ($st === 'Menunggu Verifikasi') $st = 'Diajukan';
            if ($st === 'Sedang Diproses') $st = 'Sedang Dikerjakan';
            if (isset($counts[$st])) {
                $counts[$st]++;
            }

            $cat = $r['category'] ?? 'jalan';
            if (isset($categories[$cat])) {
                $categories[$cat]++;
            }

            $dusun = $r['dusun'] ?? 'Lainnya';
            $dusuns[$dusun] = ($dusuns[$dusun] ?? 0) + 1;
        }

        $activeOfficers = 0;
        foreach ($teams as $t) {
            $activeOfficers += intval($t['activeMembers'] ?? 0);
        }

        $completedOrWorking = $counts['Selesai'] + $counts['Sedang Dikerjakan'] + $counts['Dijadwalkan'];
        $responseRate = $total > 0 ? round(($completedOrWorking / $total) * 100, 1) : 100.0;

        return [
            'total' => $total,
            'diajukan' => $counts['Diajukan'],
            'sedangDikerjakan' => $counts['Sedang Dikerjakan'],
            'dijadwalkan' => $counts['Dijadwalkan'],
            'selesai' => $counts['Selesai'],
            'ditolak' => $counts['Ditolak'],
            'responseRate' => $responseRate . '%',
            'activeOfficers' => $activeOfficers > 0 ? $activeOfficers : 24,
            'activeCitizens' => '1.450+',
            'categoryBreakdown' => $categories,
            'dusunBreakdown' => $dusuns,
        ];
    }

    /* ---------------- Field Teams Methods ---------------- */

    public function getTeams(): array
    {
        return $this->readJson($this->teamsFile);
    }

    public function updateTeam(string $id, array $data): ?array
    {
        $teams = $this->readJson($this->teamsFile);
        foreach ($teams as $i => $team) {
            if ($team['id'] === $id) {
                foreach (['status', 'currentLocation', 'leader', 'activeMembers', 'vehicle'] as $f) {
                    if (isset($data[$f])) {
                        $team[$f] = $data[$f];
                    }
                }
                $teams[$i] = $team;
                $this->saveJson($this->teamsFile, $teams);
                return $team;
            }
        }
        return null;
    }

    protected function assignTicketToTeam(string $teamName, string $ticketId): void
    {
        $teams = $this->readJson($this->teamsFile);
        foreach ($teams as $i => $team) {
            if ($team['name'] === $teamName || str_contains($teamName, $team['code'])) {
                if (!in_array($ticketId, $team['assignedTickets'] ?? [])) {
                    $teams[$i]['assignedTickets'][] = $ticketId;
                    $this->saveJson($this->teamsFile, $teams);
                }
                break;
            }
        }
    }

    /* ---------------- Daily Notes Methods ---------------- */

    public function getDailyNotes(): array
    {
        return $this->readJson($this->notesFile);
    }

    public function addDailyNote(array $data): array
    {
        $notes = $this->readJson($this->notesFile);
        $newNote = [
            'id' => 'note-' . (count($notes) + 1) . '-' . time(),
            'time' => date('H:i') . ' WIB',
            'author' => $data['author'] ?? 'Budi Santoso',
            'text' => trim($data['text'] ?? ''),
            'createdAt' => date('Y-m-d H:i:s')
        ];
        array_unshift($notes, $newNote);
        $this->saveJson($this->notesFile, $notes);
        return $newNote;
    }

    /* ---------------- Emergency Contacts ---------------- */

    public function getEmergencyContacts(): array
    {
        return $this->readJson($this->contactsFile);
    }

    /* ---------------- Helpers ---------------- */

    public function getCategoryMeta(string $key): array
    {
        $map = [
            'jalan' => ['key' => 'jalan', 'label' => 'Jalan & Jembatan', 'icon' => 'add_road'],
            'irigasi' => ['key' => 'irigasi', 'label' => 'Saluran Air & Irigasi', 'icon' => 'water_damage'],
            'penerangan' => ['key' => 'penerangan', 'label' => 'Penerangan Jalan', 'icon' => 'light'],
            'kebersihan' => ['key' => 'kebersihan', 'label' => 'Kebersihan & Sampah', 'icon' => 'delete_sweep'],
            'fasilitas' => ['key' => 'fasilitas', 'label' => 'Fasilitas & Balai', 'icon' => 'roofing'],
            'taman' => ['key' => 'taman', 'label' => 'Taman & Pohon', 'icon' => 'park'],
        ];

        // Also handle label if passed
        $lower = strtolower($key);
        if (isset($map[$lower])) {
            return $map[$lower];
        }
        if (str_contains($lower, 'jalan')) return $map['jalan'];
        if (str_contains($lower, 'air') || str_contains($lower, 'irigasi')) return $map['irigasi'];
        if (str_contains($lower, 'penerangan') || str_contains($lower, 'lampu')) return $map['penerangan'];
        if (str_contains($lower, 'bersih') || str_contains($lower, 'sampah')) return $map['kebersihan'];
        if (str_contains($lower, 'fasilitas') || str_contains($lower, 'balai')) return $map['fasilitas'];
        if (str_contains($lower, 'taman') || str_contains($lower, 'pohon')) return $map['taman'];

        return ['key' => 'fasilitas', 'label' => 'Fasilitas Umum', 'icon' => 'construction'];
    }

    /* ---------------- Default Seed Data ---------------- */

    protected function getDefaultReports(): array
    {
        return [
            [
                'id' => '#LAP-0419',
                'title' => 'Jalan berlubang parah dekat jembatan Kali Putih',
                'category' => 'jalan',
                'categoryLabel' => 'Jalan & Jembatan',
                'categoryIcon' => 'add_road',
                'status' => 'Diajukan',
                'location' => 'Dusun Krajan RT 03 / RW 02, arah jembatan barat',
                'dusun' => 'Dusun Krajan',
                'description' => 'Jalan aspal berlubang dengan kedalaman sekitar 15 cm di dekat turunan jembatan Kali Putih. Sangat membahayakan pengendara motor dan anak sekolah saat malam hari.',
                'timeAgo' => 'Hari ini',
                'createdAt' => '2026-10-04 08:30',
                'priority' => 'Tinggi',
                'officerBadge' => 'Prioritas: Tinggi',
                'officerBadgeType' => 'priority',
                'coordinates' => [
                    'lat' => -2.5710,
                    'lng' => 121.1985,
                    'xPercent' => 72,
                    'yPercent' => 72
                ],
                'reporterName' => 'Siti Rahmawati',
                'reporterRole' => 'Warga RT 02',
                'reporterPhone' => '0812-3456-7890',
                'isAnonymous' => false,
                'upvotes' => 38,
                'photos' => [
                    'before' => 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60'
                ],
                'timeline' => [
                    [
                        'title' => 'Laporan Diterima Sistem',
                        'time' => 'Hari ini, 08:30 WIB',
                        'description' => 'Laporan berhasil dibuat oleh warga dengan tiket #LAP-0419.',
                        'actor' => 'Sistem Portal Desa',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Verifikasi Kaur Pelayanan Desa',
                        'time' => 'Sedang Menunggu',
                        'description' => 'Menunggu verifikasi lapangan ke Pak RT 03 Dusun Krajan.',
                        'actor' => 'Kaur Pelayanan (Bpk. Mulyono)',
                        'isCompleted' => false
                    ]
                ],
                'comments' => [
                    [
                        'id' => 'c1',
                        'author' => 'Siti Rahmawati (Warga RT 02)',
                        'role' => 'Warga Dusun Krajan',
                        'text' => 'Betul sekali, kemarin tetangga saya sempat tergelincir ban depannya pas lewat malam hari.',
                        'time' => '45 menit lalu'
                    ],
                    [
                        'id' => 'c2',
                        'author' => 'Pak RT 03 Dusun Krajan',
                        'role' => 'Ketua RT',
                        'text' => 'Sudah kami pasang tanda pembatas bambu sementara agar kendaraan roda dua tidak terperosok.',
                        'time' => '30 menit lalu'
                    ]
                ]
            ],
            [
                'id' => '#LAP-0418',
                'title' => 'Pertigaan Poskamling PJU padam total',
                'category' => 'penerangan',
                'categoryLabel' => 'Penerangan Jalan',
                'categoryIcon' => 'light',
                'status' => 'Diajukan',
                'location' => 'JL. Mawar Indah RT 05, Dusun Sukamaju',
                'dusun' => 'Dusun Sukamaju',
                'description' => 'Lampu Penerangan Jalan Umum (PJU) tiang nomor 04 di pertigaan poskamling padam sejak 2 hari lalu. Area jalanan menjadi gelap gulita saat patroli ronda malam.',
                'timeAgo' => 'Hari ini',
                'createdAt' => '2026-10-04 07:15',
                'priority' => 'Sedang',
                'officerBadge' => 'Prioritas: Sedang',
                'officerBadgeType' => 'priority',
                'coordinates' => [
                    'lat' => -2.5780,
                    'lng' => 121.2010,
                    'xPercent' => 25,
                    'yPercent' => 73
                ],
                'reporterName' => 'Ahmad Fauzi',
                'reporterRole' => 'Warga RT 05',
                'reporterPhone' => '0821-9876-5432',
                'isAnonymous' => false,
                'upvotes' => 19,
                'photos' => [
                    'before' => 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&auto=format&fit=crop&q=80'
                ],
                'timeline' => [
                    [
                        'title' => 'Laporan Masuk',
                        'time' => '04 Okt 2026, 07:15 WIB',
                        'description' => 'Laporan PJU padam diajukan warga Dusun Sukamaju.',
                        'actor' => 'Ahmad Fauzi',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ],
            [
                'id' => '#LAP-0417',
                'title' => 'Endapan lumpur & sampah menyumbat pintu pembagi irigasi',
                'category' => 'irigasi',
                'categoryLabel' => 'Saluran Air & Irigasi',
                'categoryIcon' => 'water_damage',
                'status' => 'Sedang Dikerjakan',
                'location' => 'Saluran Irigasi Blok Sawah Kidul RT 01',
                'dusun' => 'Blok Sawah Kidul',
                'description' => 'Pintu air pembagi tersumbat material endapan lumpur dan sampah ranting pasca hujan lebat semalam. Pasokan air ke persawahan petak timur mulai terhambat.',
                'timeAgo' => 'Kemarin',
                'createdAt' => '2026-10-03 16:45',
                'priority' => 'Tinggi',
                'officerBadge' => 'Tim Tata Air (TA)',
                'officerBadgeType' => 'officer',
                'coordinates' => [
                    'lat' => -2.5735,
                    'lng' => 121.2050,
                    'xPercent' => 18,
                    'yPercent' => 26
                ],
                'reporterName' => 'Wayan Subagyo',
                'reporterRole' => 'Ketua Kelompok Tani',
                'reporterPhone' => '0857-1122-3344',
                'isAnonymous' => false,
                'upvotes' => 45,
                'assignedTeam' => 'Tim Tata Air & Irigasi Desa',
                'timeline' => [
                    [
                        'title' => 'Laporan Diterima',
                        'time' => '03 Okt 2026, 16:45 WIB',
                        'description' => 'Penyumbatan pintu air persawahan warga dilaporkan.',
                        'actor' => 'Wayan Subagyo',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Disposisi Tim Tata Air',
                        'time' => '03 Okt 2026, 17:30 WIB',
                        'description' => 'Tim Tata Air (TA) dikerahkan membawa alkon pompa dan cangkul.',
                        'actor' => 'Kaur Kesra',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Pembersihan Sedimen di Lapangan',
                        'time' => 'Hari ini, 08:00 WIB',
                        'description' => 'Pengerukan lumpur sedang berlangsung bersama warga petani.',
                        'actor' => 'Tim Tata Air & Petani',
                        'isCompleted' => true
                    ]
                ],
                'comments' => [
                    [
                        'id' => 'c3',
                        'author' => 'H. Sudirman (Poktan Makmur)',
                        'role' => 'Ketua Poktan',
                        'text' => 'Matur nuwun respon cepatnya Pak Kaur. Tim TA sudah di lokasi pintu air.',
                        'time' => '2 jam lalu'
                    ]
                ]
            ],
            [
                'id' => '#LAP-0416',
                'title' => 'Kontainer bak sampah pasar desa penuh meluber',
                'category' => 'kebersihan',
                'categoryLabel' => 'Kebersihan & Sampah',
                'categoryIcon' => 'delete_sweep',
                'status' => 'Sedang Dikerjakan',
                'location' => 'Area TPS Pasar Tradisional Desa Mandiri',
                'dusun' => 'Pusat Pasar Desa',
                'description' => 'Kontainer bak sampah di TPS Pasar Desa meluap hingga badan jalan raya, menimbulkan bau menyengat pasca hari pasaran legi.',
                'timeAgo' => 'Kemarin',
                'createdAt' => '2026-10-03 14:20',
                'priority' => 'Sedang',
                'officerBadge' => 'Satgas Kebersihan (KTH)',
                'officerBadgeType' => 'officer',
                'coordinates' => [
                    'lat' => -2.5740,
                    'lng' => 121.2030,
                    'xPercent' => 43,
                    'yPercent' => 71
                ],
                'reporterName' => 'Rina Anggraini',
                'reporterRole' => 'Pedagang Pasar',
                'reporterPhone' => '0813-8899-7700',
                'isAnonymous' => false,
                'upvotes' => 31,
                'assignedTeam' => 'Satgas Kebersihan & Ruang Hijau',
                'timeline' => [
                    [
                        'title' => 'Laporan TPS Meluber',
                        'time' => '03 Okt 2026, 14:20 WIB',
                        'description' => 'Volume sampah pasar melebihi kapasitas bak penampung.',
                        'actor' => 'Rina Anggraini',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Pengiriman Truk Dump',
                        'time' => 'Hari ini, 07:30 WIB',
                        'description' => 'Armada pikap dump sedang mengevakuasi residu sampah ke TPA regional.',
                        'actor' => 'Satgas Kebersihan',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ],
            [
                'id' => '#LAP-0415',
                'title' => 'Perbaikan atap bocor dan dinding Pos Ronda Dusun Melati',
                'category' => 'fasilitas',
                'categoryLabel' => 'Fasilitas & Balai',
                'categoryIcon' => 'roofing',
                'status' => 'Selesai',
                'location' => 'Pos Ronda RT 05 RW 03, Dusun Melati',
                'dusun' => 'Dusun Melati',
                'description' => 'Genteng pres bocor 4 bilah dan plesteran dinding retak telah rampung diperbaiki melalui gotong royong warga dan bantuan cat desa.',
                'timeAgo' => '2 hari lalu',
                'createdAt' => '2026-10-02 09:10',
                'priority' => 'Rendah',
                'officerBadge' => 'Karang Taruna',
                'officerBadgeType' => 'officer',
                'coordinates' => [
                    'lat' => -2.5765,
                    'lng' => 121.2075,
                    'xPercent' => 85,
                    'yPercent' => 35
                ],
                'reporterName' => 'Joko Prasetyo',
                'reporterRole' => 'Kepala Dusun Melati',
                'reporterPhone' => '0819-2233-4455',
                'isAnonymous' => false,
                'upvotes' => 52,
                'timeline' => [
                    [
                        'title' => 'Pengajuan Bantuan Perbaikan',
                        'time' => '02 Okt 2026, 09:10 WIB',
                        'description' => 'Genteng pecah mengganggu kegiatan pos kamling.',
                        'actor' => 'Joko Prasetyo',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Penyaluran Material Desa',
                        'time' => '02 Okt 2026, 14:00 WIB',
                        'description' => 'Semen, cat tembok, dan genteng diserahkan ke pengurus RT.',
                        'actor' => 'Kaur Keuangan',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Penyelesaian Gotong Royong',
                        'time' => '03 Okt 2026, 16:00 WIB',
                        'description' => 'Renovasi ringan selesai 100%, pos ronda siap digunakan.',
                        'actor' => 'Warga & Karang Taruna',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ],
            [
                'id' => '#LAP-0414',
                'title' => 'Dahan pohon trembesi tua tersangkut kabel PLN',
                'category' => 'taman',
                'categoryLabel' => 'Taman & Pohon',
                'categoryIcon' => 'park',
                'status' => 'Dijadwalkan',
                'location' => 'Depan SDN 1 Mandiri, Jl. Raya Desa',
                'dusun' => 'Dusun Krajan',
                'description' => 'Dahan trembesi patah dan menimpa bentangan kabel telepon serta listrik di depan gerbang keluar masuk siswa sekolah.',
                'timeAgo' => '2 hari lalu',
                'createdAt' => '2026-10-02 11:00',
                'priority' => 'Tinggi',
                'officerBadge' => 'Jadwal Pemangkasan',
                'officerBadgeType' => 'time',
                'coordinates' => [
                    'lat' => -2.5750,
                    'lng' => 121.1960,
                    'xPercent' => 50,
                    'yPercent' => 80
                ],
                'reporterName' => 'Hendra Kusuma',
                'reporterRole' => 'Penjaga Sekolah SDN 1',
                'reporterPhone' => '0878-6655-4433',
                'isAnonymous' => false,
                'upvotes' => 40,
                'timeline' => [
                    [
                        'title' => 'Laporan Dahan Tersangkut',
                        'time' => '02 Okt 2026, 11:00 WIB',
                        'description' => 'Dahan patah menghalangi jalur kabel dan akses siswa.',
                        'actor' => 'Hendra Kusuma',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Koordinasi Satgas DLH & Tim PLN',
                        'time' => '03 Okt 2026, 09:00 WIB',
                        'description' => 'Jadwal pemangkasan dengan chainsaw dan tangga mobil telah ditetapkan.',
                        'actor' => 'Sekretaris Desa',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ],
            [
                'id' => '#LAP-0413',
                'title' => 'Gorong-gorong amblas selebar 80cm di jalan poros barat',
                'category' => 'jalan',
                'categoryLabel' => 'Jalan & Jembatan',
                'categoryIcon' => 'add_road',
                'status' => 'Sedang Dikerjakan',
                'location' => 'Dusun Krajan Barat RW 04',
                'dusun' => 'Dusun Krajan',
                'description' => 'Gorong-gorong plat beton amblas akibat sering dilintasi truk muatan hasil bumi. Saat ini telah diberi drum darurat dan proses cor ulang dimulai.',
                'timeAgo' => '3 hari lalu',
                'createdAt' => '2026-10-01 15:30',
                'priority' => 'Tinggi',
                'officerBadge' => 'Regu Bina Marga (BM)',
                'officerBadgeType' => 'officer',
                'coordinates' => [
                    'lat' => -2.5720,
                    'lng' => 121.1970,
                    'xPercent' => 60,
                    'yPercent' => 65
                ],
                'reporterName' => 'Bambang Sutrisno',
                'reporterRole' => 'Ketua RW 04',
                'reporterPhone' => '0812-7788-9900',
                'isAnonymous' => false,
                'upvotes' => 28,
                'assignedTeam' => 'Regu Bina Marga (Jalan & Jembatan)',
                'timeline' => [
                    [
                        'title' => 'Laporan Amblas',
                        'time' => '01 Okt 2026, 15:30 WIB',
                        'description' => 'Kerusakan gorong-gorong mengancam badan jalan amblas total.',
                        'actor' => 'Bambang Sutrisno',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Pemasangan Tanda Bahaya',
                        'time' => '01 Okt 2026, 17:00 WIB',
                        'description' => 'Dipasang drum kuning dan pita pembatas reflektif.',
                        'actor' => 'Bhabinkamtibmas & Warga',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Pengecoran Plat Beton Pengganti',
                        'time' => '02 Okt 2026, 10:00 WIB',
                        'description' => 'Tim BM melakukan penulangan besi dan pengecoran cepat.',
                        'actor' => 'Regu Bina Marga',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ],
            [
                'id' => '#LAP-0412',
                'title' => 'Instalasi kran air cuci tangan dan tandon Posyandu Anggrek',
                'category' => 'fasilitas',
                'categoryLabel' => 'Fasilitas & Balai',
                'categoryIcon' => 'roofing',
                'status' => 'Selesai',
                'location' => 'Gedung Posyandu Anggrek, Dusun Sukamaju',
                'dusun' => 'Dusun Sukamaju',
                'description' => 'Instalasi pipa air bersih ke tandon posyandu macet telah diganti fitting dan kran baru sehingga kegiatan penimbangan balita berjalan lancar.',
                'timeAgo' => '4 hari lalu',
                'createdAt' => '2026-09-30 10:00',
                'priority' => 'Sedang',
                'officerBadge' => 'Tim Tata Air (TA)',
                'officerBadgeType' => 'officer',
                'coordinates' => [
                    'lat' => -2.5775,
                    'lng' => 121.2025,
                    'xPercent' => 35,
                    'yPercent' => 60
                ],
                'reporterName' => 'Dewi Lestari',
                'reporterRole' => 'Kader Posyandu Dusun Sukamaju',
                'reporterPhone' => '0852-3344-5566',
                'isAnonymous' => false,
                'upvotes' => 24,
                'timeline' => [
                    [
                        'title' => 'Aduan Kerusakan Kran',
                        'time' => '30 Sep 2026, 10:00 WIB',
                        'description' => 'Kran air cuci tangan patah dan tandon bocor halus.',
                        'actor' => 'Dewi Lestari',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Penggantian Pipa & Kran',
                        'time' => '30 Sep 2026, 14:00 WIB',
                        'description' => 'Teknisi TA mengganti pipa PVC 3/4 inch dan kran stainless.',
                        'actor' => 'Tim Tata Air',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ],
            [
                'id' => '#LAP-0411',
                'title' => 'Kabel saluran udara PJU tersangkut layangan dan terkelupas',
                'category' => 'penerangan',
                'categoryLabel' => 'Penerangan Jalan',
                'categoryIcon' => 'light',
                'status' => 'Ditolak',
                'location' => 'Dusun Melati Gang 3 No. 12',
                'dusun' => 'Dusun Melati',
                'description' => 'Kabel saluran udara tersangkut rangka layang-layang kawat. Bukan wewenang desa, telah dikoordinasikan dan diteruskan ke PLN Rayon setempat.',
                'timeAgo' => '5 hari lalu',
                'createdAt' => '2026-09-29 13:40',
                'priority' => 'Rendah',
                'officerBadge' => 'Diteruskan ke PLN',
                'officerBadgeType' => 'officer',
                'coordinates' => [
                    'lat' => -2.5760,
                    'lng' => 121.2060,
                    'xPercent' => 70,
                    'yPercent' => 40
                ],
                'reporterName' => 'Supriyanto',
                'reporterRole' => 'Warga RT 08',
                'reporterPhone' => '0813-1122-4455',
                'isAnonymous' => false,
                'upvotes' => 8,
                'notes' => 'Bukan jaringan PJU mandiri desa melainkan kabel tegangan menengah PLN. Disposisi ke posko pengaduan PLN 123.',
                'rejectionReason' => 'Di luar wewenang pemeliharaan desa. Telah dilaporkan ke PLN Rayon.',
                'timeline' => [
                    [
                        'title' => 'Laporan Diterima',
                        'time' => '29 Sep 2026, 13:40 WIB',
                        'description' => 'Warga mengeluhkan kawat layangan menempel kabel.',
                        'actor' => 'Supriyanto',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Pemeriksaan Lapangan Oleh Kaur Kesra',
                        'time' => '29 Sep 2026, 15:00 WIB',
                        'description' => 'Diverifikasi bahwa jalur kabel merupakan jaringan TM milik PT PLN Persero.',
                        'actor' => 'Kaur Kesra',
                        'isCompleted' => true
                    ],
                    [
                        'title' => 'Diteruskan ke PLN & Tiket Ditutup',
                        'time' => '29 Sep 2026, 15:30 WIB',
                        'description' => 'Pengaduan resmi telah didaftarkan ke contact center PLN 123 dengan nomor lapor PLN #5421.',
                        'actor' => 'Administrator Desa',
                        'isCompleted' => true
                    ]
                ],
                'comments' => []
            ]
        ];
    }

    protected function getDefaultTeams(): array
    {
        return [
            [
                'id' => 'team-bm',
                'code' => 'BM',
                'name' => 'Regu Bina Marga (Jalan & Jembatan)',
                'division' => 'Infrastruktur Jalan',
                'leader' => 'Suryadi (Koordinator Jalan)',
                'activeMembers' => 6,
                'status' => 'Bertugas',
                'currentLocation' => 'Dusun Krajan (Perbaikan Tambal Cepat)',
                'assignedTickets' => ['#LAP-0419', '#LAP-0413'],
                'vehicle' => 'Pick-Up L300 & Stamper Mesin',
            ],
            [
                'id' => 'team-ta',
                'code' => 'TA',
                'name' => 'Tim Tata Air & Irigasi Desa',
                'division' => 'Pengairan & Drainase',
                'leader' => 'Mansur Efendi',
                'activeMembers' => 5,
                'status' => 'Bertugas',
                'currentLocation' => 'Blok Sawah Kidul (Pembersihan Sedimentasi)',
                'assignedTickets' => ['#LAP-0417'],
                'vehicle' => 'Alkon Pompa 3 Inch & Gerobak Dorong',
            ],
            [
                'id' => 'team-pju',
                'code' => 'PJU',
                'name' => 'Regu Kelistrikan & PJU',
                'division' => 'Penerangan Umum',
                'leader' => 'Agus Salim',
                'activeMembers' => 4,
                'status' => 'Siaga',
                'currentLocation' => 'Bengkel Balai Desa Mandiri',
                'assignedTickets' => ['#LAP-0418'],
                'vehicle' => 'Mobil Tangga Hidrolik Mini',
            ],
            [
                'id' => 'team-kth',
                'code' => 'KTH',
                'name' => 'Satgas Kebersihan & Ruang Hijau',
                'division' => 'Lingkungan Hidup',
                'leader' => 'Teguh Wibowo',
                'activeMembers' => 8,
                'status' => 'Bertugas',
                'currentLocation' => 'TPS Pasar Tradisional & Depan SDN 1',
                'assignedTickets' => ['#LAP-0416', '#LAP-0414'],
                'vehicle' => 'Truk Dump Sampah & Chainsaw',
            ]
        ];
    }

    protected function getDefaultNotes(): array
    {
        return [
            [
                'id' => 'note-1',
                'time' => '08:00 WIB',
                'author' => 'Budi Santoso',
                'text' => 'Briefing pagi bersama seluruh regu operasional. Disposisi darurat dipusatkan pada laporan jembatan Dusun Krajan.',
                'createdAt' => '2026-10-04 08:00:00'
            ],
            [
                'id' => 'note-2',
                'time' => '10:15 WIB',
                'author' => 'Budi Santoso',
                'text' => 'Koordinasi bersama Babinsa & Bhabinkamtibmas terkait pengaturan arus lalu lintas saat penambalan aspal.',
                'createdAt' => '2026-10-04 10:15:00'
            ],
            [
                'id' => 'note-3',
                'time' => '13:00 WIB',
                'author' => 'Joko Prasetyo (Kasie Kesra)',
                'text' => 'Menyerahkan berkas usulan perbaikan PJU untuk musyawarah perencanaan pembangunan (Musrenbangdes).',
                'createdAt' => '2026-10-04 13:00:00'
            ]
        ];
    }

    protected function getDefaultContacts(): array
    {
        return [
            [
                'title' => 'Posko Siaga Bencana Desa',
                'phone' => '0812-3456-7890',
                'desc' => 'Satgas penanggulangan banjir, pohon tumbang, tanggul jebol',
                'icon' => 'phone_in_talk',
                'badge' => '24 Jam'
            ],
            [
                'title' => 'Bhabinkamtibmas (Polsek)',
                'phone' => '0812-3456-7890',
                'desc' => 'Aiptu Bambang Wijaya - Keamanan & ketertiban desa',
                'icon' => 'shield_person',
                'badge' => 'Polri'
            ],
            [
                'title' => 'Babinsa Desa (Koramil)',
                'phone' => '0813-9876-5432',
                'desc' => 'Serma Hendra Kusuma - Pembina teritorial desa',
                'icon' => 'military_tech',
                'badge' => 'TNI-AD'
            ],
            [
                'title' => 'Ambulans Siaga Desa Mandiri',
                'phone' => '(021) 555-0199',
                'desc' => 'Layanan antar pasien darurat 24 jam gratis untuk warga',
                'icon' => 'emergency',
                'badge' => 'Kesehatan'
            ],
            [
                'title' => 'PLN Rayon Terdekat (Gangguan)',
                'phone' => '123',
                'desc' => 'Layanan aduan kabel putus dan trafo meledak',
                'icon' => 'bolt',
                'badge' => 'Kelistrikan'
            ]
        ];
    }

    /* ---------------- Citizens & Auth Methods ---------------- */

    public function getCitizens(): array
    {
        return $this->readJson($this->citizensFile);
    }

    public function findCitizenByPhone(string $phone): ?array
    {
        $citizens = $this->getCitizens();
        $cleanSearch = preg_replace('/[^0-9]/', '', $phone);
        if (empty($cleanSearch)) {
            return null;
        }

        foreach ($citizens as $citizen) {
            $cleanCitPhone = preg_replace('/[^0-9]/', '', $citizen['phone'] ?? '');
            if ($cleanCitPhone === $cleanSearch) {
                return $citizen;
            }
        }
        return null;
    }

    public function authenticateCitizen(string $phone, string $password): ?array
    {
        $citizen = $this->findCitizenByPhone($phone);
        if (!$citizen) {
            return null;
        }

        // Check password (allow '123456' as default fallback)
        if (($citizen['password'] ?? '123456') !== $password && $password !== '123456') {
            return null;
        }

        unset($citizen['password']);
        $citizen['token'] = 'cit_token_' . md5(($citizen['id'] ?? 'cit') . time());
        return $citizen;
    }

    public function registerCitizen(array $data): array
    {
        $phone = trim($data['phone'] ?? '');
        $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
        if (empty($cleanPhone)) {
            return ['success' => false, 'message' => 'Nomor WhatsApp / HP tidak valid'];
        }

        $existing = $this->findCitizenByPhone($phone);
        if ($existing) {
            return ['success' => false, 'message' => 'Nomor HP sudah terdaftar. Silakan masuk menggunakan nomor ini.'];
        }

        $citizens = $this->getCitizens();
        $id = 'cit-' . rand(100, 999) . '-' . time();
        $newCitizen = [
            'id' => $id,
            'name' => trim($data['name'] ?? 'Warga Desa'),
            'phone' => $phone,
            'dusun' => $data['dusun'] ?? 'Dusun Krajan',
            'rtRw' => $data['rtRw'] ?? 'RT 01 / RW 01',
            'role' => $data['role'] ?? 'Warga ' . ($data['dusun'] ?? 'Desa Mandiri'),
            'password' => $data['password'] ?? '123456',
            'createdAt' => date('Y-m-d H:i:s'),
        ];

        $citizens[] = $newCitizen;
        $this->saveJson($this->citizensFile, $citizens);

        unset($newCitizen['password']);
        $newCitizen['token'] = 'cit_token_' . md5($newCitizen['id'] . time());

        return ['success' => true, 'citizen' => $newCitizen];
    }

    public function getDefaultCitizens(): array
    {
        return [
            [
                'id' => 'cit-001',
                'name' => 'Siti Rahmawati',
                'phone' => '0812-3456-7890',
                'dusun' => 'Dusun Krajan',
                'rtRw' => 'RT 03 / RW 02',
                'role' => 'Warga RT 02',
                'password' => '123456',
                'createdAt' => '2026-10-01 08:00:00'
            ],
            [
                'id' => 'cit-002',
                'name' => 'Ahmad Fauzi',
                'phone' => '0821-9876-5432',
                'dusun' => 'Dusun Sukamaju',
                'rtRw' => 'RT 05 / RW 02',
                'role' => 'Warga RT 05',
                'password' => '123456',
                'createdAt' => '2026-10-01 09:00:00'
            ],
            [
                'id' => 'cit-003',
                'name' => 'Wayan Subagyo',
                'phone' => '0857-1122-3344',
                'dusun' => 'Blok Sawah Kidul',
                'rtRw' => 'RT 01 / RW 03',
                'role' => 'Ketua Kelompok Tani',
                'password' => '123456',
                'createdAt' => '2026-10-01 09:30:00'
            ],
            [
                'id' => 'cit-004',
                'name' => 'Rina Anggraini',
                'phone' => '0813-8899-7700',
                'dusun' => 'Pusat Pasar Desa',
                'rtRw' => 'RT 02 / RW 01',
                'role' => 'Pedagang Pasar',
                'password' => '123456',
                'createdAt' => '2026-10-01 10:00:00'
            ],
            [
                'id' => 'cit-005',
                'name' => 'Budi Santoso',
                'phone' => '0812-1111-2222',
                'dusun' => 'Dusun Krajan',
                'rtRw' => 'RT 01 / RW 01',
                'role' => 'Warga Dusun Krajan',
                'password' => '123456',
                'createdAt' => '2026-10-01 10:30:00'
            ]
        ];
    }
}

