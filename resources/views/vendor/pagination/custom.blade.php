@if ($paginator->hasPages())
    <div class="join">
        {{-- Previous Page Link --}}
        @if ($paginator->onFirstPage())
            <button class="join-item btn" disabled>&lsaquo;</button>
        @else
            <a href="{{ url('browse/' . $paginator->currentPage() - 1) }}" class="join-item btn">&lsaquo;</a>
        @endif

        {{-- Pagination Elements --}}
        @foreach ($elements as $element)
            {{-- "Three Dots" Separator --}}
            @if (is_string($element))
                <button class="join-item btn" disabled>{{ $element }}</button>
            @endif

            {{-- Array Of Links --}}
            @if (is_array($element))
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <a href="{{ url('browse/' . $page) }}" class="join-item btn btn-active">{{ $page }}</a>
                    @else
                        <a href="{{ url('browse/' . $page) }}" class="join-item btn">{{ $page }}</a>
                    @endif
                @endforeach
            @endif
        @endforeach

        {{-- Next Page Link --}}
        @if ($paginator->hasMorePages())
            <a href="{{ url('browse/' . $paginator->currentPage() + 1) }}" class="join-item btn">&rsaquo;</a>
        @else
            <button class="join-item btn" disabled>&rsaquo;</button>
        @endif
    </div>
@endif
