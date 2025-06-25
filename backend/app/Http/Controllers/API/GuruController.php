<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class GuruController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guru = Guru::with('mapel')->get();
        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil diambil',
            'data' => $guru
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nip' => 'required|string|unique:gurus',
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_telp' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'mapel_id' => 'required|exists:mapels,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            $filename = time() . '.' . $foto->getClientOriginalExtension();
            $foto->storeAs('public/guru', $filename);
            $data['foto'] = $filename;
        }

        $guru = Guru::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil ditambahkan',
            'data' => $guru
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $guru = Guru::with('mapel')->find($id);

        if (!$guru) {
            return response()->json([
                'status' => false,
                'message' => 'Data guru tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Detail data guru',
            'data' => $guru
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $guru = Guru::find($id);

        if (!$guru) {
            return response()->json([
                'status' => false,
                'message' => 'Data guru tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nip' => 'required|string|unique:gurus,nip,' . $id,
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_telp' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'mapel_id' => 'required|exists:mapels,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($guru->foto) {
                Storage::delete('public/guru/' . $guru->foto);
            }

            $foto = $request->file('foto');
            $filename = time() . '.' . $foto->getClientOriginalExtension();
            $foto->storeAs('public/guru', $filename);
            $data['foto'] = $filename;
        }

        $guru->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil diperbarui',
            'data' => $guru
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $guru = Guru::find($id);

        if (!$guru) {
            return response()->json([
                'status' => false,
                'message' => 'Data guru tidak ditemukan'
            ], 404);
        }

        // Hapus foto jika ada
        if ($guru->foto) {
            Storage::delete('public/guru/' . $guru->foto);
        }

        $guru->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data guru berhasil dihapus'
        ]);
    }
}
