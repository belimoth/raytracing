source /a/scripts/common/common.sh

use-visual-studio

cd build

cl ../main.cpp -Zi -FC -EHsc -link
