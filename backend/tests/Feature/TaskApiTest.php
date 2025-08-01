<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Task;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function a_task_can_be_created_through_the_api()
    {
        $taskData = [
            'name' => 'Prueba de testeo',
            'completed' => false,
        ];

        $response = $this->postJson('/api/task', $taskData);

        $response->assertStatus(201);
        $response->assertJson([
            'name' => 'Prueba de testeo',
            'completed' => false,
        ]);
        $this->assertDatabaseHas('task', $taskData);
    }

    public function all_tasks_can_be_retrieved_through_the_api()
    {
        Task::factory()->count(3)->create();

        $response = $this->getJson('/api/task');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function a_single_task_can_be_retrieved_by_id()
    {
        $task = Task::factory()->create();

        $response = $this->getJson("/api/task/{$task->id}");

        $response->assertStatus(200);
        $response->assertJson(['name' => $task->name]);
    }

    public function a_task_can_be_updated_through_the_api()
    {
        $task = Task::factory()->create();
        $updatedName = 'Nombre de tarea actualizado';

        $response = $this->patchJson("/api/task/{$task->id}", ['name' => $updatedName]);

        $response->assertStatus(200);
        $response->assertJson(['name' => $updatedName]);
        $this->assertDatabaseHas('task', ['id' => $task->id, 'name' => $updatedName]);
    }

    public function a_task_can_be_deleted_through_the_api()
    {
        $task = Task::factory()->create();

        $response = $this->deleteJson("/api/task/{$task->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('task', ['id' => $task->id]);
    }

    public function tasks_can_be_filtered_by_completion_status()
    {
        Task::factory()->count(2)->create(['completed' => true]);
        Task::factory()->count(3)->create(['completed' => false]);

        $response = $this->getJson('/api/task?completed=true');

        $response->assertStatus(200);
        $response->assertJsonCount(2);
        $response->assertJsonMissing(['completed' => false]);
    }

    public function tasks_can_be_searched_by_name()
    {
        Task::factory()->create(['name' => 'Prueba de búsqueda']);
        Task::factory()->create(['name' => 'Otra tarea']);

        $response = $this->getJson('/api/task?search=búsqueda');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['name' => 'Prueba de búsqueda']);
    }

    public function task_creation_requires_a_name()
    {
        $response = $this->postJson('/api/task', ['name' => null]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }
}