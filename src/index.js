function getRow(index, arrSudoku){
    return arrSudoku[index];
}

function getCol(index, arrSudoku){
    let arr = [];
    for (let i = 0; i < 9; i++){
        arr.push(arrSudoku[i][index]);
    }
    return arr;
}

function getSect(row, col, arrSudoku){
    let arr = [];
    let rowBegin = 3 * Math.floor(row / 3);
    let colBegin = 3 * Math.floor(col / 3);
    for (let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            arr.push(arrSudoku[rowBegin + i][colBegin + j]);
        }
    }
    return arr;
}

function uniqueArray(arr) {
    let tempArr = [];
    for (let i = 0; i < arr.length; i++){
        let count = 0;
        for (let j = 0; j < arr.length; j++){
            if (arr[i] == arr[j]) count++;
        }
        if(count == 1){
            tempArr.push(arr[i]);
        }
    }
    return tempArr;
}

function findCandidates(row, col, arrSudoku){
    let supposedVal = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let uno = supposedVal.concat(getRow(row, arrSudoku))
                            .concat(getCol(col, arrSudoku))
                            .concat(getSect(row, col, arrSudoku));
    let arrDiff = uniqueArray(uno);
    return arrDiff;
}

function varianceTable(arrSudoku){
    let tableCondidates = [];
    for (let i = 0; i < 9; i++){
        tableCondidates[i] = [];
        for(let j = 0; j < 9; j++){
            if(arrSudoku[i][j] == 0){
                tableCondidates[i][j] = findCandidates(i, j, arrSudoku);
            } else {
                tableCondidates[i][j] = 0;
            }
        }
    }
    return tableCondidates;
}

function manyToOne(arr){
    let newArr = [];
    for (let i = 0; i < 9; i++){
        if(arr[i] != 0){
            newArr = newArr.concat(arr[i]);
        }
    }
    return newArr;
}

function manyToOneSect(arr){
    let newArr = [];
    for (let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
            if(arr[i][j] != 0){
                newArr.concat(arr[i][j]);
            }
        }
    }
    return newArr;
}

function checkHiddenInRow(ind, candidates, matrix){
        let rowCondidates = getRow(ind, candidates);
        let unoRow = manyToOne(rowCondidates);
        let unoR = unoRow.filter(function(value, item, arr){
                    return arr.indexOf(value) === arr.lastIndexOf(value);
                });
        if(unoR.length == 1){
            return  {
                    value : unoR[0],
                    indC: findIndex(unoR[0], rowCondidates)
                    };
        } else {
            return 0;
        }
}

function checkHiddenInCol(ind, candidates, matrix){
    let colCondidates = getCol(ind, candidates);
        let unoCol = manyToOne(colCondidates);
        let unoC = unoCol.filter(function(value, item, arr){
                    return arr.indexOf(value) === arr.lastIndexOf(value);
                });
        if(unoC.length == 1){
            return  {
                    value : unoC[0],
                    indR: findIndex(unoC[0], colCondidates),
                    };
        } else {
            return 0;
        }
}

function checkHiddenInSect(row, col, candidates, matrix){
    let sectCondidates = getSect(row, col, candidates);
    let unoSect = manyToOneSect(sectCondidates);
    let unoS = unoSect.filter(function(value, item, arr){
                    return arr.indexOf(value) === arr.lastIndexOf(value);
                });
    if (unoS.length == 1){
        let rowBegin = 3 * Math.floor(row / 3);
        let colBegin = 3 * Math.floor(col / 3);
        let ind = findIndex(unoS[0], sectCondidates);
        return {
                value : unoS[0],
                indR : rowBegin + Math.floor(ind / 3),
                indC : colBegin + ind % 3
        };
    } else {
        return 0;
    }

}

function findIndex(number, matrix){
    for (let i = 0; i < 9; i++){
        if (matrix[i] != 0){
            if(matrix[i].indexOf(number) != -1){
                 return i;
            }
        }
    }
    return -1;
}

