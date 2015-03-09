# js-tester

Allows you to test a piece of JavaScript code and determine:

1. Whether a certain language element (e.g. If Statement or For Statement) is used
2. Whether a certain language element is NOT used anywhere
3. Whether a certain set of nested language elements are used (e.g. a Call inside an If inside a Try)

Open `index.html` to see it in action.

The tester itself is defined in `js/js-tester.js` and can be used as follows:

`var tester = new JsTester();`

`var myCode = "try {if (a == 1) {doSomething();}} catch (err) {doSomethingWithErr();}";`

`var result1 = tester.mustUse(myCode, "IfStatement");`  
`var result2 = tester.mustNotUse(myCode, "ForStatement");`  
`var result3 = tester.mustUseNested(myCode, ["TryStatement", "IfStatement", "CallExpression"]);`

In this example, all three results would be true.

You can see a list of available types with the `tester.types` property.
