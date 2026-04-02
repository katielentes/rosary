/**
 * Filled Latin cross on a 24×24 grid — same minimalist silhouette as common
 * “simple cross” SVG packs (e.g. svgcollections.com/design/simple-cross-svg-design-5/
 * — their file requires login; replace `SIMPLE_CROSS_PATH_24` if you paste their path).
 *
 * Bounding box ~6–22 × 2–22; visual center ~(14, 12).
 */
export const SIMPLE_CROSS_PATH_24 =
  'M12 2v6H6v4h6v10h4V12h6V8h-6V2h-4z'

/** Center for translate-before-scale so the cross sits on the station point */
export const SIMPLE_CROSS_ORIGIN_X = 14
export const SIMPLE_CROSS_ORIGIN_Y = 12
/** Path height (y) is 20; scale so on-screen height ≈ this in viewBox user units */
export const SIMPLE_CROSS_HEIGHT = 20
/** Target height in rosary viewBox units (~matches prior rect crucifix) */
export const SIMPLE_CROSS_TARGET_H = 10
