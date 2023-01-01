#!/bin/bash
echo "adb -s fca6ee7d reverse tcp:3000 tcp:3000"
adb -s fca6ee7d reverse tcp:3000 tcp:3000
echo "adb -s fca6ee7d reverse tcp:5000 tcp:5000"
adb -s fca6ee7d reverse tcp:5000 tcp:5000