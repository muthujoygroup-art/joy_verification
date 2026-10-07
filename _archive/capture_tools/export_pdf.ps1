try {
    $ppt = New-Object -ComObject PowerPoint.Application
    $pptPath = [System.IO.Path]::GetFullPath("JOY_TRUE_PROFILE_Master_Presentation.pptx")
    $pres = $ppt.Presentations.Open($pptPath, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
    $pdfPath = [System.IO.Path]::GetFullPath("JOY_TRUE_PROFILE_Master_Presentation.pdf")
    $pres.SaveAs($pdfPath, 32) # 32 = ppSaveAsPDF
    $pres.Close()
    $ppt.Quit()
    Write-Output "PowerPoint exported to PDF successfully: $pdfPath"
} catch {
    Write-Output "PDF export error: $($_.Exception.Message)"
}
