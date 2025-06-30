<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create the basic table structure
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->enum('priority', ['normal', 'resident', 'emergency'])->default('normal');
            $table->date('due_date')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('modified_by')->constrained('users');
            $table->timestamps();

            $table->index(['completed_at', 'due_date']);
            $table->index('modified_by');
            $table->index('priority');
        });

        // Add system versioning along with generated columns and period in a single statement
        DB::statement(
            "ALTER TABLE tasks
                ADD COLUMN row_start TIMESTAMP(6) GENERATED ALWAYS AS ROW START,
                ADD COLUMN row_end TIMESTAMP(6) GENERATED ALWAYS AS ROW END,
                ADD PERIOD FOR SYSTEM_TIME (row_start, row_end),
                ADD SYSTEM VERSIONING"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Very important to happen before dropping the system versioning
        DB::statement('SET @@system_versioning_alter_history = 1');

        // With MariaDB, we must drop the versioning and the generated columns in one statement.
        DB::statement('ALTER TABLE tasks DROP SYSTEM VERSIONING, DROP COLUMN row_start, DROP COLUMN row_end');

        // Drop the table
        Schema::dropIfExists('tasks');
    }
};
