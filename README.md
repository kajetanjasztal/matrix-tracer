# Clear SVG QRcode redering

This repository is a proof of concept of optimal method of drawing QRcodes for anti-aliased rendering.
It describes a method used and provides simple implementation based on string representation of qrcode.

## Issue

Most SVG outputs from QRcode generators renders each black cell as individual rectangle. This causes anti-aliasing
issue resulting in single-pixel gray lines sepparating each cell and also resulting in bigger files than necessary.

_Illustrations attached to this readme exagerates the issue with gray stroke._

## Ideas

### Groupping

First of all we can optimize by combining groups of cells into bigger rectangles.
There is plenty of methods of grouping but we don't need to look into them right now.
We will still have the same problem where those groups meet.

```
     A----B----C
     |::::|::::|
D----E----F----G
|::::|::::|::::|
H----I----J----K

ABFE + BCFG + DEIH + EFJI + FGKJ -> ACKI + DEIH
```

### XORing

Svg fill-rule 'even-odd' allows us to optimize amount of shapes to represent the 'self-intersecting' shapes, xoring them rather than unionizing.

```
     A----B
     |::::|
C----D----E----F
|::::|    |::::|
G----H----I----J
     |::::|
     K----L

ABED + CDHG + EFJI + HILK -> ABLK x CFJG
```

### Shared corners

When two squares are sharing one corner we could draw them as single polygon ommiting entirely the shared verticle.
Although we have to keep in mind the winding direction.

```
B----C
|::::|
A----D----E
     |::::|
     G----F

ABCD + DEFG -> ABCGFE
```

##

## Cart
