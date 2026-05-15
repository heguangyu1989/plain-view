$ErrorActionPreference = 'Continue'
$env:GIT_TERMINAL_PROMPT = '0'
Set-Location (Split-Path -Parent $PSScriptRoot)

git add -A
git commit -m "package: wrap zip in top-level plain-view/ folder; tweak README; drop PRD.md"

Write-Host ''
Write-Host '=== push to github ==='
git push github main 2>&1
$gh = $LASTEXITCODE

Write-Host ''
Write-Host '=== push to gitee ==='
git push gitee main 2>&1
$gi = $LASTEXITCODE

Write-Host ''
Write-Host "github exit: $gh  |  gitee exit: $gi"
