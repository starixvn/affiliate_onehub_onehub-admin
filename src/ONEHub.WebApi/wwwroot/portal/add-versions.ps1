$version = "20251022"
$portalPath = "D:\Nexdev\onehub-admin-net9\src\ONEHub.WebApi\wwwroot\portal"

$htmlFiles = Get-ChildItem -Path $portalPath -Filter "*.html" -Exclude "login.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    
    $cssPatterns = @(
        '/dist/style/portalmain.css"',
        '/dist/style/layout.css"',
        '/dist/style/12bet.css"',
        '/dist/style/home.css"',
        '/dist/style/operation.css"',
        '/dist/style/report.css"',
        '/dist/style/message.css"',
        '/dist/style/customer.css"',
        '/dist/style/domain.css"',
        '/dist/style/administrator.css"',
        '/dist/style/affiliate-info.css"',
        '/dist/style/landing-page.css"',
        '/dist/style/media-gallery.css"'
    )
    
    $jsPatterns = @(
        '/dist/jquery-3.3.1.min.js"',
        '/dist/vendors/react.js"',
        '/dist/vendors/moment.js"',
        '/dist/vendors/bootstrap.js"',
        '/portal/common/common-config.js"',
        '/portal/common/auth-guard.js"',
        '/dist/js/pages/layout/pagelayout.js"'
    )
    
    foreach ($pattern in $cssPatterns) {
        $newPattern = $pattern.Replace('"', "?v=$version`"")
        $content = $content -replace [regex]::Escape($pattern), $newPattern
    }
    
    foreach ($pattern in $jsPatterns) {
        $newPattern = $pattern.Replace('"', "?v=$version`"")
        $content = $content -replace [regex]::Escape($pattern), $newPattern
    }
    
    Set-Content -Path $file.FullName -Value $content
    Write-Host "Updated: $($file.Name)"
}

Write-Host "Done! All files updated with version $version"

