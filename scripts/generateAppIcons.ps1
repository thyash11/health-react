Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$iconDirectory = Join-Path $projectRoot "public\icons"
New-Item -ItemType Directory -Force -Path $iconDirectory | Out-Null

function New-NutriMetricIcon {
  param(
    [Parameter(Mandatory = $true)][int]$Size,
    [Parameter(Mandatory = $true)][string]$FileName
  )

  $bitmap = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml("#2563eb"))

  $scale = $Size / 512.0
  $haloBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(31, 255, 255, 255))
  $graphics.FillEllipse($haloBrush, 106 * $scale, 106 * $scale, 300 * $scale, 300 * $scale)

  $pulsePen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, [single](38 * $scale))
  $pulsePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pulsePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  $pulsePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
  $points = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new(92 * $scale, 274 * $scale),
    [System.Drawing.PointF]::new(181 * $scale, 274 * $scale),
    [System.Drawing.PointF]::new(218 * $scale, 180 * $scale),
    [System.Drawing.PointF]::new(290 * $scale, 354 * $scale),
    [System.Drawing.PointF]::new(337 * $scale, 250 * $scale),
    [System.Drawing.PointF]::new(420 * $scale, 250 * $scale)
  )
  $graphics.DrawLines($pulsePen, $points)

  $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml("#34d399"))
  $graphics.FillEllipse($accentBrush, 398 * $scale, 228 * $scale, 44 * $scale, 44 * $scale)

  $outputPath = Join-Path $iconDirectory $FileName
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $accentBrush.Dispose()
  $pulsePen.Dispose()
  $haloBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

New-NutriMetricIcon -Size 180 -FileName "nutrimetric-180.png"
New-NutriMetricIcon -Size 192 -FileName "nutrimetric-192.png"
New-NutriMetricIcon -Size 512 -FileName "nutrimetric-512.png"
New-NutriMetricIcon -Size 512 -FileName "nutrimetric-maskable-512.png"
