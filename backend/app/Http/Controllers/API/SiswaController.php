<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $siswa = Siswa::all();
        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil diambil',
            'data' => $siswa
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nis' => 'required|string|unique:siswas',
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_telp' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            $filename = time() . '.' . $foto->getClientOriginalExtension();
            $foto->storeAs('public/siswa', $filename);
            $data['foto'] = $filename;
        }

        $siswa = Siswa::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil ditambahkan',
            'data' => $siswa
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $siswa = Siswa::find($id);

        if (!$siswa) {
            return response()->json([
                'status' => false,
                'message' => 'Data siswa tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Detail data siswa',
            'data' => $siswa
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $siswa = Siswa::find($id);

        if (!$siswa) {
            return response()->json([
                'status' => false,
                'message' => 'Data siswa tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nis' => 'required|string|unique:siswas,nis,' . $id,
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'required|string',
            'no_telp' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();

        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($siswa->foto) {
                Storage::delete('public/siswa/' . $siswa->foto);
            }

            $foto = $request->file('foto');
            $filename = time() . '.' . $foto->getClientOriginalExtension();
            $foto->storeAs('public/siswa', $filename);
            $data['foto'] = $filename;
        }

        $siswa->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil diperbarui',
            'data' => $siswa
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $siswa = Siswa::find($id);

        if (!$siswa) {
            return response()->json([
                'status' => false,
                'message' => 'Data siswa tidak ditemukan'
            ], 404);
        }

        // Hapus foto jika ada
        if ($siswa->foto) {
            Storage::delete('public/siswa/' . $siswa->foto);
        }

        $siswa->delete();

        return response()->json([
            'status' => true,
            'message' => 'Data siswa berhasil dihapus'
        ]);
    }
}
