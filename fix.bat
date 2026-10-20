@echo off
setlocal EnableDelayedExpansion
title Emmanuella Site Auto-Fixer
color 0E

echo.
echo ============================================================
echo   EMMANUELLA SITE AUTO-FIXER
echo   Folder: %CD%
echo ============================================================
echo.

REM --- Sanity check: are we in the right folder? ---
if not exist "index.html" (
    echo [ERROR] index.html not found in this folder.
    echo.
    echo You must run this .bat file from the SAME folder as index.html.
    echo Current folder is: %CD%
    echo.
    pause
    exit /b 1
)

echo [OK] Found index.html in this folder.
echo.

REM --- 1. Create the three folders if missing ---
for %%F in (css js images) do (
    if not exist "%%F" (
        mkdir "%%F"
        echo [CREATED] Folder: %%F\
    ) else (
        echo [EXISTS ] Folder: %%F\
    )
)
echo.

REM --- 2. Move every loose .css file into css\ ---
echo --- Moving CSS files ---
set CSS_COUNT=0
for %%F in (*.css) do (
    if exist "%%F" (
        move /Y "%%F" "css\" >nul
        echo   [MOVED] %%F  -^>  css\
        set /a CSS_COUNT+=1
    )
)
if !CSS_COUNT!==0 echo   (no loose .css files found)
echo.

REM --- 3. Move every loose .js file into js\ ---
echo --- Moving JS files ---
set JS_COUNT=0
for %%F in (*.js) do (
    if exist "%%F" (
        move /Y "%%F" "js\" >nul
        echo   [MOVED] %%F  -^>  js\
        set /a JS_COUNT+=1
    )
)
if !JS_COUNT!==0 echo   (no loose .js files found)
echo.

REM --- 4. Move every loose image file into images\ ---
echo --- Moving image files ---
set IMG_COUNT=0
for %%E in (png jpg jpeg gif svg webp ico) do (
    for %%F in (*.%%E) do (
        if exist "%%F" (
            move /Y "%%F" "images\" >nul
            echo   [MOVED] %%F  -^>  images\
            set /a IMG_COUNT+=1
        )
    )
)
if !IMG_COUNT!==0 echo   (no loose image files found)
echo.

REM --- 5. Check for CSS filename mismatch (style.css vs styles.css) ---
if exist "css\style.css" (
    if not exist "css\styles.css" (
        ren "css\style.css" "styles.css"
        echo [RENAMED] css\style.css  -^>  css\styles.css
    )
)
if exist "css\Styles.css" (
    if not exist "css\styles.css" (
        ren "css\Styles.css" "styles.css"
        echo [RENAMED] css\Styles.css  -^>  css\styles.css
    )
)

REM --- 6. Check headshot extension mismatch ---
if exist "images\emmanuella_headshot.png" (
    if not exist "images\emmanuella_headshot.jpg" (
        echo.
        echo [WARNING] Your headshot is .png but the HTML expects .jpg
        echo           Fixing HTML now...
        powershell -NoProfile -Command "(Get-Content 'index.html') -replace 'images/emmanuella_headshot\.jpg','images/emmanuella_headshot.png' | Set-Content 'index.html'"
        echo           [OK] index.html updated to use .png
    )
)
if exist "images\emmanuella_headshot.jpeg" (
    if not exist "images\emmanuella_headshot.jpg" (
        echo.
        echo [WARNING] Your headshot is .jpeg but the HTML expects .jpg
        echo           Fixing HTML now...
        powershell -NoProfile -Command "(Get-Content 'index.html') -replace 'images/emmanuella_headshot\.jpg','images/emmanuella_headshot.jpeg' | Set-Content 'index.html'"
        echo           [OK] index.html updated to use .jpeg
    )
)

echo.
echo ============================================================
echo   VERIFICATION
echo ============================================================
call :checkfile "css\styles.css"                    "Stylesheet"
call :checkfile "js\script.js"                      "Script"
call :checkfile "images\ea_afolabi_logo.png"        "Logo"
call :checkfile "images\emmanuella_headshot.jpg"    "Headshot (.jpg)"
call :checkfile "images\emmanuella_headshot.png"    "Headshot (.png)"
call :checkfile "images\emmanuella_headshot.jpeg"   "Headshot (.jpeg)"
call :checkfile "images\designing-your-voice.png"   "Book 1"
call :checkfile "images\the-quiet-art-of-noticing.png" "Book 2"
call :checkfile "images\brand-me-softly.png"        "Book 3"
call :checkfile "images\letters-to-my-future-self.png" "Book 4"

echo.
echo ============================================================
echo   DONE.
echo ============================================================
echo.
echo NEXT STEPS:
echo   1. Open index.html in your browser.
echo   2. Hard refresh with Ctrl+Shift+R.
echo.
echo If any file above says MISSING, you still need to add it.
echo (The script cannot create image files that don't exist.)
echo.
pause
exit /b 0

:checkfile
if exist "%~1" (
    echo   [FOUND  ] %~2  -  %~1
) else (
    echo   [MISSING] %~2  -  %~1
)
exit /b 0