<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attractions', function (Blueprint $table) {
            $table->string('slug', 150)->nullable()->unique()->after('name');
            $table->unsignedBigInteger('created_by')->nullable()->after('opening_hours');
        });

        DB::statement('ALTER TABLE attractions ADD CONSTRAINT fk_attractions_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT');
    }

    public function down(): void
    {
        Schema::table('attractions', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn(['slug', 'created_by']);
        });
    }
};
