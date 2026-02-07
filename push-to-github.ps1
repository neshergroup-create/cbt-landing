# Replace YOUR_GITHUB_USERNAME with your actual GitHub username, then run this script in PowerShell:
# .\push-to-github.ps1

$username = "YOUR_GITHUB_USERNAME"  # <-- CHANGE THIS
if ($username -eq "YOUR_GITHUB_USERNAME") {
    Write-Host "Please edit this script and set `$username to your GitHub username, then run again."
    exit 1
}
$git = "C:\Program Files\Git\bin\git.exe"
Set-Location $PSScriptRoot
& $git remote set-url origin "https://github.com/$username/cbt-landing.git"
& $git push -u origin main
Write-Host "Done. If push asked for login, use your GitHub username and a Personal Access Token as password."
