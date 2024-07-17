<x-standard-layout>
    <x-navbar>
    </x-navbar>
    <div class="relative h-[33vh]">
        <img src="{{ asset('images/hero.jpg') }}" alt="Hero Image" class="w-full h-full object-cover opacity-50">
        <div class="absolute inset-0 flex w-full">
            <div class="flex flex-1 items-center justify-center">
                <h1 class="text-7xl text-center">{{ config('app.name', 'Laravel') }}</h1>
            </div>
            <div class="flex flex-1 items-center justify-center">
                <p class="text-xl text-center">Some text about the project. Some text about the project. Some text about the project. Some text about the project.</p>
            </div>
        </div>
    </div>
    </div>

    <x-theme-select>

    </x-theme-select>

</x-standard-layout>
