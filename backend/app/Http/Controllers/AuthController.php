<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
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
