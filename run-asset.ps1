$ErrorActionPreference = "Stop"

$repoRoot = $PSScriptRoot
Set-Location $repoRoot

& "$repoRoot\run.ps1" -RunAsset -KillPortOwner

