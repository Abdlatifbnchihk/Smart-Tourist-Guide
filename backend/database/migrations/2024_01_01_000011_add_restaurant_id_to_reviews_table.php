<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $hasColumn = Schema::hasColumn('reviews', 'restaurant_id');
        $hasFK = DB::select("SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME = 'reviews' AND COLUMN_NAME = 'restaurant_id' AND REFERENCED_TABLE_NAME IS NOT NULL");

        Schema::table('reviews', function (Blueprint $table) use ($hasColumn) {
            if (!$hasColumn) {
                $table->foreignId('restaurant_id')->nullable()->index();
            }
        });

        if (!empty($hasFK)) return;

        DB::statement('ALTER TABLE `reviews` ADD CONSTRAINT `reviews_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE');
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['restaurant_id']);
            $table->dropColumn('restaurant_id');
        });
    }
};
