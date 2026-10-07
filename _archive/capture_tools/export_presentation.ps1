try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pptPath = [System.IO.Path]::GetFullPath("JOYTRUEPROFILE.pptx")
    $pres = $ppt.Presentations.Open($pptPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    
    $outDir = [System.IO.Path]::GetFullPath("public/assets/slide_previews_17")
    if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
    
    # Export all individual slide images
    $pres.SaveAs($outDir, 17) # 17 = ppSaveAsPNG / JPG depending on Office
    
    # Export full presentation as PDF
    $pdfPath = [System.IO.Path]::GetFullPath("JOYTRUEPROFILE.pdf")
    $pres.SaveAs($pdfPath, 32) # 32 = ppSaveAsPDF
    
    $pres.Close()
    $ppt.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($ppt) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    Write-Output "✅ PowerPoint slides and PDF exported successfully!"
} catch {
    Write-Output "Export error: $($_.Exception.Message)"
}
