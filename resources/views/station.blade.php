<x-standard-layout>
    <x-navbar></x-navbar>

    <h1>{{ $radioStation->name }}</h1>

    <audio controls>
        <source src="{{ $radioStation->url }}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>

    <p>{{ $radioStation->description }}</p> <!-- Assuming the station has a description field -->
</x-standard-layout>
