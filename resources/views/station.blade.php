<x-standard-layout>
    <x-navbar></x-navbar>

    <h1>{{ $radioStation->name }}</h1>

    <button id="play-button" data-url="{{ $radioStation->url }}">Play</button>
    <button id="pause-button">Pause</button>

</x-standard-layout>
