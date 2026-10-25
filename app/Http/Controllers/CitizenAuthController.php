<?php

namespace App\Http\Controllers;

use App\Services\JsonDataService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CitizenAuthController extends Controller
{
    protected JsonDataService $service;

    public function __construct(JsonDataService $service)
    {
        $this->service = $service;
    }

    /**
     * Citizen login by WhatsApp / Phone & PIN
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'password' => 'nullable|string'
        ]);

        $password = $validated['password'] ?? '123456';
        $citizen = $this->service->authenticateCitizen($validated['phone'], $password);

        if (!$citizen) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor HP tidak terdaftar atau kata sandi tidak cocok. Silakan daftar akun baru atau gunakan akun demo.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Berhasil masuk sebagai warga desa',
            'user' => $citizen
        ]);
    }

    /**
     * Citizen register
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'phone' => 'required|string|max:30',
            'dusun' => 'required|string|max:100',
            'rtRw' => 'nullable|string|max:50',
            'role' => 'nullable|string|max:100',
            'password' => 'nullable|string|min:4'
        ]);

        $result = $this->service->registerCitizen($validated);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran warga berhasil!',
            'user' => $result['citizen']
        ], 201);
    }

    /**
     * List demo accounts for easy 1-click testing
     */
    public function demoAccounts(): JsonResponse
    {
        $citizens = $this->service->getDefaultCitizens();
        // Remove passwords before returning
        $safeCitizens = array_map(function ($c) {
            unset($c['password']);
            return $c;
        }, $citizens);

        return response()->json($safeCitizens);
    }

    /**
     * Get current citizen profile
     */
    public function me(Request $request): JsonResponse
    {
        $phone = $request->header('X-Citizen-Phone') ?? $request->query('phone');
        if (!$phone) {
            return response()->json(['message' => 'Sesi warga belum aktif'], 401);
        }

        $citizen = $this->service->findCitizenByPhone($phone);
        if (!$citizen) {
            return response()->json(['message' => 'Data warga tidak ditemukan'], 404);
        }

        unset($citizen['password']);
        return response()->json($citizen);
    }
}
