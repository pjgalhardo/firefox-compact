# Compact Comfort for Firefox - CSS setup, derived from rs4t/firefox-compact (MIT)
# Download and review this script before running it.
#
# Adds compact.css to your Firefox profile and imports it at the top of
# userChrome.css and userContent.css. Works alongside any theme: existing
# files are kept, and only the one @import line is added.

function Install-CompactModeCss {
    $ErrorActionPreference = 'Stop'
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

    $cssUrl = 'https://raw.githubusercontent.com/pjgalhardo/firefox-compact/main/extension/compact.css'
    $importLine = '@import "compact.css";'
    $utf8 = New-Object Text.UTF8Encoding $false

    Write-Host ''
    Write-Host '  Compact Comfort setup' -ForegroundColor Magenta
    Write-Host ''

    $ffDir = Join-Path $env:APPDATA 'Mozilla\Firefox'
    $ini = Join-Path $ffDir 'profiles.ini'
    if (-not (Test-Path $ini)) {
        Write-Host '  Could not find Firefox. Open Firefox once, close it, then run this again.' -ForegroundColor Red
        return
    }

    $sections = @{}
    $current = $null
    foreach ($line in Get-Content $ini) {
        if ($line -match '^\[(.+)\]\s*$') {
            $current = $Matches[1]
            $sections[$current] = @{}
        } elseif ($current -and $line -match '^([^=]+)=(.*)$') {
            $sections[$current][$Matches[1].Trim()] = $Matches[2].Trim()
        }
    }

    # The [Install...] sections hold the profile each Firefox install really uses;
    # the Default=1 flag on [Profile...] sections is often stale.
    $candidates = @($sections.Keys | Where-Object { $_ -like 'Install*' } |
        ForEach-Object { $sections[$_]['Default'] } | Where-Object { $_ })
    if (-not $candidates) {
        $candidates = @($sections.Values | Where-Object { $_['Default'] -eq '1' -and $_['Path'] } |
            ForEach-Object { $_['Path'] })
    }

    $profiles = @($candidates | ForEach-Object {
        if ([IO.Path]::IsPathRooted($_)) { $_ } else { Join-Path $ffDir ($_ -replace '/', '\') }
    } | Where-Object { Test-Path $_ } | Select-Object -Unique)

    if ($profiles.Count -eq 0) {
        Write-Host '  Could not find your Firefox profile folder.' -ForegroundColor Red
        return
    }

    $profileDir = $profiles[0]
    if ($profiles.Count -gt 1) {
        Write-Host '  Found more than one Firefox profile:'
        for ($i = 0; $i -lt $profiles.Count; $i++) {
            Write-Host "    [$($i + 1)] $($profiles[$i])"
        }
        $choice = Read-Host '  Which one do you want to set up? (number)'
        $index = 0
        if (-not [int]::TryParse($choice, [ref]$index) -or $index -lt 1 -or $index -gt $profiles.Count) {
            Write-Host '  Invalid choice, nothing was changed.' -ForegroundColor Red
            return
        }
        $profileDir = $profiles[$index - 1]
    }
    Write-Host "  Profile: $profileDir"

    $chromeDir = Join-Path $profileDir 'chrome'
    New-Item -ItemType Directory -Force -Path $chromeDir | Out-Null

    Invoke-WebRequest -UseBasicParsing -Uri $cssUrl -OutFile (Join-Path $chromeDir 'compact.css')
    Write-Host '  Downloaded compact.css.'

    $backupDir = Join-Path $chromeDir ('backup-compact-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
    foreach ($name in 'userChrome.css', 'userContent.css') {
        $path = Join-Path $chromeDir $name
        if (-not (Test-Path $path)) {
            [IO.File]::WriteAllText($path, "$importLine`r`n", $utf8)
            Write-Host "  Created $name."
            continue
        }

        $text = [IO.File]::ReadAllText($path, $utf8)
        if ($text -match '@import\s+(url\()?\s*["'']?compact\.css') {
            Write-Host "  $name already imports compact.css."
            continue
        }

        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        Copy-Item $path $backupDir

        # @import must come before every other rule; only @charset may precede it.
        if ($text -match '^\s*@charset[^;]*;\s*\r?\n?') {
            $text = $text.Insert($Matches[0].Length, "$importLine`r`n")
        } else {
            $text = "$importLine`r`n" + $text
        }
        [IO.File]::WriteAllText($path, $text, $utf8)
        Write-Host "  Added the import line to $name."
    }
    if (Test-Path $backupDir) {
        Write-Host "  Backed up the changed files to: $backupDir"
    }

    $pref = 'toolkit.legacyUserProfileCustomizations.stylesheets'
    $userJs = Join-Path $profileDir 'user.js'
    $userJsText = if (Test-Path $userJs) { [IO.File]::ReadAllText($userJs, $utf8) } else { '' }
    if ($userJsText -notmatch [regex]::Escape("`"$pref`"")) {
        [IO.File]::AppendAllText($userJs, "`r`n// Compact Mode`r`nuser_pref(`"$pref`", true);`r`n", $utf8)
        Write-Host '  Turned on custom CSS in Firefox.'
    }

    Write-Host ''
    if (Get-Process firefox -ErrorAction SilentlyContinue) {
        Write-Host '  Done! Close Firefox completely and open it again.' -ForegroundColor Green
    } else {
        Write-Host '  Done! Open Firefox to use Compact Mode.' -ForegroundColor Green
    }
    Write-Host ''
}

Install-CompactModeCss
