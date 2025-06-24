type classSelector = `.${string}`
type idSelector = `#${string}`
type tagSelector = keyof HTMLElementTagNameMap
type childSelector = ` ${tagSelector | classSelector | idSelector}` | " "

type pseudoClassSelector = ":hover" | ":active"
type pseudoElementsSelector = "::before" | "::after"

type Selector =
    | classSelector
    | idSelector
    | childSelector
    | pseudoClassSelector
    | pseudoElementsSelector
    | `${childSelector}${pseudoClassSelector}`
    | `${pseudoClassSelector}${tagSelector | classSelector | idSelector}`

type A = Selector | `:not(${Selector})` | `${pseudoClassSelector | ""} ${"~" | "+"} ${Selector}`

type Length = `${number}${"%" | "vh" | "vw" | "em" | "rem"}` | "0"
type Time = `${number}${"s" | "ms"}`

type NestedCSS = {
    [key in A]?: Partial<CSSStyleDeclaration> | NestedCSS
} & {
    width?: Length | "fit-content" | "min-content" | "max-content"
    height?: Length | "fit-content" | "min-content" | "max-content"
    fontSize?: Length

    top?: Length
    left?: Length
    right?: Length
    down?: Length

    display?: "none" | "flex" | "inline" | "block" | "grid" | "inline-block"
    position?: "static" | "relative" | "absolute" | "sticky" | "fixed"
    cursor?: "pointer"
} & {
    [key in keyof CSSStyleDeclaration]?: Partial<CSSStyleDeclaration> | NestedCSS
}
