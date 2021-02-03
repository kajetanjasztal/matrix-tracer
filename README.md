# Clean SVG QRcode redering

This is a proof-of-concept of an optimized construction of grid-based 2D
barcodes (like QRcodes, DataMatrix, etc.) for anti-aliased rendering.

## Issue

Most SVG outputs in QRcode generators treat each black cell as an individual
rectangle. This causes anti-aliasing issue on shared edges, resulting in
single-pixel gray lines sepparating neighbouring cells. This implementation
solves this issue and should also result in smaller output file size.

## This implementation

Function `generatePath` builds polygons around cells with vertical and
horizontal segment of path element, assuming even-odd filling method.

Utilizes 2x2 sensor with two states:

- searching - scans matrix LTR looking for loose corner,
- drawing - sliding along edges from corner to corner.

This function needs to be provided with matrix dimmensions and
`(x: number, y:number) => boolean` function, so it can handle any matrix
representation.

- `src/generatePath.ts` - provides main functionality, no dependiencies required
- `src/index.ts` - provides example for comparison with
  @https://github.com/papnkukn/qrcode-svg

### Pros

- no dividing lines inside islands
- single path element
- smaller output file

### Cons

- harder to manipulate cells to take advantage of error correction (logo
  placement)

### Comparison

|         |    qrcode-svg output    |     svgQR output     | qrcode-svg w/o `shape-rendering:crispEdges` |
| ------: | :---------------------: | :------------------: | :-----------------------------------------: |
|  result | ![](outputs/native.svg) | ![](outputs/our.svg) |          ![](outputs/noCrisp.svg)           |
| `wc -c` |          69745          |         1315         |                    57946                    |
|    `du` |           144           |          8           |                     128                     |

## Further work

Find out what interface will be most suitable to be integrated with popular 2D
barcodes generators.
