# usage:
# git_init <user>

[[ -z ${1+x} ]] && { echo "error, missing parameter 'user'"; exit; }

project=$( basename "$PWD" )

git init
git add .
git commit -m "initial commit"
git remote add origin git@github.com:$1/$project.git
git remote add gh     git@github.com:$1/$project.git
git remote add bb     git@bitbucket.org:$1/$project.git
# data expunged
git remote set-url --add --push origin git@github.com:$1/$project.git
git remote set-url --add --push origin git@bitbucket.org:$1/$project.git
# data expunged
