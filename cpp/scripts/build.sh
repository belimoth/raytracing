source /a/scripts/common/common.sh

use-visual-studio

cd build

cl ../source/main.cpp -Zi -FC -EHsc -link
