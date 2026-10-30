# Multi-port Local Web Server
$listener = New-Object System.Net.HttpListener

$ports = @(3000, 5000)
foreach ($p in $ports) {
    try {
        $listener.Prefixes.Add("http://localhost:$p/")
        $listener.Prefixes.Add("http://127.0.0.1:$p/")
    } catch {
        Write-Warning "Could not bind to port $p"
    }
}

try {
    $listener.Start()
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "🚀 MyRepublic Purwokerto Hub - React JS Server" -ForegroundColor Green
    Write-Host "Tersedia di:" -ForegroundColor Yellow
    Write-Host "  👉 http://localhost:3000/" -ForegroundColor White
    Write-Host "  👉 http://localhost:5000/" -ForegroundColor White
    Write-Host "Tekan Ctrl+C untuk menghentikan server." -ForegroundColor Gray
    Write-Host "=================================================" -ForegroundColor Cyan

    while ($listener.IsListening) {
        $context = $null
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            $urlPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "/" -or $urlPath -eq "index.html") {
                $distPath = Join-Path $PSScriptRoot "dist\index.html"
                $urlPath = if (Test-Path $distPath) { "dist\index.html" } else { "react-app.html" }
            }

            $filePath = Join-Path $PSScriptRoot $urlPath

            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".jsx"  { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".svg"  { "image/svg+xml" }
                    default { "application/octet-stream" }
                }

                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.AddHeader("Pragma", "no-cache")
                $response.AddHeader("Expires", "0")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $urlPath")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        } catch {
            # Ignore client disconnects and transient stream errors
        } finally {
            if ($context -and $context.Response) {
                try { $context.Response.Close() } catch {}
            }
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
