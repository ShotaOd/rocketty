#!/usr/bin/env bash

echoPhase () {
    echo '=================================================='
    echo $1
    if [ ! -z "$2" ]; then
        echo $2
    fi
    echo '=================================================='
}

echoPhase 'clear invalid data' 'see \\n https://github.com/facebook/react-native/issues/14382#issuecomment-378471981'

echoPhase 'clear watchman'
watchman watch-del-all
echoPhase 'clear node modules'
rm -rf node_modules/
echoPhase 'clear yarn cache'
yarn cache clean
echoPhase 'install node modules'
yarn install
echoPhase 're-configure glog '
cd `dirname $0`
cd ../node_modules/react-native/third-party/glog-0.3.4
./configure
echoPhase 'make && make install'
make
make install
