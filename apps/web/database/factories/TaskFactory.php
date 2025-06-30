<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $priorities = ['normal', 'resident', 'emergency'];
        
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'priority' => $this->faker->randomElement($priorities),
            'due_date' => $this->faker->optional(0.8)->dateTimeBetween('now', '+30 days'),
            'completed_at' => $this->faker->optional(0.3)->dateTimeBetween('-7 days', 'now'),
            'modified_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the task is pending (not completed).
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => null,
        ]);
    }

    /**
     * Indicate that the task is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'completed_at' => $this->faker->dateTimeBetween('-7 days', 'now'),
        ]);
    }

    /**
     * Indicate that the task has emergency priority.
     */
    public function emergency(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'emergency',
        ]);
    }

    /**
     * Indicate that the task has resident priority.
     */
    public function resident(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'resident',
        ]);
    }

    /**
     * Indicate that the task has normal priority.
     */
    public function normal(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => 'normal',
        ]);
    }
}
