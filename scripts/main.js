function log(content) {console.log(content);}
function clearOut() {outputArea.value = '';}
function addOut(content) {outputArea.value += '\n' + content;}
//parser

var varibles = new Map();

class ASTNode {
    // type = Number, OperatorPlus, OperatorMinus, OperatorMult, OperatorDiv, undefined

    //this constructor works as default constructor if no parameter are present and automatically assigns defaut values if some parametes are missing
    constructor(type  = "undefined", value = 0.0, LChild = null, RChild = null) {
        this.type = type;
        this.value = value;
        this.LChild = LChild;
        this.RChild = RChild;
        this.endPos = 0;
    }

    LeftBranche(str,pos) {
        let res = new ASTNode();
        let newPos = 0;
        let char = str[0]; 
        log(char);
        switch(char){
            case " ":
            case "(": 
                res.LChild = res.LeftBranche(str.substring(2, str.length), pos + 2);
                newPos = res.LChild.pos+1;
                break; //redundent
            case ")":
                res.endPos = pos;
                return res;
                break; //redundent
            case "+":
                res.type = "OperatorPlus";
                res.RChild = this.LeftBranche(str.substring(2, str.length), pos + 2);
                newPos = res.LChild.pos+1;
                break;
            case "-":
                res.type = "OperatorMinus";
                res.RChild = this.LeftBranche(str.substring(2, str.length), pos + 2);
                newPos = res.LChild.pos+1;
                break;
            case "*":
                res.type = "OperatorMult";
                res.RChild = this.LeftBranche(str.substring(2, str.length), pos + 2);
                newPos = res.LChild.pos+1;
                break;
            case "/":
                res.type = "OperatorDiv";
                res.RChild = this.LeftBranche(str.substring(2, str.length), pos + 2);
                newPos = res.LChild.pos+1;
                break;
            default:
                let def = varibles.get(char);
                if (def !== undefined ) {
                    res.type = "Number";
                    res.value = def;
                    res.endPos = pos;
                    return res;
                } else {
                    res.type = "undefined";
                }
        } 

        res.RChild = this.LeftBranche(str.substring(newPos + 2, str.length), newPos);

        //if not () are present
        return res;
    }

    parse(line) {      

        this.LChild = this.LeftBranche(line,0);
        return this;
               
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

function findVars(lineArray) {
    let VarDef = /^int |^short |^long |^float |^double |^byte |^boolean |^char /;
    let temp = []; // bitvector: is line a var declation or not
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
                varibles.set(line[1], null);
                let str = line.slice(1, line.length).toString();
                let formatComma = /,/g;
                restLines.push(format(str.replace(formatComma, ''))); // type c = a + b -> c = a + b
                //restLines.push(lineArray[i]); // type c = a + b

            }   
        } else {
            lineArray[i] = lineArray[i].substring(0, lineArray[i].length - 1); // remove ";" from string
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


//#################### RUN BUTTON ####################



function run() {
    clearOut();
    varibles.clear();

    lineArray = lines();    //Input code to line array
    termLines = findVars(lineArray); //populate varibles and return line array missing var declation
    //log(varibles);
    log(termLines);

    RootNodePerLineArray = []
    for (let i = 0; i < termLines.length; i++) {
        let rootNode = new ASTNode();
        RootNodePerLineArray.push(rootNode.parse(termLines[i].substring(4, lineArray[i].length))); // substring: ignore "c = "
    }
    log(RootNodePerLineArray[0]);
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