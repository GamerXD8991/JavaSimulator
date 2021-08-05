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

function format(line) {
    let formatingEq = /=/;
    let formatingPlus = /\+/;
    let formatingMin = /-/;
    let formatingMult = /\*/;
    let formatingDiv = /\//;
    let formatingSpace = /\s\s/;
    let res = line.replace(formatingEq, ' = ');
    res = res.replace(formatingPlus, ' + ');
    res = res.replace(formatingMin, ' - ');
    res = res.replace(formatingMult, ' * ');
    res = res.replace(formatingDiv, ' / ');
    let resOld;
    do {
        resOld = res;
        res = res.replace(formatingSpace, ' ');
    } while (res !== resOld);
    return res;
}

function findVars(lineArray) {
    let VarDef = /^int |^short |^long |^float |^double |^byte |^boolean |^char /;
    let temp = [];
    restLines = []
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
            line = lineArray[i].toString().split(" "); // type, name, =, value
            if (line.length == 4){  // if 5 or more it's not a varible declaration (new Object() isn't a primitive data type) " e.g. type c = a + b; type c = a+b doesn't exist bc of formating
                if (Object.is(NaN, Number(line[3]))) { // is line[3] NaN; true if so
                    let typeVal = varibles.get(line[3])     // case: type c = a
                    if (typeVal != undefined){
                        varibles.set(line[1], typeVal);
                    } else { //type c = [not defined variable]
                        //ERROR, cancel execution if not defined
                    }
                } else {
                    varibles.set(line[1], [line[0], line[3]]); // {key: name, value: [type, VarValue] }
                }
            } else {
                restLines.push(lineArray[i]); // type c = a + b;
            }   
        } else {
            restLines.push(lineArray[i]); // case: a = a + b or any other non variable assiging line
        }
    } 
    return restLines;
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
    termLines = findVars(lineArray);
    log(termLines);
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