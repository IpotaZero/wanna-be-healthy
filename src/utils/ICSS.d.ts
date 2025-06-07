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
    // | `:not(${pseudoClassSelector | classSelector | idSelector | tagSelector})`
    | `${childSelector}${pseudoClassSelector}`
    | `${pseudoClassSelector}${tagSelector | classSelector | idSelector}`

type A =
    | Selector
    | `:not(${Selector})`
    | `${pseudoClassSelector} ${"~" | "+"} ${Selector}`
    | ` ${"~" | "+"} ${Selector}`

type length = `${number}${"%" | "vh" | "vw" | "em" | "rem"}` | "0"
type time = `${number}s` | `${number}ms`

type NestedCSS = {
    [key in A]?: Partial<CSSStyleDeclaration> | NestedCSS // カスタムセレクタや未知のプロパティも許容
} & {
    width?: length | "fit-content" | "min-content" | "max-content"
    height?: length | "fit-content" | "min-content" | "max-content"
    fontSize?: length

    top?: length
    left?: length
    right?: length
    down?: length

    display?: "none" | "flex" | "inline" | "block" | "grid" | "inline-block"
} & {
    [key in keyof CSSStyleDeclaration]?: Partial<CSSStyleDeclaration> | NestedCSS
}
