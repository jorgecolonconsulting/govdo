<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have users to assign as modifiers
        $users = User::all();
        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please seed users first.');
            return;
        }

        $tasks = [
            [
                'title' => 'Send winter weather alert to residents',
                'description' => 'Draft and distribute emergency notification about incoming snowstorm. Include road closure information and emergency contact numbers.',
                'priority' => 'emergency',
                'due_date' => Carbon::now()->addDays(1),
                'completed_at' => null,
            ],
            [
                'title' => 'Update website with new parking regulations',
                'description' => 'Post the new downtown parking restrictions that take effect next month. Include enforcement schedule and fine structure.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addWeeks(2),
                'completed_at' => null,
            ],
            [
                'title' => 'Send water quality report to EPA',
                'description' => 'Compile quarterly water testing results and submit required documentation to state environmental agency.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addDays(10),
                'completed_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Town hall meeting announcement',
                'description' => 'Create announcement for next month\'s town hall meeting. Include agenda items: budget review, new park proposal, traffic concerns.',
                'priority' => 'resident',
                'due_date' => Carbon::now()->addDays(7),
                'completed_at' => null,
            ],
            [
                'title' => 'School zone speed camera notice',
                'description' => 'Inform residents about new speed enforcement cameras in school zones. Include activation date and fine information.',
                'priority' => 'resident',
                'due_date' => Carbon::now()->addDays(14),
                'completed_at' => null,
            ],
            [
                'title' => 'Summer recreation program registration',
                'description' => 'Open registration for summer youth programs. Include schedules, costs, and required documentation.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addMonths(1),
                'completed_at' => null,
            ],
            [
                'title' => 'Road construction delays notification',
                'description' => 'Alert residents about Main Street construction project delays. Provide updated timeline and alternate routes.',
                'priority' => 'resident',
                'due_date' => Carbon::now()->addDays(3),
                'completed_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Property tax assessment appeals deadline',
                'description' => 'Remind property owners of the upcoming deadline to file assessment appeals. Include required forms and contact information.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addDays(21),
                'completed_at' => null,
            ],
            [
                'title' => 'Emergency evacuation route updates',
                'description' => 'Update emergency evacuation maps and distribute to all households. Coordinate with fire department for accuracy.',
                'priority' => 'emergency',
                'due_date' => Carbon::now()->addDays(5),
                'completed_at' => null,
            ],
            [
                'title' => 'Library closure for renovations',
                'description' => 'Announce temporary library closure for HVAC system upgrades. Provide information about mobile library services.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addWeeks(3),
                'completed_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Voter registration drive announcement',
                'description' => 'Promote upcoming voter registration events at community centers. Include dates, times, and required documentation.',
                'priority' => 'resident',
                'due_date' => Carbon::now()->addDays(12),
                'completed_at' => null,
            ],
            [
                'title' => 'New recycling guidelines',
                'description' => 'Educate residents about updated recycling procedures and collection schedule changes effective next quarter.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addMonths(2),
                'completed_at' => null,
            ],
            [
                'title' => 'Gas leak emergency response plan',
                'description' => 'Coordinate with utility company on emergency response protocols. Update resident notification procedures.',
                'priority' => 'emergency',
                'due_date' => Carbon::now()->addDays(2),
                'completed_at' => Carbon::now()->subHours(6),
            ],
            [
                'title' => 'Senior center activity schedule',
                'description' => 'Publish monthly activity calendar for senior center programs including fitness classes and social events.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addDays(25),
                'completed_at' => null,
            ],
            [
                'title' => 'Budget public hearing notice',
                'description' => 'Legal notice for annual budget hearing. Must be published in local newspaper and posted online 30 days in advance.',
                'priority' => 'resident',
                'due_date' => Carbon::now()->addDays(4),
                'completed_at' => null,
            ],
            [
                'title' => 'Water main break repair update',
                'description' => 'Status update on Elm Street water main repair. Include estimated completion time and service restoration.',
                'priority' => 'emergency',
                'due_date' => Carbon::now()->addHours(8),
                'completed_at' => Carbon::now()->subMinutes(30),
            ],
            [
                'title' => 'Business license renewal reminders',
                'description' => 'Send renewal notices to all registered businesses. Include deadlines, fees, and required documentation.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addWeeks(6),
                'completed_at' => null,
            ],
            [
                'title' => 'Community garden plot applications',
                'description' => 'Open applications for community garden plots. Include plot sizes, fees, and gardening guidelines.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addDays(18),
                'completed_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Snow removal equipment inspection',
                'description' => 'Coordinate pre-season inspection of all snow removal equipment. Schedule maintenance and operator training.',
                'priority' => 'resident',
                'due_date' => Carbon::now()->addDays(30),
                'completed_at' => null,
            ],
            [
                'title' => 'City council meeting minutes publication',
                'description' => 'Prepare and publish official minutes from last council meeting. Ensure compliance with public records requirements.',
                'priority' => 'normal',
                'due_date' => Carbon::now()->addDays(6),
                'completed_at' => Carbon::now()->subDays(1),
            ],
        ];

        foreach ($tasks as $taskData) {
            Task::create([
                'title' => $taskData['title'],
                'description' => $taskData['description'],
                'priority' => $taskData['priority'],
                'due_date' => $taskData['due_date'],
                'completed_at' => $taskData['completed_at'],
                'modified_by' => $users->random()->id,
            ]);
        }

        $this->command->info('Created ' . count($tasks) . ' demo tasks with realistic government communication scenarios.');
    }
}
