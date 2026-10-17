<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ManagerController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Manager');
    }
}
