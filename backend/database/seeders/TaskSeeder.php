<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Task; 

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
   {
        DB::table('task')->insert([
            ['name' => 'Calentamiento (10 minutos)', 'completed' => true],
            ['name' => 'Press de banca (3x10)', 'completed' => true],
            ['name' => 'Sentadilla (3x10)', 'completed' => true],
            ['name' => 'Dominadas (3x8)', 'completed' => true],
            ['name' => 'Remo con barra (3x10)', 'completed' => true],
            ['name' => 'Press militar (3x10)', 'completed' => true],
            ['name' => 'Curl de bíceps (3x12)', 'completed' => false],
            ['name' => 'Extensiones de tríceps (3x12)', 'completed' => false],
            ['name' => 'Zancadas (3x10 por pierna)', 'completed' => false],
            ['name' => 'Peso muerto rumano (3x10)', 'completed' => false],
            ['name' => 'Elevación de gemelos (3x15)', 'completed' => false],
            ['name' => 'Abdominales (3x20)', 'completed' => false],
            ['name' => 'Plancha (3x60 segundos)', 'completed' => false],
            ['name' => 'Estiramiento (10 minutos)', 'completed' => false],
            ['name' => 'Press de hombros con mancuernas (3x10)', 'completed' => false],
            ['name' => 'Remo al mentón (3x12)', 'completed' => false],
            ['name' => 'Fondos en paralelas (3x10)', 'completed' => false],
            ['name' => 'Prensa de piernas (3x10)', 'completed' => false],
            ['name' => 'Jalón al pecho (3x12)', 'completed' => false],
            ['name' => 'Hip thrust (3x10)', 'completed' => false],
            ['name' => 'Bíceps con barra Z (3x12)', 'completed' => false],
            ['name' => 'Tríceps en polea alta (3x12)', 'completed' => false],
            ['name' => 'Elevaciones laterales (3x15)', 'completed' => false],
            ['name' => 'Flexiones de pecho (3x15)', 'completed' => false],
            ['name' => 'Crunch abdominal (3x20)', 'completed' => false],
        ]);
    }
}
