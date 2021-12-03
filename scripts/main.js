//#################### CLASSES ####################

// https://betterprogramming.pub/implementing-a-stack-in-javascript-73d1aa0483c1
class Stack {
    constructor(){
        this.data = [];
        this.top = 0;
    }
    push(element) {
      this.data[this.top] = element;
      this.top = this.top + 1;
    }
   length() {
      return this.top;
   }
   peek() {
      return this.data[this.top-1];
   }
   isEmpty() {
     return this.top === 0;
   }
   pop() {
    if( this.isEmpty() === false ) {
       this.top = this.top -1;
       return this.data.pop(); // removes the last element
     }
   }
   print() {
      var top = this.top - 1; // because top points to index where new    element to be inserted
      while(top >= 0) { // print upto 0th index
          console.log(this.data[top]);
           top--;
       }
    }
    reverse() {
       this._reverse(this.top - 1 );
    }
    _reverse(index) {
       if(index != 0) {
          this._reverse(index-1);
       }
       console.log(this.data[index]);
    }
}

class MathSolver {
    // adapted from https://www.geeksforgeeks.org/evaluate-the-value-of-an-arithmetic-expression-in-reverse-polish-notation-in-java/
    eval(rpn) {
        
        var tokens = rpn.split(" ").clean();
        // Initialize the stack and the variable
        var stack = new Stack();
        var x = 0;
        var y = 0;
        var result = "";
        var choice = "";
        var value = 0;
        var p = "";
 
        // Iterating to the each character
        // in the array of the string
        for (var i = 0; i < tokens.length; i++) {
 
            // If the character is not the special character
            // ('+', '-' ,'*' , '/')
            // then push the character to the stack
            if (tokens[i] != "+" && tokens[i] != "-"
                && tokens[i] != "*" && tokens[i] != "/"  && tokens[i] != "^" && tokens[i] != "|" && tokens[i] != "&") {
                stack.push(tokens[i]);
                continue;
            }
            else {
                // else if the character is the special
                // character then use the switch method to
                // perform the action
                choice = tokens[i];
            }
 
            // Switch-Case
            switch (choice) {
            case "+":
 
                // Performing the "+" operation by poping
                // put the first two character
                // and then again store back to the stack
 
                x = parseFloat(stack.pop());
                y = parseFloat(stack.pop());
                value = x + y;
                result = p + value;
                stack.push(result);
                break;
 
            case "-":
 
                // Performing the "-" operation by poping
                // put the first two character
                // and then again store back to the stack
                x = parseFloat(stack.pop());
                y = parseFloat(stack.pop());
                value = y - x;
                result = p + value;
                stack.push(result);
                break;
 
            case "*":
 
                // Performing the "*" operation
                // by poping put the first two character
                // and then again store back to the stack
 
                x = parseFloat(stack.pop());
                y = parseFloat(stack.pop());
                value = x * y;
                result = p + value;
                stack.push(result);
                break;
 
            case "/":
 
                // Performing the "/" operation by poping
                // put the first two character
                // and then again store back to the stack
 
                x = parseFloat(stack.pop());
                y = parseFloat(stack.pop());
                value = y / x;
                result = p + value;
                stack.push(result);
                break;

            case "^": 
                x = stack.pop();
                y = stack.pop();
                result = null;
                if (x == y) {
                    result = false;
                } else {
                    result = true;
                } 

                stack.push(result);
                break;

            case "|": 
                x = stack.pop();
                y = stack.pop();
                result = null;
                if ((x == true) || (y == true)) {
                    result = true;
                } else {
                    result = false;
                } 

                stack.push(result);
                break;
            
            case "&": 
                x = stack.pop();
                y = stack.pop();
                result = null;
                if ((x == true) && (y == true)) {
                    result = true;
                } else {
                    result = false;
                } 

                stack.push(result);
                break;
                
            default:
                continue;
            }
        }
 
        // Method to convert the String to number
        var res = stack.pop();
        if (res !== false) {
            if (res !== true) {
                res = parseFloat(res);
            }
        }
        return res;
    }

