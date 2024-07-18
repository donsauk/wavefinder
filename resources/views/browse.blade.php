<x-standard-layout>
    <x-navbar></x-navbar>

    <h1>Radio Stations</h1>

    <ul>
        @foreach ($stations as $station)
            <li>{{ $station->name }} - {{ $station->url }}</li>
        @endforeach
    </ul>

    {{ $stations->links('vendor.pagination.custom') }} <!-- Use custom pagination links with daisyUI -->
</x-standard-layout>
