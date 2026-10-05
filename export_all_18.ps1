try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pptPath = [System.IO.Path]::GetFullPath("JOYTRUEPROFILE.pptx")
    $pres = $ppt.Presentations.Open($pptPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    $outDir = [System.IO.Path]::GetFullPath("public/assets/slide_previews_18")
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
    $pres.SaveAs($outDir, 17) # ppSaveAsPNG
    
    $pdfPath = [System.IO.Path]::GetFullPath("JOYTRUEPROFILE.pdf")
    $pres.SaveAs($pdfPath, 32) # ppSaveAsPDF
    
    $pres.Close()
    $ppt.Quit()
    Write-Output "PowerPoint slides and PDF exported successfully!"
} catch {
    Write-Output "Export error: $($_.Exception.Message)"
}