    //https://www.thepolyglotdeveloper.com/2015/03/parse-with-the-shunting-yard-algorithm-using-javascript/
    infixToPostfix(infix) {
        var outputQueue = "";
        var operatorStack = [];
        var operators = {
            "/": {
                precedence: 5,
                associativity: "Left"
            },
            "*": {
                precedence: 5,
                associativity: "Left"
            },
            "+": {
                precedence: 4,
                associativity: "Left"
            },
            "-": {
                precedence: 4,
                associativity: "Left"
            },
            "^": {                          //XOR for booleans
                precedence: 3,
                associativity: "Left"
            },
            "|": {                          //OR for booleans
                precedence: 2,
                associativity: "Left"
            },
            "&": {                          //AND for booleans
                precedence: 1,
                associativity: "Left"
            },
        }
        infix = infix.replace(/\s+/g, "");
        infix = infix.split(/([\+\-\*\/\^\&\|\(\)])/).clean();
        for(var i = 0; i < infix.length; i++) {
            var token = infix[i];
            if(token.isNumeric()) {
                outputQueue += token + " ";
            } else if("^&|*/+-".indexOf(token) !== -1) {
                var o1 = token;
                var o2 = operatorStack[operatorStack.length - 1];
                while("^&|*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    o2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(o1);
            } else if(token === "(") {
                operatorStack.push(token);
            } else if(token === ")") {
                while(operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue += operatorStack.pop() + " ";
                }
                operatorStack.pop();
            }
        }
        while(operatorStack.length > 0) {
            outputQueue += operatorStack.pop() + " ";
        }
        return outputQueue;
    }

}

//#################### FUNCTIONS ####################

String.prototype.isNumeric = function() {
    var val = varibles.get(this);
    var ret = (!isNaN(parseFloat(this)) && isFinite(this)) || (!isNaN(parseFloat(val)) && isFinite(val));
    return ret;
}

Array.prototype.clean = function() {
    for(var i = 0; i < this.length; i++) {
        if(this[i] === "") {
            this.splice(i, 1);
        }
    }
    return this;
}

function log(content) {console.log(content);}
function clearOut() {outputArea.value = '';}
function addOut(content) {outputArea.value += '\n' + content;}
function printVars() {
    for (const [key, value] of varibles.entries()) {
        addOut(value[0] + " " + key + " = " + value[1]);
    }    
}

function format(line) {
    let formatingEq = /=/g;
    let formatingPlus = /\+/g;
    let formatingMin = /-/g;
    let formatingMult = /\*/g;
    let formatingDiv = /\//g;
    let formatingLParen = /\(/g;
    let formatingRParen = /\)/g;
    let formatingSpace = /\s\s/g;
    let res = line.replace(formatingEq, ' = ');
    res = res.replace(formatingPlus, ' + ');
    res = res.replace(formatingMin, ' - ');
    res = res.replace(formatingMult, ' * ');
    res = res.replace(formatingDiv, ' / ');
    res = res.replace(formatingLParen, ' ( ');
    res = res.replace(formatingRParen, ' ) ');
    res = res.replace(formatingSpace, ' ');
    return res;
}

function lines(){
    let lineToken = codeMirrorText.toString().split("\n");
    let resLines = [];
    for (let i = 0; i < lineToken.length; i++) {
        if (lineToken[i] != "") { resLines.push(lineToken[i]);}
    }
    return resLines;
}

function findVars(lineArray) {
    let VarDef = /^int |^short |^long |^float |^double |^byte |^boolean |^char /;
    let temp = []; // bitvector: is line a var declation or not
    restLines = [[],[]];
    for (let i = 0; i < lineArray.length; i++) {
        lineArray[i] = format(lineArray[i]);
        if (VarDef.test(lineArray[i])){
            temp.push(true);
        } else {
            temp.push(false);
        }
    }
    for (let i = 0; i < temp.length; i++) { //temp and lineArray have same lenght
        if(temp[i]){
            lineArray[i] = lineArray[i].substring(0, lineArray[i].length - 1); // remove ";" from string
            let line = lineArray[i].toString().split(" "); // type, name, =, value
            let type = line[0];
            let name = line[1];
            if (line.length == 4){  // if 5 or more it's not a varible declaration (new Object() isn't a primitive data type) " e.g. type c = a + b; type c = a+b doesn't exist bc of formating
                if (Object.is(NaN, Number(line[3]))) { // is line[3] NaN; true if so
                    if (line[3] == "true" || line[3] == 1){                  // case: type c = true
                        varibles.set(line[1], [type, true]);
                        continue;
                    }
                    if (line[3] == "false" || line[3] == 0){                  // case: type c = false
                        varibles.set(line[1], [type, false]);
                        continue;
                    }
                    let typeVal = varibles.get(line[3])     //case: type c = a
                    if (typeVal != undefined){
                        if (typeVal[0] == line[0]) {
                            varibles.set(line[1], typeVal);
                        } else {
                            addOut("ERROR: Neuzuweisung fehlgeschlagen! " + line[3] +" und " + typeVal[0] +" stimmen nicht überein");
                        }
                    } else { //type c = [not defined variable]
                        //ERROR, cancel execution if not defined
                    }
                } else {
                    //varibles.set(line[1], [line[0], line[3]]); // {key: name, value: [type, VarValue] }
                    varibles.set(line[1], checkOverflow([line[0], line[3]]));
                }
            } else {
                varibles.set(line[1], [type, null]);
                let str = line.slice(1, line.length).toString();
                let formatComma = /,/g;
                restLines[0].push(format(str.replace(formatComma, ''))); // type c = a + b -> c = a + b
                restLines[1].push(name);
                //restLines.push(lineArray[i]); // type c = a + b

            }   
        } else {
            lineArray[i] = lineArray[i].substring(0, lineArray[i].length - 1); // remove ";" from string
            restLines[0].push(lineArray[i]); // case: a = a + b or any other non variable assiging line
            restLines[1].push(lineArray[i][0]);
        }
    } 
    return restLines;
}

function updateVars(name, val) {
    var valPair = varibles.get(name);
    valPair[1] = val;
    valPair = checkOverflow(valPair);
    varibles.set(name, valPair);
}

function replaceVars(line) {
    line = line.replaceAll(/\s\s/g, '');
    for (const [key, value] of varibles.entries()) {
        if (value != null) {
        let reg = new RegExp(key,"g");
        line = line.replaceAll(reg, Math.floor(value[1]));
        }
    }
    return line;
}

//#################### OVERFLOW ####################

function modVal(minVal, maxVal, val) {
    if (val > maxVal) {
        return minVal + (val % maxVal) -1;
    }
    if (val < minVal) {
        return maxVal - (val % maxVal) +1;
    }
    return val;
}

function checkOverflow(varArray) {
    switch (varArray[0]) {
        case "float":
            varArray[1] = modVal(-3402823470000000000000000000000000000000, 340282346638528860000000000000000000000, parseFloat(varArray[1]));
            break;
        case "double":
            varArray[1] = modVal(-1.7976931348623157e+308, 1.7976931348623157e+308, parseFloat(varArray[1]));
            break;
        case "short":
            varArray[1] = modVal(-32768, 32767, parseFloat(varArray[1]));
            break;
        case "int":
            varArray[1] = modVal(-2147483648, 2147483647, parseFloat(varArray[1]));
            break;
        case "long":
            varArray[1] = modVal(-9223372036854775808n, 9223372036854775807n, parseFloat(varArray[1]));
            break;
        case "byte":
            varArray[1] = modVal(-128, 127, parseFloat(varArray[1]));
            break;
        case "char":
            varArray[1] = modVal(0, 65535, parseFloat(varArray[1]));
            break;
        case "boolean":
            //    if (varArray[1] < 0) varArray[1] = 0; // 0 - 1            //not Java compliant behavoiur, shouldn't be needed. 
            //    if (varArray[1] > 1) varArray[1] = 1;  //1 + 1
            if ((varArray[1].toString() == "1") || (varArray[1] == true)) {
                varArray[1] = true;
            } else if ((varArray[1].toString() == "0")|| (varArray[1] == false)) {
                varArray[1] = false;
            } else { varArray[1] = "ERROR: boolean is wrongly defined";} //boolean is not a boolean
            break;
        
        default:
            addOut("Datatype " + varArray[0] + " not supported. Overflow error may occur!");
            break;
    }
    return varArray;
}

//TODO: char und bool zu nummern vor speichern
//#################### RUN BUTTON ####################

function run() {
    clearOut();
    varibles.clear();
    var show = document.getElementById("show-check").checked;
    var ms = new MathSolver();

    var lineArray = lines();    //Input code to line array
    var termLines = findVars(lineArray); //populate varibles and return line array missing var declation
    //log(varibles);
    //log(termLines);

    termLines[0].clean();
    termLines[1].clean();
    for (let i = 0; i < termLines[0].length; i++) {
        let egPos = termLines[0][i].indexOf("=");
        let currTerm = termLines[0][i].substring(egPos+1, termLines[0][i].length);
        currTerm = replaceVars(currTerm);
        let rpn = ms.infixToPostfix(currTerm);
        let resLine = ms.eval(rpn);
        if (termLines[1][i] != undefined) {
            if(show) {
                addOut("Infix: " + currTerm);
                addOut("RPN: " + rpn);
            }
            updateVars(termLines[1][i], resLine);
        } 
    }

    printVars();
}

//#################### SITE INITIALIZATION ####################

let myCodeEditor = CodeMirror.fromTextArea(document.getElementById("java-code"), 
{   lineNumbers: true,
    matchBrackets: true,
    mode:  "text/x-java"
});
let runButton = document.getElementById("run-button");
let outputArea = document.getElementById('output-code');
let codeMirrorText = myCodeEditor.getTextArea().firstChild.data;

myCodeEditor.on("change", function (cm, obj) {
    codeMirrorText = cm.getValue();
});

runButton.addEventListener("click", run)

var varibles = new Map();
