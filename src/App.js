import React, { useState } from 'react';
import './App.css';
import AceEditor from "react-ace";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Button, Jumbotron, Dropdown, DropdownButton } from 'react-bootstrap';
import { Ripple } from 'react-spinners-css';


import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";


const exemples = {
	"sudoku" : {
		"name" : "Sudoku",
		"params" : "{\r\n    \"n\" : 9,\r\n    \"iniSudoku\" : [\r\n        [8, 0, 0, 0, 0, 0, 0, 0, 0],\r\n        [0, 0, 3, 6, 0, 0, 0, 0, 0],\r\n        [0, 7, 0, 0, 9, 0, 2, 0, 0],\r\n        [0, 5, 0, 0, 0, 7, 0, 0, 0],\r\n        [0, 0, 0, 0, 4, 5, 7, 0, 0],\r\n        [0, 0, 0, 1, 0, 0, 0, 3, 0],\r\n        [0, 0, 1, 0, 0, 0, 0, 6, 8],\r\n        [0, 0, 8, 5, 0, 0, 0, 1, 0],\r\n        [0, 9, 0, 0, 0, 0, 4, 0, 0]\r\n    ]\r\n}",
		"model": "entities:\n\nviewpoint:\r\n    param int n;\r\n    var p[n][n][n];\r\n    param int iniSudoku[9][9];\r\n\r\nconstraints:\r\n    forall(i in 0..8, j in 0..8){\r\n        EK(p[i][j][_], 1); // Un \u00FAnic valor per cel\u00B7la\r\n        AMK(p[i][_][j], 1); // Cada valor apareix una vegada per fila\r\n        AMK(p[_][i][j], 1); // Cada valor apareix una vegada per columna.\r\n    };\r\n\r\n\r\n    //Cada valor apareix una vagada als subquadrats de 3x3.\r\n    forall(i in [0,3,6], j in [0,3,6], k in 0..8){\r\n        AMK([p[i+l][j+g][k] | l in 0..2, g in 0..2], 1);\r\n    };\r\n\r\n\r\n    //Inicialitzem els valors fixats del sudoku.\r\n    forall(i in 0..8, j in 0..8){\r\n        if(iniSudoku[i][j] != 0){\r\n            p[i][j][iniSudoku[i][j]-1];\r\n        };\r\n    };\r\n\r\noutput:\r\n    \"Soluci\u00F3 sudoku: \\n\";\r\n    [ k+1 ++ \" \" ++ ((j+1) % 3 == 0 ? \" \" : \"\") ++ (j==8 ? (i+1) % 3 == 0 ? \"\\n\\n\": \"\\n\" : \"\") | i in 0..8, j in 0..8, k in 0..8 where p[i][j][k]];"
	},
	"gracies": {
		"name" : "Nonogram",
		"model" : "viewpoint:\r\n    param int rowSize;\r\n    param int colSize;\r\n    param int maxNonos;\r\n\r\n    param int rowNonos[rowSize][maxNonos];\r\n    param int colNonos[colSize][maxNonos];\r\n\r\n    var x[rowSize][colSize];\r\n    var hasStartedRow[rowSize][maxNonos][colSize];\r\n    var hasStartedCol[colSize][maxNonos][rowSize];\r\n\r\nconstraints:\r\n    \/\/Order encoding\r\n    forall(i in 0..rowSize-1, b in 0..maxNonos-1){\r\n        if(rowNonos[i][b] != 0){\r\n            forall(j in 0..colSize-2){\r\n                hasStartedRow[i][b][j] -> hasStartedRow[i][b][j+1];\r\n            };\r\n        }\r\n        else{\r\n            &&( [!hasStartedRow[i][b][j] | j in 0..colSize-1] );\r\n        };\r\n    };\r\n\r\n\r\n\r\n    forall(i in 0..rowSize-1, b in 0..maxNonos-1){\r\n        if(rowNonos[i][b] != 0){\r\n            hasStartedRow[i][b][colSize-rowNonos[i][b]];\r\n        };\r\n    };\r\n\r\n    \/\/Channelling between hasStarted and x\r\n    forall(i in 0..rowSize-1, b in 0..maxNonos-1){\r\n        if(rowNonos[i][b] != 0){\r\n            forall(j in 0..colSize-1){\r\n                if(j >= rowNonos[i][b]){\r\n                    x[i][j] <- hasStartedRow[i][b][j] & !hasStartedRow[i][b][j-rowNonos[i][b]];\r\n                }\r\n                else {\r\n                    x[i][j] <- hasStartedRow[i][b][j];\r\n                };\r\n            };\r\n        };\r\n    };\r\n\r\n    forall(i in 0..rowSize-1){\r\n        EK(x[i], sum(rowNonos[i]));\r\n    };\r\n\r\n    \/\/Nono b abans que b+1.\r\nforall(i in 0..rowSize-1, b in 0..maxNonos-2){\r\n    if(rowNonos[i][b+1] != 0){\r\n        forall(j in 0..colSize-1){\r\n            if(j-rowNonos[i][b]-1 >= 0){\r\n                hasStartedRow[i][b+1][j] -> hasStartedRow[i][b][j-rowNonos[i][b]-1];\r\n            }\r\n            else {\r\n                !hasStartedRow[i][b+1][j];\r\n            };\r\n        };\r\n    };\r\n};\r\n\r\n\r\n\r\n    \/\/Order encoding\r\n    forall(j in 0..colSize-1, b in 0..maxNonos-1){\r\n        if(colNonos[j][b] != 0){\r\n            forall(i in 0..rowSize-2){\r\n                hasStartedCol[j][b][i] -> hasStartedCol[j][b][i+1];\r\n            };\r\n        }\r\n        else{\r\n            &&( [!hasStartedCol[j][b][i] | i in 0..rowSize-1] );\r\n        };\r\n    };\r\n\r\n\r\n\r\n    forall(j in 0..colSize-1, b in 0..maxNonos-1){\r\n        if(colNonos[j][b] != 0){\r\n            hasStartedCol[j][b][rowSize-colNonos[j][b]];\r\n        };\r\n    };\r\n\r\n    \/\/Channelling between hasStarted and x\r\n    forall(j in 0..colSize-1, b in 0..maxNonos-1){\r\n        if(colNonos[j][b] != 0){\r\n            forall(i in 0..rowSize-1){\r\n                if(i >= colNonos[j][b]){\r\n                    x[i][j] <- hasStartedCol[j][b][i] & !hasStartedCol[j][b][i-colNonos[j][b]];\r\n                }\r\n                else {\r\n                    x[i][j] <- hasStartedCol[j][b][i];\r\n                };\r\n            };\r\n        };\r\n    };\r\n\r\n    forall(j in 0..colSize-1){\r\n        EK(x[_][j], sum(colNonos[j]));\r\n    };\r\n\r\n    \/\/Nono b abans que b+1.\r\n    forall(j in 0..colSize-1, b in 0..maxNonos-2){\r\n        if(colNonos[j][b+1] != 0){\r\n            forall(i in 0..rowSize-1){\r\n                if(i-colNonos[j][b]-1 >= 0){\r\n                    hasStartedCol[j][b+1][i] -> hasStartedCol[j][b][i-colNonos[j][b]-1];\r\n                }\r\n                else {\r\n                    !hasStartedCol[j][b+1][i];\r\n                };\r\n            };\r\n        };\r\n    };\r\n\r\n\r\noutput:\r\n    [ (x[i][j] ? \"X\" : \" \") ++ \" \" ++ (j==colSize-1 ? \"\\n\" : \"\") | i in 0..rowSize-1, j in 0..colSize-1];",
		"params": "{\r\n    \"colSize\" : 56,\r\n    \"rowSize\" : 10,\r\n    \"maxNonos\" : 18,\r\n    \"rowNonos\" : [\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,3,1,3,3,3,4,4,3,3,1,3,3,0,0,0,0],\r\n        [2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],\r\n        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],\r\n        [1,1,1,1,1,1,2,3,1,4,1,1,1,1,2,3,0,0],\r\n        [1,1,1,1,1,1,1,1,1,2,2,3,1,1,1,1,0,0],\r\n        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],\r\n        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],\r\n        [1,1,3,3,1,3,3,4,1,1,1,1,3,1,3,3,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]\r\n    ],\r\n    \"colNonos\" : [\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [4,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]\r\n    ]\r\n}"
	},
	"MSPSP": {
		"name" : "MSPSP",
		"model" : "entities:\r\n    \r\nviewpoint:\r\n\r\n    param int UB;\r\n    param int nActivities;\r\n    param int nResources;\r\n    param int nSkills;\r\n    param int duration[nActivities+2];\r\n    param int demand[nActivities+2][nSkills];\r\n    param bool successors[nActivities+2][nActivities+2];\r\n    param bool mastersSkill[nResources][nSkills]; \r\n    \r\n    var hasStarted[nActivities+2][UB+1];\r\n    var isRunning[nActivities+2][UB];\r\n    var usesResourceForSkill[nActivities+2][nResources][nSkills];\r\n    var usesResourceAtTime[nActivities+2][nResources][UB];\r\n    var usesResource[nActivities+2][nResources];\r\n\r\nconstraints:\r\n\r\n    \/\/Dummy start activity\r\n    forall(t in 0..UB-1){\r\n        hasStarted[0][t];\r\n        !isRunning[0][t];\r\n    };\r\n    hasStarted[0][UB];\r\n    \r\n    \/\/Dummy end activity\r\n    forall(t in 0..UB-1){\r\n        !hasStarted[nActivities+1][t];\r\n        !isRunning[nActivities+1][t];\r\n    };\r\n\r\n    hasStarted[nActivities+1][UB];\r\n    \r\n    \/\/Dummy activities do not use resources\r\n    forall(r in 0..nResources-1){\r\n        !usesResource[0][r];\r\n        !usesResource[nActivities+1][r];\r\n        forall(s in 0..nSkills-1){\r\n            !usesResourceForSkill[0][r][s];\r\n            !usesResourceForSkill[nActivities+1][r][s];\r\n        };\r\n        forall(t in 0..UB-1){\r\n            !usesResourceAtTime[0][r][t];\r\n            !usesResourceAtTime[nActivities+1][r][t];\r\n        };\r\n    };\r\n    \r\n    \/\/Order encoding\r\n    forall(i in 1..nActivities, t in 0..UB-1){\r\n        hasStarted[i][t] -> hasStarted[i][t+1];\r\n    };\r\n    \r\n    \/\/Channelling between hasStarted and isRunning\r\n    forall(i in 1..nActivities, t in 0..UB-1){\r\n        if(t >= duration[i]){\r\n            isRunning[i][t] <-> hasStarted[i][t] & !hasStarted[i][t-duration[i]] ;\r\n        }\r\n        else{\r\n            isRunning[i][t] <-> hasStarted[i][t];\r\n        };\r\n    };\r\n    \r\n    \/\/Chanelling between usesResource and usesResourceForSkill\r\n    forall(i in 1..nActivities, r in 0..nResources-1){\r\n        usesResource[i][r] <-> ||(usesResourceForSkill[i][r]);\r\n    };\r\n    \r\n    \/\/Chanelling between usesResource, isRunning and usesResourceAtTime\r\n    forall(i in 1..nActivities, r in 0..nResources-1, t in 0..UB-1){\r\n        usesResourceAtTime[i][r][t] <-> usesResource[i][r] & isRunning[i][t];\r\n    };\r\n    \r\n    \/\/Precedences\r\n    forall(i in 0..nActivities, j in 1..nActivities+1){\r\n        if(successors[i][j]){\r\n            forall(t in 0..UB-duration[i]-1){\r\n                !hasStarted[i][t] -> !hasStarted[j][t+duration[i]+1];\r\n            };\r\n        };\r\n    };\r\n\r\n    \/\/Resource constraints: resources only perform skills that they master\r\n    forall(i in 1..nActivities, s in 0..nSkills-1, r in 0..nResources-1){\r\n        if(not mastersSkill[r][s]){\r\n            !usesResourceForSkill[i][r][s];\r\n        };\r\n    };\r\n    \r\n    \/\/Resource constraints: each activity uses as many resources for a skill as required\r\n    forall(i in 1..nActivities, s in 0..nSkills-1){\r\n        EK(usesResourceForSkill[i][_][s],demand[i][s]);\r\n    };\r\n    \r\n    \/\/Resource constraints: each resource suplies at most one skill to each activity\r\n    forall(i in 1..nActivities, r in 0..nResources-1){\r\n        AMO(usesResourceForSkill[i][r]);\r\n    };\r\n    \r\n    \/\/Resource constraints: each resource works at most at one activity at a time\r\n    forall(r in 0..nResources-1, t in 0..UB-1){\r\n        AMO(usesResourceAtTime[_][r][t]);\r\n    };\r\n    \r\n\r\noutput:\r\n    \"Schedule: \\n\";\r\n    [\"Activity \" ++ i ++ \" starts at time \" ++ t ++ \"\\n\" | i in 1..nActivities, t in 0..UB where (t == 0 ? true : (not hasStarted[i][t-1])) and hasStarted[i][t]];\r\n    [\"Activity \" ++ i ++ \" uses Resource \" ++ r ++ \" for Skill \" ++ s ++ \"\\n\"| \r\n        i in 1..nActivities, r in 0..nResources-1, s in 0..nSkills-1 where usesResourceForSkill[i][r][s]];",
		"params": "{\r\n\"UB\" : 25,\r\n\"nActivities\" : 20,\r\n\"nResources\" : 4,\r\n\"nSkills\" : 10,\r\n\"duration\" : [0,4,2,1,2,3,3,2,4,1,2,1,1,2,1,2,2,4,1,3,2,0],\r\n\"demand\" : [\r\n[0,0,0,0,0,0,0,0,0,0],\r\n[0,0,0,1,0,1,0,0,0,0],\r\n[0,0,0,0,0,1,0,0,0,0],\r\n[0,0,0,0,0,0,0,1,0,1],\r\n[0,0,1,0,0,0,0,1,0,0],\r\n[0,0,1,0,1,0,0,0,0,0],\r\n[0,1,0,0,0,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,1,1],\r\n[0,0,0,0,1,0,0,0,0,1],\r\n[0,0,0,0,0,0,1,0,0,0],\r\n[1,0,0,0,0,0,0,0,0,0],\r\n[0,0,0,1,0,0,0,0,0,0],\r\n[0,0,0,0,2,0,0,0,1,0],\r\n[0,0,0,0,0,2,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,1],\r\n[0,0,0,0,0,0,0,0,0,1],\r\n[0,0,1,0,0,0,0,1,0,0],\r\n[0,0,0,0,0,2,0,0,0,0],\r\n[0,1,0,0,0,0,1,0,0,0],\r\n[0,0,0,1,0,0,0,0,0,1],\r\n[0,0,1,0,0,0,0,1,0,0],\r\n[0,0,0,0,0,0,0,0,0,0]],\r\n\"successors\" : [\r\n[0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0],\r\n[0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0],\r\n[0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],\r\n[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],\r\n\"mastersSkill\" : [\r\n[0,0,1,0,1,1,0,0,1,1],\r\n[0,1,0,0,0,1,0,1,1,1],\r\n[1,0,1,0,0,0,1,1,1,0],\r\n[0,1,0,1,1,0,0,1,0,1]]\r\n}"
	}
}

