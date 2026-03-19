@echo off
setlocal

if %cd%==A:\ (
	echo
) else (
	subst /D A:

	REM TODO elevate for following
	subst A: .

	A:
	set path=A:\scripts;%path%
	set pathext=%pathext%;.SH
	code . --reuse-window
)
