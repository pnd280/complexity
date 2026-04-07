if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
  Write-Host "Please run PowerShell as administrator and try again." -ForegroundColor Red
  return
}

$policyPath = "HKLM:\\SOFTWARE\\Policies\\Perplexity\\Comet"
$hostPattern = "*://*.perplexity.ai"
$disableFeaturesFlag = "--disable-features=ExtensionManifestV2Unsupported,ExtensionManifestV2Disabled"

$shortcutFolder = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs"

function Find-CometShortcuts {
  $shortcuts = @()
  if (Test-Path $shortcutFolder) {
    $shortcuts = Get-ChildItem -Path $shortcutFolder -Recurse -Filter "*.lnk" -ErrorAction SilentlyContinue | 
                 Where-Object { $_.Name -like "*comet*" -or $_.Name -like "*Comet*" }
  }
  return $shortcuts
}

function Test-PolicyInstalled {
  if (-not (Test-Path $policyPath)) {
    return $false
  }
  $settings = Get-ItemProperty -Path $policyPath -Name "ExtensionSettings" -ErrorAction SilentlyContinue
  if ($null -eq $settings) {
    return $false
  }
  return $settings.ExtensionSettings -like "*$hostPattern*"
}

function Test-ShortcutFlagInstalled {
  $shortcuts = Find-CometShortcuts
  foreach ($shortcut in $shortcuts) {
    try {
      $shell = New-Object -ComObject WScript.Shell
      $lnk = $shell.CreateShortcut($shortcut.FullName)
      if ($lnk.Arguments -and $lnk.Arguments -match [regex]::Escape($disableFeaturesFlag)) {
        $lnk = $null
        return $true
      }
      $lnk = $null
    } catch {}
  }
  return $false
}

function Install-Policy {
  if (-not (Test-Path $policyPath)) {
    New-Item -Path $policyPath -Force | Out-Null
  }

  $extensionSettings = '{"*":{"runtime_allowed_hosts":["*://*.perplexity.ai"],"runtime_blocked_hosts":[]}}'
  New-ItemProperty -Path $policyPath -Name "ExtensionSettings" -Value $extensionSettings -PropertyType String -Force | Out-Null
}

function Uninstall-Policy {
  Remove-ItemProperty -Path $policyPath -Name "ExtensionSettings" -ErrorAction SilentlyContinue
}

function Install-ShortcutFlag {
  $shortcuts = Find-CometShortcuts
  
  if ($shortcuts.Count -eq 0) {
    Write-Host "No Comet shortcuts found in $shortcutFolder" -ForegroundColor Yellow
    return
  }
  
  foreach ($shortcut in $shortcuts) {
    try {
      $shell = New-Object -ComObject WScript.Shell
      $lnk = $shell.CreateShortcut($shortcut.FullName)
      
      if (-not $lnk.Arguments -or $lnk.Arguments -notmatch [regex]::Escape($disableFeaturesFlag)) {
        if ($lnk.Arguments) {
          $lnk.Arguments = "$($lnk.Arguments) $disableFeaturesFlag"
        } else {
          $lnk.Arguments = $disableFeaturesFlag
        }
        $lnk.Save()
        Write-Host "Modified shortcut(s) successfully" -ForegroundColor Green
      }
      
      $lnk = $null
    } catch {
      Write-Host "Failed to modify shortcut(s)" -ForegroundColor Red
    }
  }
}

function Uninstall-ShortcutFlag {
  $shortcuts = Find-CometShortcuts
  
  if ($shortcuts.Count -eq 0) {
    Write-Host "No Comet shortcuts found in $shortcutFolder" -ForegroundColor Yellow
    return
  }
  
  foreach ($shortcut in $shortcuts) {
    try {
      $shell = New-Object -ComObject WScript.Shell
      $lnk = $shell.CreateShortcut($shortcut.FullName)
      
      if ($lnk.Arguments -and $lnk.Arguments -match [regex]::Escape($disableFeaturesFlag)) {
        $lnk.Arguments = $lnk.Arguments -replace [regex]::Escape($disableFeaturesFlag), "" -replace "\s{2,}", " " -replace "^\s+|\s+$", ""
        $lnk.Save()
        Write-Host "Restored shortcut(s) successfully" -ForegroundColor Green
      }
      
      $lnk = $null
    } catch {
      Write-Host "Failed to restore shortcut(s)" -ForegroundColor Red
    }
  }
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "           Comet ManifestV2 + perplexity.ai Enabler" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

$policyEnabled = Test-PolicyInstalled
$shortcutEnabled = Test-ShortcutFlagInstalled

if ($policyEnabled -and $shortcutEnabled) {
  Write-Host "Status: ENABLED" -ForegroundColor Green
  Write-Host "  - Extensions on perplexity.ai: ENABLED"
  Write-Host "  - ManifestV2 flag on shortcuts: ENABLED"
  Write-Host ""
  $confirm = Read-Host "Disable both? [y/N]"
  if ($confirm -match "^[yY]") {
    Uninstall-Policy
    Uninstall-ShortcutFlag
    Write-Host ""
    Write-Host "Disabled. Restart Comet browser." -ForegroundColor Green
  } else {
    Write-Host "Cancelled."
  }
} else {
  Write-Host "Status: DISABLED" -ForegroundColor Red
  Write-Host "  - Extensions on perplexity.ai: DISABLED"
  Write-Host "  - ManifestV2 flag on shortcuts: DISABLED"
  Write-Host ""
  $confirm = Read-Host "Enable both? [Y/n]"
  if ($confirm -match "^[nN]") {
    Write-Host "Cancelled."
  } else {
    Install-Policy
    Install-ShortcutFlag
    Write-Host ""
    Write-Host "Enabled. Restart Comet browser." -ForegroundColor Green
  }
}
