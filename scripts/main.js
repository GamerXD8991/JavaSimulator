function log(content) {console.log(content);}
function clearOut() {outputArea.value = '';}
function addOut(content) {outputArea.value += '\n' + content;}
//parser
var varibles = new Map();

function fixToken(TokenArray) {
    let resArray = [];
    for (let i = 0; i < TokenArray.length; i++) {
        if (TokenArray[i] != "") {
            TokenArray[i] = TokenArray[i].replace(/\n/g, '');
            let loop = true;
            if (TokenArray[i].length > 1){
                while (loop){
                    let check1 = TokenArray[i].indexOf("(");
                    if (check1 != -1) {
                        if (check1 == 0) {
                            check1++;
                        }
                        resArray.push(TokenArray[i].substring(0,check1));
                        TokenArray[i] = TokenArray[i].substring(check1,TokenArray[i].length);
                    }
                    let check2 = TokenArray[i].indexOf(")");
                    if (check2 != -1) {
                        if (check2 == 0) {
                            check2++;
                        }
                        resArray.push(TokenArray[i].substring(0,check2));
                        TokenArray[i] = TokenArray[i].substring(check2,TokenArray[i].length);
                    }
                    let check3 = TokenArray[i].indexOf("[");
                    if (check3 != -1) {
                        if (check3 == 0) {
                            check3++;
                        }
                        resArray.push(TokenArray[i].substring(0,check3));
                        TokenArray[i] = TokenArray[i].substring(check3,TokenArray[i].length);
                    }
                    let check4 = TokenArray[i].indexOf("]");
                    if (check4 != -1) {
                        if (check4 == 0) {
                            check4++;
                        }
                        resArray.push(TokenArray[i].substring(0,check4));
                        TokenArray[i] = TokenArray[i].substring(check4,TokenArray[i].length);
                    }
                    let check5 = TokenArray[i].indexOf("{");
                    if (check5 != -1) {
                        if (check5 == 0) {
                            check5++;
                        }
                        resArray.push(TokenArray[i].substring(0,check5));
                        TokenArray[i] = TokenArray[i].substring(check5,TokenArray[i].length);
                    }
                    let check6 = TokenArray[i].indexOf("}");
                    if (check6 != -1) {
                        if (check6 == 0) {
                            check6++;
                        }
                        resArray.push(TokenArray[i].substring(0,check6));
                        TokenArray[i] = TokenArray[i].substring(check6,TokenArray[i].length);
                    }

                    if (check1 == -1 &&  check2 == -1 &&  check3 == -1 &&  check4 == -1 &&  check5 == -1 &&  check6 == -1) {
                        loop = false;
                    }
                }
            }
            if (TokenArray[i] != "") { resArray.push(TokenArray[i]);}
        }
    }
    return resArray;
}


function findVars(lineArray) {
    let def = /^int |^short |^long |^float |^double |^byte |^boolean |^char /;
    let temp = [];
    for (let i = 0; i < lineArray.length; i++) {
        if (def.test(lineArray[i])){
            addOut(lineArray[i]);
            temp.push(lineArray[i]);
        }
    }
    for (let i = 0; i < temp.length; i++) {
        temp[i] = temp[i].substring(0, temp[i].length - 1); // remove ";" from string
        line = temp[i].toString().split(" "); // type, name, =, value
        if (line.length == 4){  // if 5 or more it's not a varible declaration (new Object() isn't a primitive data type) " type c = a + b 
            if (Object.is(NaN, Number(line[3]))) { // is line[3] NaN; true if so
                let typeVal = varibles.get(line[3])     // case: type c = a 
                if (typeVal != undefined){
                    varibles.set(line[1], typeVal);
                }
            } else {
                varibles.set(line[1], [line[0], line[3]]); // {key: name, value: [type, VarValue] }
            }
        }
        
    }
}

function lines(){
    let lineToken = codeMirrorText.toString().split("\n");
    let resLines = [];
    for (let i = 0; i < lineToken.length; i++) {
        if (lineToken[i] != "") { resLines.push(lineToken[i]);}
    }
    return resLines;
}

function run() {
    clearOut();
    varibles.clear();
    lineArray = lines();
    findVars(lineArray);
    log(varibles);
}

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