function checkHiddenSect(candidates, matrix){
    for (let i = 0; i < 9; i++){  
        for (let j = 0; j < 9; j++){
            if(matrix[i][j] == 0){
                let sectCondidates = getSect(i, j, candidates);
                let unoSect = manyToOneSect(sectCondidates);
                let unoS = unoSect.filter(function(value, item, arr){
                    return arr.indexOf(value) === arr.lastIndexOf(value);
                });
                
                if (unoS.length == 1){
                    let rowBegin = 3 * Math.floor(i / 3);
                    let colBegin = 3 * Math.floor(j / 3);
                    let ind = findIndex(unoS[0], sectCondidates);
                    return {
                            value : unoS[0],
                            indR : rowBegin + Math.floor(ind / 3),
                            indC :colBegin + ind % 3
                            };
                }
            }
        }
    }
    return 0;
}

function checkTable(arrSudoku){
    for (let i = 0; i < 9; i++){
            for(let j = 0; j < 9; j++){
                if (arrSudoku[i][j] == 0){
                    return 1;
                }
            }
    }
    return 0;
}

function checkRules(row, col, number, matrix){
    let rowCheck = getRow(row, matrix),
        colCheck  = getCol(col, matrix),
        sectCheck = getSect(row, col, matrix);

    if (rowCheck.indexOf(number) != -1 || 
        colCheck.indexOf(number) != -1 || 
        sectCheck.indexOf(number) != -1){
            return 1;
        } else {
            return 0;
        }
}

function solve(matrix) {
    let count = 0;
    let lastcount = -1;
    let iter = 0;
    while(lastcount != count){
        iter++;
        lastcount = count;
        let table = varianceTable(matrix);
        for (let i = 0; i < 9; i++){  // one condidate
            for (let j = 0; j < 9; j++){
                if (matrix[i][j] == 0 && 
                    table[i][j].length == 1 && 
                    checkRules(i, j, table[i][j][0], matrix) == 0){
                    matrix[i][j] = table[i][j][0];
                    table = varianceTable(matrix);
                    count++;
                }
            }
        }
        for (let k = 0; k < 9; k++){  // one hidden row condidate
            let checkedR = checkHiddenInRow(k, table, matrix);
            if (checkedR != 0 && checkRules(k, checkedR.indC, checkedR.value, matrix) == 0){
                matrix[k][checkedR.indC] = checkedR.value;
                table = varianceTable(matrix);
                count++;
            }
        }

        for (let l = 0; l < 9; l++){  // one hidden col condidate
            let checkedC = checkHiddenInCol(l, table, matrix);
            if (checkedC != 0 && checkRules(checkedC.indR, l, checkedC.value, matrix) == 0){
                matrix[checkedC.indR][l] = checkedC.value;
                table = varianceTable(matrix);
                count++;
            }
        }

        for (let i1 = 0; i1 < 3; i1++){  // one hidden sect condidate
            for (let j1 = 0; j1 < 3; j1++){
                let checkedS = checkHiddenInSect(i1, j1, table, matrix);
                if (checkedS != 0 && checkRules(checkedS.indR, checkedS.indC, checkedS.value, matrix) == 0){
                    matrix[checkedS.indR][checkedS.indC] = checkedS.value;
                    table = varianceTable(matrix);
                    count++;

                }
            }
        }
    }
        return matrix;
}

module.exports = function solveSudoku(matrix) {
    solve(matrix);
    if (checkTable(matrix) == 0) return matrix;
    let probablyValue;
    for (let iter = 0; iter < 5; iter++){
        let table = varianceTable(matrix);
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                if (table[i][j] != 0 && 
                    checkRules(i, j, table[i][j][iter], matrix) == 0 &&
                    table[i][j].length > iter){
                    probablyValue = table[i][j][iter];
                    matrix[i][j] = probablyValue;
                    solve(matrix);
                    if (checkTable(matrix) == 0) {
                        return matrix;
                    } else {
                        matrix[i][j] = 0;
                    }
                }
            }
        }
    }
    return matrix;
}

