<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $admin->createToken('auth_token')->plainTextToken;

        return response()->json([
            'data' => $admin,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function login(Request $request)
    {
        Log::info('Login attempt', $request->only('email'));
        
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            Log::warning('Login validation failed', $validator->errors()->toArray());
            return response()->json($validator->errors(), 422);
        }

        // Coba login langsung dengan model Admin
        $admin = Admin::where('email', $request->email)->first();
        
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            Log::warning('Login failed for email: ' . $request->email);
            return response()->json([
                'message' => 'Email atau password salah',
            ], 401);
        }

        $token = $admin->createToken('auth_token')->plainTextToken;
        Log::info('Login success for email: ' . $request->email);

        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'data' => $admin,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout success',
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }
}
