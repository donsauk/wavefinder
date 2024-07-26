<x-standard-layout>
    <x-navbar></x-navbar>

    <h1>Radio Stations</h1>

    <ul>
        @foreach ($stations as $station)
            <li>
                <a href="{{ url('station/' . $station->slug) }}">{{ $station->name }}</a> - {{ $station->url }}
            </li>
        @endforeach
    </ul>

    {{ $stations->links('vendor.pagination.custom') }}
</x-standard-layout>
