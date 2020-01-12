#!/bin/bash
for file in src/* src/app/* src/app/*/*; do if [ -f $file ]; then sed -i "s/data-title/greentitle/g" $file; fi; done
