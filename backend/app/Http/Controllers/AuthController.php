<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'Pending',
            'active' => true,
        ]);

        if ($request->role === 'Driver') {
            Driver::create([
                'user_id' => $user->user_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'city_id' => $request->city_id,
                'license_number' => $request->license_number,
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Login user and return token.
     */
    public function login(LoginUserRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Logout user (revoke current token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    /**
     * Issue a new API token for the authenticated user.
     */
    public function issueToken(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'nullable|array',
            'abilities.*' => 'string|max:255',
        ]);

        $user = Auth::user();
        $token = $user->createToken(
            $request->name,
            $request->abilities ?? ['*']
        );

        return response()->json([
            'token' => $token->plainTextToken,
            'token_id' => $token->accessToken->id,
            'name' => $token->accessToken->name,
            'abilities' => $token->accessToken->abilities,
            'created_at' => $token->accessToken->created_at->toISOString(),
        ], 201);
    }

    /**
     * Revoke a specific API token.
     */
    public function revokeToken(Request $request, int $tokenId): JsonResponse
    {
        $user = Auth::user();
        $token = $user->tokens()->where('id', $tokenId)->first();

        if (!$token) {
            return response()->json(['message' => 'Token not found'], 404);
        }

        $token->delete();

        return response()->json(['message' => 'Token revoked successfully']);
    }

    /**
     * List all API tokens for the authenticated user.
     */
    public function listTokens(Request $request): JsonResponse
    {
        $user = Auth::user();
        $tokens = $user->tokens()->select('id', 'name', 'abilities', 'last_used_at', 'expires_at', 'created_at')->get();

        return response()->json([
            'tokens' => $tokens,
        ]);
    }

    /**
     * Revoke all API tokens for the authenticated user.
     */
    public function revokeAllTokens(Request $request): JsonResponse
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json(['message' => 'All tokens revoked successfully']);
    }
}
