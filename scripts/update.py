import os

live2d = open('./dist/live2d-render.js', 'r', encoding='utf-8').read()
live2d = '/* eslint-disable */\n' + live2d

vue_target_lib = os.path.realpath('../test-vue-live2d-render/src/lib')
vue_live2d = os.path.join(vue_target_lib, 'live2d-render.js')
open(vue_live2d, 'w', encoding='utf-8').write(live2d)