const solvers = {
	"openwbo" : {
		"name" : "OpenWBO",
		"solver" : "openwbo"
	},
	"minisat" : {
		"name" : "MiniSat",
		"solver" : "minisat"
	},
	"glucose" : {
		"name" : "Glucose",
		"solver" : "glucose"
	}
}

function App() {

	const [input, setInput] = useState(exemples.sudoku.params);
	const [model, setModel] = useState(exemples.sudoku.model);
	const [exampleName, setExampleName] = useState(exemples.sudoku.name);

	const [solverName, setSolverName] = useState(solvers.openwbo.name);
	const [solver, setSolver] = useState(solvers.openwbo.solver);
 
	const [result, setResult] = useState("");
	const [error, setError] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const handleClick = async () => {
		setIsLoading(true);
		console.log("UEEEE") 
		
		// Simple POST request with a JSON body using fetch
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ input, model, solver })
		};
		fetch('/', requestOptions)
			.then(function(res){ return res.json(); })
			.then(function(res){
				console.log(res);
				setResult(res.result);
				setError(res.error);
			})
			.finally( x => {
				setIsLoading(false);
			})
		console.log("UEE2")
	}

	return (
		<>
			<Container fluid style={{textAlign:'center'}}>
			<Jumbotron fluid>
				<Container>
					<h1 style={{fontWeight: 'normal'}}><b>G</b>irona <b>O</b>ptimization <b>S</b>ystem</h1>
					<h6>
						Declarative tool for modelling CSPs to SAT
					</h6>
				</Container>
				<DropdownButton style={{paddingTop: "30px"}} variant="secondary" title={exampleName}>
					<Dropdown.Item onClick={() => {setModel(exemples.sudoku.model); setInput(exemples.sudoku.params); setExampleName(exemples.sudoku.name) }}>{exemples.sudoku.name}</Dropdown.Item>
					<Dropdown.Item onClick={() => {setModel(exemples.gracies.model); setInput(exemples.gracies.params); setExampleName(exemples.gracies.name) }}>{exemples.gracies.name}</Dropdown.Item>
					<Dropdown.Item onClick={() => {setModel(exemples.MSPSP.model); setInput(exemples.MSPSP.params); setExampleName(exemples.MSPSP.name) }}>{exemples.MSPSP.name}</Dropdown.Item>
				</DropdownButton>
			</Jumbotron>
				<Row style={{margin:"50px 10px"}}>
					<Col style={{textAlign:'center'}}>
						<h3>MODEL</h3>
						<h6>BUP language</h6>
						<AceEditor
							mode="java"
							onChange={setModel}
							value={model}
							width="100%"
							name="model"
							editorProps={{ $blockScrolling: true }}
						/>
					</Col>
					<Col style={{textAlign:'center'}}>
						<h3>INPUT</h3>
						<h6>JSON</h6>
						<AceEditor
							mode="java"
							//theme="tomorrow"
							onChange={setInput}
							value={input}
							name="input"
							width="100%"
							editorProps={{ $blockScrolling: true }}
						/>
					</Col>
				</Row>
				<Row className="justify-content-center">
					<DropdownButton style={{paddingTop: "30px"}} variant="secondary" title={solverName}>
						<Dropdown.Item onClick={() => {setSolver(solvers.openwbo.solver); setSolverName(solvers.openwbo.name)}}>{solvers.openwbo.name}</Dropdown.Item>
						<Dropdown.Item onClick={() => {setSolver(solvers.minisat.solver); setSolverName(solvers.minisat.name)}}>{solvers.minisat.name}</Dropdown.Item>
						<Dropdown.Item onClick={() => {setSolver(solvers.glucose.solver); setSolverName(solvers.glucose.name)}}>{solvers.glucose.name}</Dropdown.Item>
					</DropdownButton>
				</Row>
				<Row className="justify-content-center">
				{
					!isLoading ? 
						(<Button variant="outline-secondary" onClick={() => handleClick()}>Submit</Button>)
						: <Ripple color="lightgray" />
				}
				</Row>
				<Row>
					<Col style={{margin:"0 5%"}}>
						<div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', color:"red"}}>{error}</div>
						<br/>
						<div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', fontSize: '16px', fontFamily: "Lucida Console, Monaco, monospace"}}>{result}</div>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default App;
