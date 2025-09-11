# Metri Causa: Metrical Analysis Program

## Abstract

Ancient Greek poetic scansion analysis tool.

## Description

The program is a simple tree-walk interpreter structured in four phases:

1. Lexer: Validate that the text conforms to one of the supported Greek text formats:
    - unicode precomposed
    - unicode combining
    - TLG standard beta code
    - non-standard forms of beta code

2. Parser: Choose the parser corresponding to the identified formatting to generate an intermediary representation of the text. This makes it easier both to analyze the text and to render the output in a different format.

3. Syllable Parser: The intermediate representation is now treated as a token stream, which is parsed into an abstract syntax tree representing the syllable structure of the line. This is a surface-level analysis in which syllables are not forced to conform to a metrical pattern, so they may be ambiguous depending on their phonetic context.

4. Meter Interpreter: Depending on the expected metre of the text, choose the corresponding visitor and interpret the syllable structure as that metre.

Since step 2 creates an intermediary representation of the input text, the program can also be used as converter between different formats.
