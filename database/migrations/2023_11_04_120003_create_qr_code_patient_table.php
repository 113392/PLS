<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {

        Schema::create('qr_code_patient', function (Blueprint $table) {
            $table->id('idqr_code_login');
            $table->longText('qr_login');
            $table->dateTime('first_login')->nullable();
            $table->unsignedBigInteger('patient_idpatient')->nullable();
            $table->foreign('patient_idpatient')->references('idpatient')->on('patient');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->foreign('user_id')->references('iduser')->on('user');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('qr_code_patient');
    }
};
