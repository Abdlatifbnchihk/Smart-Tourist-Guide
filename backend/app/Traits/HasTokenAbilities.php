<?php

namespace App\Traits;

use App\Enums\TokenAbility;
use Illuminate\Http\JsonResponse;
use Laravel\Sanctum\NewAccessToken;

trait HasTokenAbilities
{
    /**
     * Create a token with abilities based on user role.
     */
    public function createTokenForRole(string $name, string $role): NewAccessToken
    {
        $user = $this->user ?? auth()->user();
        $abilities = TokenAbility::forRole($role);

        return $user->createToken($name, $abilities);
    }

    /**
     * Check if the current token has a specific ability.
     */
    public function tokenCan(string $ability): bool
    {
        $user = $this->user ?? auth()->user();

        if (!$user || !$user->currentAccessToken()) {
            return false;
        }

        return $user->currentAccessToken()->can($ability);
    }

    /**
     * Check if the current token has any of the given abilities.
     */
    public function tokenCanAny(array $abilities): bool
    {
        $user = $this->user ?? auth()->user();

        if (!$user || !$user->currentAccessToken()) {
            return false;
        }

        return $user->currentAccessToken()->canAny($abilities);
    }

    /**
     * Check if the current token has all of the given abilities.
     */
    public function tokenCanAll(array $abilities): bool
    {
        $user = $this->user ?? auth()->user();

        if (!$user || !$user->currentAccessToken()) {
            return false;
        }

        return $user->currentAccessToken()->canAll($abilities);
    }

    /**
     * Require a specific ability or return 403.
     */
    public function requireAbility(string $ability): JsonResponse|true
    {
        if (!$this->tokenCan($ability)) {
            return response()->json([
                'message' => 'Unauthorized. Token lacks required ability.',
                'required_ability' => $ability,
            ], 403);
        }

        return true;
    }

    /**
     * Require any of the given abilities or return 403.
     */
    public function requireAnyAbility(array $abilities): JsonResponse|true
    {
        if (!$this->tokenCanAny($abilities)) {
            return response()->json([
                'message' => 'Unauthorized. Token lacks required abilities.',
                'required_abilities' => $abilities,
            ], 403);
        }

        return true;
    }
}
