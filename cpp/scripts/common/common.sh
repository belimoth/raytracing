function use-visual-studio() {
	[[ -z ${DevEnvDir+x} ]] && {
		cmd //c scripts\\common\\bootstrap.bat $0
		exit
	}
}
