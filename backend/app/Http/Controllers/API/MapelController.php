<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MapelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mapel = Mapel::all();
        return response()->json([
            'status' => true,
            'message' => 'Data mata pelajaran berhasil diambil',
            'data' => $mapel
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'kode_mapel' => 'required|string|unique:mapels',
            'nama_mapel' => 'required|string',
            'deskripsi' => 'nullable|string',
            'sks' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $mapel = Mapel::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data mata pelajaran berhasil ditambahkan',
            'data' => $mapel
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mapel = Mapel::with('gurus')->find($id);

        if (!$mapel) {
            return response()->json([
                'status' => false,
                'message' => 'Data mata pelajaran tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Detail data mata pelajaran',
            'data' => $mapel
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $mapel = Mapel::find($id);

        if (!$mapel) {
            return response()->json([
                'status' => false,
                'message' => 'Data mata pelajaran tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'kode_mapel' => 'required|string|unique:mapels,kode_mapel,' . $id,
            'nama_mapel' => 'required|string',
            'deskripsi' => 'nullable|string',
            'sks' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $mapel->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Data mata pelajaran berhasil diperbarui',
            'data' => $mapel
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mapel = Mapel::find($id);

        if (!$mapel) {
            return response()->json([
                'status' => false,
                'message' => 'Data mata pelajaran tidak ditemukan'
            ], 404);
        }

        // Cek apakah mata pelajaran masih digunakan oleh guru
        if ($mapel->gurus()->count() > 0) {
            return response()->json([
                'status' => false,
                'message' => 'Mata pelajaran tidak dapat dihapus karena masih digunakan oleh guru'
            ], 400);
        }

        $mapel->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data mata pelajaran berhasil dihapus'
        ]);
    }
}
