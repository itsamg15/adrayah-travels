$indexContent = Get-Content -Raw "index.html"
$modalRegex = "(?s)<div class=`"fixed inset-0[^>]*id=`"modal-container`">.*?</div>\s*<!-- Scripts for Interactions -->.*?</script>"
$modalBlock = [regex]::match($indexContent, $modalRegex).Value

if (-not $modalBlock) {
    Write-Host "Failed to extract modal block!"
    exit
}

$files = Get-ChildItem -Filter *.html
foreach ($f in $files) {
    if ($f.Name -ne "index.html") {
        $content = Get-Content -Raw $f.FullName
        # remove existing modal block if it exists (so we don't duplicate)
        if ($content -match "(?s)<div class=`"fixed inset-0[^>]*id=`"modal-container`">.*?</div>\s*<!-- Scripts for Interactions -->.*?</script>") {
            $content = $content -replace "(?s)<div class=`"fixed inset-0[^>]*id=`"modal-container`">.*?</div>\s*<!-- Scripts for Interactions -->.*?</script>", $modalBlock
        } else {
            # Insert before <!-- Footer -->
            $content = $content -replace "(?s)<!-- Footer -->", "$modalBlock`n<!-- Footer -->"
        }
        Set-Content -Path $f.FullName -Value $content -Encoding utf8
        Write-Host "Injected modal into $($f.Name)"
    }
}
Write-Host "All files processed."
