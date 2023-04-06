# Docker entrypoint

# Source: https://github.com/jschnasse/read-env-example
function generateConfigJs() {
    echo "/*<![CDATA[*/";
    echo "window.env = window.env || {};";
    for i in $(env | grep '^REACT_APP_')
    do
        key=$(echo "$i" | cut -d"=" -f1);
        val=$(echo "$i" | cut -d"=" -f2);
        echo "window.env.${key}='${val}';";
    done
    echo "/*]]>*/";
}
generateConfigJs > build/config.js

node scripts/run-server.js
