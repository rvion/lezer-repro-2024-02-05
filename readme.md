# possible lezer issue - minimal repro example

```c
/*
input: "123 (foo)1"
what I want:
| File            (123 (foo)1)  (0->10)
|     Word        (123)         (0->3)
|     Group       ((foo)1)      (4->10)
|         Word    (foo)         (5->8)
|         Number  (1)           (9->10)

*/
@top File { expression+ }
expression[@isGroup=Expression] { Group | Word }
@skip { space }
Group { "(" expression+ ")" Number }
@tokens {
    space { @whitespace+ }
    Word { ($[A-Za-z0-9._\\\/\-] )+ }
    Number { "-"? $[0-9.]+ }

    // 🟢 WORKS when no precendence, or when just Word in precedence
    @precedence { Word }

    // 🔴 the group weight is parsed as a identifier despite the grammar beeing
    // explicit / non ambiguous. Word shouldn't have been considered there.
    // |File            (123 (foo)1)  (0->10)
    // |    Word        (123)         (0->3)
    // |    Group       ((foo))       (4->9)
    // |        Word    (foo)         (5->8)
    // |        ⚠       ()            (9->9)
    // |    Word        (1)           (9->10)
    @precedence { Word, Number }


    // 🔴 the top level 123 is parsed as a number,
    // despite the grammar not allowing number at the top level,
    // and despite the whole thing beeing unambiguous
    // |File            (123 (foo)1)  (0->10)
    // |    ⚠           (123)         (0->3)
    // |        Number  (123)         (0->3)
    // |    Group       ((foo)1)      (4->10)
    // |        Word    (foo)         (5->8)
    // |        Number  (1)           (9->10)
    @precedence { Number, Word }
}

```