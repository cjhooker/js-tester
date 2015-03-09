var tester = new JsTester();
//var editor;
var tests = [];

var methodDisplayNames = {
	"mustUse": "Must use",
	"mustNotUse": "Must NOT use",
	"mustUseNested": "Must use nested"
};

var types = tester.types;

$(document).ready(function() {
	//editor = $("#editor");
	
	for (method in methodDisplayNames) {
		$("#new-test-method").append("<option value='" + method + "'>" + methodDisplayNames[method] + "</option>");
	}

	for (i in types) {
		$("#new-test-type").append("<option>" + types[i] + "</option>");
	}

	// editor.keyup(runTests);
		
	buildTestList();
	runTests();
});

function populateTypeDropdown(index) {
	$("#new-test-type-" + index).append("<option>NONE</option>");
	for (i in types) {
		$("#new-test-type-" + index).append("<option>" + types[i] + "</option>");
	}
}
	
// Run all the tests
function runTests() {
		// If the code is not valid, set all results to false and don't run the other tests
		if (tester.isValid(editor.getValue())) {
			setResult($("#is-valid-result"), true);
		} else {
			setResult($("#is-valid-result"), false);
			for (i in tests) {
				setResult($("#test-result-" + i), false);
			}			
			return;
		}

		for (i = 0; i < tests.length; i++) {
			var result = tester[tests[i].method](editor.getValue(), tests[i].argument);
			setResult($("#test-result-" + i), result);
		}
}

// Based on whether or not the test passed, set the UI for images
function setResult(element, passed) {
	if (passed) {
		element.attr("src", "images/check.png")
		element.attr("alt", "Test Passed");
		element.attr("title", "Test Passed");
	} else {
		element.attr("src", "images/x.png")
		element.attr("alt", "Test Failed");
		element.attr("title", "Test Failed");	
	}
}

// Add a test to the list, rebuild the UI, and run the tests
function addTest() {
	var arg;
	
	if ($("#new-test-method").val() == "mustUseNested") {
		arg = [];
		$(".new-test-type-multi").each(function() {
			if ($(this).val() != "NONE") {
				arg.push($(this).val());
			}
		});
		//arg = [$("#new-test-type").val()];
	} else {
		arg = $("#new-test-type").val();
	}
	
	tests.push({method: $("#new-test-method").val(), argument: arg});
	buildTestList();
	runTests();
}

// Remove a test from the list, rebuild the UI, and run the tests
function removeTest(index) {
	tests.splice(index, 1);
	buildTestList();
	runTests();
}

// Handle event when a test method is selected from the dropdown
function methodSelected() {
	if ($("#new-test-method").val() == "mustUseNested") {
		$("#new-test-type").hide();
		$("#new-test-type-multi-container").show();
		$("#new-test-type-multi-container").empty();
		addTypeDropdown(0);
	} else {
		$("#new-test-type").show();
		$("#new-test-type-multi-container").hide();
	}
}

function addTypeDropdown(index) {
	var newDropdown = '<select id="new-test-type-' + index + '" class="new-test-type-multi" onchange="newTestMultiSelected(' + index + ');"></select>';
	$("#new-test-type-multi-container").append(newDropdown);
	populateTypeDropdown(index);
}

function newTestMultiSelected(index) {
	// If this is the last one currently displayed and value is something other than NONE
	if (index == $(".new-test-type-multi").length - 1) {
		var dropdown = $("#new-test-type-" + index);
		if (dropdown.val() != "NONE") {
			addTypeDropdown(index + 1);

		}
	}
}

// Build the HTML for the list of tests/results and add it to the DOM
function buildTestList() {
	var testList = $("#test-list");
	$(".js-test").remove();
	for (i in tests) {
		var li = "<li class='js-test'><img id='test-result-" + i + "' class='test-result icon' src='images/x.png' />" + 
			methodDisplayNames[tests[i].method] + " " + 
			tests[i].argument +
			"<img id='test-delete-" + i + "' alt='Delete Test' title='Delete Test'  class='test-delete icon clickable' src='images/delete.png' onclick='removeTest(" + i + ");' />"
			"</li>";
		testList.append(li);
	}
}