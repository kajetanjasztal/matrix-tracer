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
     A----B----C                          A---------C
     |::::|::::|                          |:::::::::|
D----E----F----G                     D----E:::::::::|
|::::|::::|::::|                     |::::|:::::::::|
H----I----J----K                     H----I---------K

ABFE + BCFG + DEIH + EFJI + FGKJ   ->   ACKI + DEIH
```

### XORing

Svg fill-rule 'even-odd' allows us to optimize amount of shapes to represent the intersecting shapes, xoring them rather than unionizing.

```
     A----B                         A----B
     |::::|                         |::::|
C----D----E----F               C----+----+----F
|::::|    |::::|               |::::|    |::::|
G----H----I----J               G----+----+----J
     |::::|                         |::::|
     K----L                         K----L

ABED + CDHG + EFJI + HILK   ->   ABLK x CFJG
```

### Shared corners

When two squares are sharing one corner we could draw them as single polygon ommiting entirely the shared verticle.
Although we have to keep in mind the winding direction.

```
B----C             B----C
|::::|             |::::|
A----D----E        A----+----E
     |::::|             |::::|
     G----F             G----F

ABCD + DEFG   ->   ABCGFE
```

## Method

### Cart

cart ocupies 2x2 square and scans each underlying cell, it also have two states, searching and drawing.

### Searching

```
+----+----+
|    |    |  LTR + wrap to next line
+----+----+  --->
|    |    |
+----+----+
```

(front sensing) when searching it scans the pattern marking on the way visited locations, when one of covered cells is different then rest it switches to drawing state.

### Drawing

```
+----+----+                       +----+----+  +----+----+       +----+----+
|    |    |  direction            |    |    |  |    |::::|       |    |::::|
+----+----+  --->                 +----+----+  +----+----+       +----+----+
|::::|::::|  (h, -h, v, -v)       |::::|    |  |::::|::::|       |::::|    |
+----+----+                       +----+----+  +----+----+       +----+----+
                                   rotate CW    rotate CCW         ignore
```

(back sensing) In drawing state it goes in direction and checks if one of covered cells is different then it inserts a path verticle and rotates in direction of odd cell. It's rotated until it get's back to initial position - then it switches to searching state
