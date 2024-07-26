<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;

class RadioStationController extends Controller
{
    public function index($page = 1)
    {
        $perPage = 10;
        $stations = RadioStation::paginate($perPage, ['*'], 'page', $page);

        $stations->setPath(url('browse'));

        return view('browse', ['stations' => $stations]);
    }

    public function show($slug)
    {
        $radioStation = RadioStation::where('slug', $slug)->firstOrFail();

        return view('station', ['radioStation' => $radioStation]);
    }
}
