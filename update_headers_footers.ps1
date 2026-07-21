$targetFiles = @(
    "index.html",
    "north-india.html",
    "south-india.html",
    "east-india.html",
    "west-india.html",
    "kashmir-escape.html",
    "himachal-explorer.html",
    "kerala-retreat.html",
    "meghalaya-discovery.html",
    "rajasthan-royal-circuit.html"
)

# Load index.html to extract the unified header
$indexContent = Get-Content -Raw "index.html"
$headerRegex = "(?s)<!-- TopNavBar -->.*?</header>\s*<!-- Mobile Top Header \(Simplified\) -->.*?</header>"
$unifiedHeader = [regex]::match($indexContent, $headerRegex).Value

# Update links in unified header
$unifiedHeader = $unifiedHeader -replace 'href="[^"]*"([^>]*)>Home</a>', 'href="index.html"$1>Home</a>'
$unifiedHeader = $unifiedHeader -replace 'href="[^"]*"([^>]*)>North India\s*<span([^>]*)>expand_more</span></a>', 'href="north-india.html"$1>North India <span$2>expand_more</span></a>'
$unifiedHeader = $unifiedHeader -replace 'href="[^"]*"([^>]*)>South India\s*<span([^>]*)>expand_more</span></a>', 'href="south-india.html"$1>South India <span$2>expand_more</span></a>'
$unifiedHeader = $unifiedHeader -replace '<button([^>]*)>\s*East India\s*<span([^>]*)>expand_more</span>\s*</button>', '<a href="east-india.html"$1>East India <span$2>expand_more</span></a>'
$unifiedHeader = $unifiedHeader -replace '<button([^>]*)>\s*West India\s*<span([^>]*)>expand_more</span>\s*</button>', '<a href="west-india.html"$1>West India <span$2>expand_more</span></a>'

# Extract footer and bottom nav from south-india.html
$sourceContent = Get-Content -Raw "south-india.html"
$footerRegex = "(?s)<!-- Footer -->.*?</footer>"
$unifiedFooter = [regex]::match($sourceContent, $footerRegex).Value
$bottomNavRegex = "(?s)<!-- BottomNavBar \(Mobile Only\) -->.*?</div>(?=\s*</body>)"
$bottomNav = [regex]::match($sourceContent, $bottomNavRegex).Value

foreach ($file in $targetFiles) {
    Write-Host "Processing $file"
    $content = Get-Content -Raw $file
    
    # Replace header. Some files have <!-- TopNavBar -->, some might just have <header ...> ... </header>
    if ($content -match "(?s)<!-- TopNavBar -->.*?</header>\s*<!-- Mobile Top Header \(Simplified\) -->.*?</header>") {
        $content = $content -replace "(?s)<!-- TopNavBar -->.*?</header>\s*<!-- Mobile Top Header \(Simplified\) -->.*?</header>", $unifiedHeader
    } elseif ($content -match "(?s)<!-- TopNavBar -->.*?</header>") {
        $content = $content -replace "(?s)<!-- TopNavBar -->.*?</header>", $unifiedHeader
    } elseif ($content -match "(?s)<header.*?</header>\s*<header.*?</header>") {
        # some files have 2 headers
        $content = $content -replace "(?s)<header.*?</header>\s*<header.*?</header>", $unifiedHeader
    } elseif ($content -match "(?s)<header.*?</header>") {
        $content = $content -replace "(?s)<header.*?</header>", $unifiedHeader
    }
    
    # Process Footer
    if ($content -match "(?s)<!-- Footer -->.*?</footer>") {
        $content = $content -replace "(?s)<!-- Footer -->.*?</footer>", $unifiedFooter
    } elseif ($content -match "(?s)<footer.*?</footer>") {
        $content = $content -replace "(?s)<footer.*?</footer>", $unifiedFooter
    } else {
        # Insert before </body> if no footer
        $content = $content -replace "</body>", "`n$unifiedFooter`n</body>"
    }

    # Process BottomNav
    if ($content -match "(?s)<!-- BottomNavBar \(Mobile Only\) -->.*?</div>(?=\s*</body>)") {
        $content = $content -replace "(?s)<!-- BottomNavBar \(Mobile Only\) -->.*?</div>(?=\s*</body>)", "$bottomNav`n"
    } else {
        # Insert before </body> if no bottom nav
        $content = $content -replace "</body>", "`n$bottomNav`n</body>"
    }

    # Save
    Set-Content -Path $file -Value $content -Encoding utf8
}
Write-Host "All files processed."
