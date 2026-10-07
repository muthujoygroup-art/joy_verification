try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pptPath = [System.IO.Path]::GetFullPath("JOY_TRUE_PROFILE_Master_Presentation.pptx")
    $pres = $ppt.Presentations.Open($pptPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    $outDir = [System.IO.Path]::GetFullPath("public/assets/slide_previews")
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
    $pres.SaveAs($outDir, 17) # ppSaveAsPNG
    $pres.Close()
    $ppt.Quit()
    Write-Output "PowerPoint slides exported to PNG successfully!"
} catch {
    Write-Output "Export error: $($_.Exception.Message)"
}
