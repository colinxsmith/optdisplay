#!/bin/bash
for file in src/* src/app/* src/app/*/*; do if [ -f src/app/rec/rec.component.ts ]; then sed -i "s/data-title/greentitle/g" src/app/rec/rec.component.ts; fi; done
