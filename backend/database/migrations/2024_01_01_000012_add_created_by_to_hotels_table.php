<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->unsignedBigInteger('created_by')->nullable()->after('stars');
        });

        DB::statement('ALTER TABLE hotels ADD CONSTRAINT fk_hotels_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT');
    }

    public function down(): void
    {
        Schema::table('hotels', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
        });
    }
};
