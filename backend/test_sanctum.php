<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Contracts\Console\Kernel;

$user = User::first();

if ($user) {
    $token = $user->createToken('test-token');
    echo "Token created successfully!\n";
    echo 'Token: '.$token->accessToken."\n";

    // Clean up
    $user->tokens()->delete();
    echo "Tokens cleaned up.\n";
} else {
    echo "No users found in database.\n";
}
