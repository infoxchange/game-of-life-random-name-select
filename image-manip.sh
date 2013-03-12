#!/bin/bash
# prints a string of characters, each corresponding to a pixel
# prior to this, the following manipulations are performed:
# image is resized
# image is made b&w, with an equal proportion of each.
# Requires: ImageMagick, bbe

width=100
height=100

usage(){
	echo "Usage: $0 filename"
	exit 1
}

[[ $# -eq 0 ]] && usage

convert $1 \
	-resize "$width"x"$height"^ -gravity center -extent "$width"x"$height" \
	-colorspace gray -format "GIF" -linear-stretch 50x50% \
 	bgr:- | \
	bbe -e "y/\x00\xff/01/g" | \
	fold --width=$width
