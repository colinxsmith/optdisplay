#!/bin/bash
for file in src/* src/app/* src/app/*/*; do if [ -f $file ]; then sed -i "s/bulktest/bulk-test/g" $file; fi; done
