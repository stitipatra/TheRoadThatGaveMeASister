$projectRoot = $PSScriptRoot
$assetsPath = Join-Path $projectRoot "assets"
$outputPath = Join-Path $projectRoot "media-manifest.js"

$imageExtensions = @(".jpg", ".jpeg", ".png", ".webp", ".gif")
$videoExtensions = @(".mp4", ".m4v", ".webm", ".mov")
$audioExtensions = @(".mp3", ".ogg", ".wav", ".m4a")

$media = [ordered]@{}

Get-ChildItem -Path $assetsPath -Directory | Sort-Object Name | ForEach-Object {

    $folderName = $_.Name
    $folderPath = $_.FullName

    # Faces are used separately
    if ($folderName -eq "faces") {
        return
    }

    $photos = @()
    $videos = @()
    $voice = @()

    #
    # Photos
    #

    $photosPath = Join-Path $folderPath "photos"

    if (Test-Path $photosPath) {

        Get-ChildItem $photosPath -File |
        Sort-Object Name |
        Where-Object {
            $imageExtensions -contains $_.Extension.ToLower()
        } |
        ForEach-Object {

            $relativePath = $_.FullName.Substring($projectRoot.Length + 1)
            $relativePath = $relativePath.Replace("\", "/")

            $photos += [ordered]@{
                src = $relativePath
                caption = ""
            }
        }
    }

    #
    # Videos
    #

    $videosPath = Join-Path $folderPath "videos"

    if (Test-Path $videosPath) {

        Get-ChildItem $videosPath -File |
        Sort-Object Name |
        Where-Object {
            $videoExtensions -contains $_.Extension.ToLower()
        } |
        ForEach-Object {

            $relativePath = $_.FullName.Substring($projectRoot.Length + 1)
            $relativePath = $relativePath.Replace("\", "/")

            $videos += [ordered]@{
                src = $relativePath
                caption = ""
                type = "video/mp4"
            }
        }
    }

    #
    # Voice Notes
    #

    $audioPath = Join-Path $folderPath "audio"

    if (Test-Path $audioPath) {

        Get-ChildItem $audioPath -File |
        Sort-Object Name |
        Where-Object {
            $audioExtensions -contains $_.Extension.ToLower()
        } |
        ForEach-Object {

            $relativePath = $_.FullName.Substring($projectRoot.Length + 1)
            $relativePath = $relativePath.Replace("\", "/")

            $type = switch ($_.Extension.ToLower()) {
                ".mp3" { "audio/mpeg" }
                ".ogg" { "audio/ogg" }
                ".wav" { "audio/wav" }
                ".m4a" { "audio/mp4" }
                default { "audio/mpeg" }
            }

            $voice += [ordered]@{
                src = $relativePath
                caption = ""
                type = $type
            }
        }
    }

    $media[$folderName] = [ordered]@{
        photos = $photos
        videos = $videos
        voice = $voice
    }
}

$json = $media | ConvertTo-Json -Depth 10

$content = @"
const MEDIA = $json;
"@

Set-Content `
    -Path $outputPath `
    -Value $content `
    -Encoding UTF8

Write-Host ""
Write-Host "Media manifest generated successfully!" -ForegroundColor Green
Write-Host "Output: $outputPath"
Write-Host ""