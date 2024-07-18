<?php

namespace App\Http\Controllers;

use App\Models\RadioStation;

class RadioStationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  int  $page
     * @return \Illuminate\Http\Response
     */
    public function index($page = 1)
    {
        $perPage = 10; // Number of items per page
        $stations = RadioStation::paginate($perPage, ['*'], 'page', $page);

        // Set custom path for pagination links
        $stations->setPath(url('browse'));

        return view('browse', ['stations' => $stations]);
    }
}
