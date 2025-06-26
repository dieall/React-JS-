<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guru extends Model
{
    use HasFactory;

    protected $fillable = [
        'nip',
        'nama',
        'jenis_kelamin',
        'alamat',
        'no_telp',
        'tanggal_lahir',
        'foto',
        'mapel_id'
    ];

    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }
}
