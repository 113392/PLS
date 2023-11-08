<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QRCodePatientSeeder extends Seeder
{
    public function run()
    {
        $patients = DB::table('patient')->get();

        foreach ($patients as $patient) {
            DB::table('qr_code_patient')->insert([
                'qr_login' => 'dein_qr_login_wert',
                'registration_time' => now(),
                'patient_idpatient' => $patient->idpatient,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}

 