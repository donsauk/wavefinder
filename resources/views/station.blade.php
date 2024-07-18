<x-standard-layout>
    <x-navbar></x-navbar>

    <h1>{{ $station->name }}</h1>

    <audio controls>
        <source src="{{ $station->url }}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>

    <p>{{ $station->description }}</p> <!-- Assuming the station has a description field -->
</x-standard-layout>
