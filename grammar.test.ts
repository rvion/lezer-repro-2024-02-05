import { parser } from "./grammar.parser"

const test1 = `123 (foo)1`
const parse1 = parser.parse(test1)

// print AST
let depth = 0
parse1.iterate({
    leave(nodeType) {
        depth--
    },
    enter(nodeType) {
        console.log(
            //
            (`|` + new Array(depth).fill("    ").join("") + nodeType.name).padEnd(15),
            ` (${test1.slice(nodeType.from, nodeType.to)})`.padEnd(14),
            `(${nodeType.from}->${nodeType.to})`,
        )
        depth++
    },
})
