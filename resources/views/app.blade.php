<!DOCTYPE html>
<html data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <script>
      (function() {
        try {
          var t = localStorage.getItem('theme') || 'dark';
          document.documentElement.setAttribute('data-theme', t);
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      })();
    </script>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @routes
    @inertiaHead
  </head>
  <body>
    @inertia
  </body>
</html>
