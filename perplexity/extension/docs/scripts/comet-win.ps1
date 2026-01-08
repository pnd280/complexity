if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
  Write-Host "Please run PowerShell as administrator and try again." -ForegroundColor Red
  return
}

$policyPath = "HKLM:\SOFTWARE\Policies\Chromium"
$hostPattern = "*://*.perplexity.ai"

function Test-Installed {
  if (-not (Test-Path $policyPath)) {
    return $false
  }
  $settings = Get-ItemProperty -Path $policyPath -Name "ExtensionSettings" -ErrorAction SilentlyContinue
  if ($null -eq $settings) {
    return $false
  }
  return $settings.ExtensionSettings -like "*$hostPattern*"
}

function Install-Policy {
  if (Test-Installed) {
    Write-Host "Already enabled."
    return
  }

  if (-not (Test-Path $policyPath)) {
    New-Item -Path $policyPath -Force | Out-Null
  }

  $extensionSettings = '{"*":{"runtime_allowed_hosts":["*://*.perplexity.ai"],"runtime_blocked_hosts":[]}}'
  New-ItemProperty -Path $policyPath -Name "ExtensionSettings" -Value $extensionSettings -PropertyType String -Force | Out-Null

  Write-Host "Enabled. Restart browser." -ForegroundColor Green
}

function Uninstall-Policy {
  Remove-ItemProperty -Path $policyPath -Name "ExtensionSettings" -ErrorAction SilentlyContinue
  Write-Host "Disabled. Restart browser." -ForegroundColor Green
}

Write-Host ""
if (Test-Installed) {
  Write-Host "Extensions on perplexity.ai: ENABLED"
  Write-Host ""
  $confirm = Read-Host "Disable? [y/N]"
  if ($confirm -match "^[yY]") {
    Uninstall-Policy
  } else {
    Write-Host "Cancelled."
  }
} else {
  Write-Host "Extensions on perplexity.ai: DISABLED"
  Write-Host ""
  $confirm = Read-Host "Enable? [Y/n]"
  if ($confirm -match "^[nN]") {
    Write-Host "Cancelled."
  } else {
    Install-Policy
  }
}
