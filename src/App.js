import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import AceEditor from "react-ace";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Button, Jumbotron} from 'react-bootstrap';
import { Ripple } from 'react-spinners-css';


import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";


function App() {

	const [input, setInput] = useState("{\r\n    \"n\" : 9,\r\n    \"iniSudoku\" : [\r\n        [8, 0, 0, 0, 0, 0, 0, 0, 0],\r\n        [0, 0, 3, 6, 0, 0, 0, 0, 0],\r\n        [0, 7, 0, 0, 9, 0, 2, 0, 0],\r\n        [0, 5, 0, 0, 0, 7, 0, 0, 0],\r\n        [0, 0, 0, 0, 4, 5, 7, 0, 0],\r\n        [0, 0, 0, 1, 0, 0, 0, 3, 0],\r\n        [0, 0, 1, 0, 0, 0, 0, 6, 8],\r\n        [0, 0, 8, 5, 0, 0, 0, 1, 0],\r\n        [0, 9, 0, 0, 0, 0, 4, 0, 0]\r\n    ]\r\n}");
	const [model, setModel] = useState("entities:\n\nviewpoint:\r\n    param int n;\r\n    var p[n][n][n];\r\n    param int iniSudoku[9][9];\r\n\r\nconstraints:\r\n    forall(i in 0..8, j in 0..8){\r\n        EK(p[i][j][_], 1); // Un \u00FAnic valor per cel\u00B7la\r\n        AMK(p[i][_][j], 1); // Cada valor apareix una vegada per fila\r\n        AMK(p[_][i][j], 1); // Cada valor apareix una vegada per columna.\r\n    };\r\n\r\n\r\n    //Cada valor apareix una vagada als subquadrats de 3x3.\r\n    forall(i in [0,3,6], j in [0,3,6], k in 0..8){\r\n        AMK([p[i+l][j+g][k] | l in 0..2, g in 0..2], 1);\r\n    };\r\n\r\n\r\n    //Inicialitzem els valors fixats del sudoku.\r\n    forall(i in 0..8, j in 0..8){\r\n        if(iniSudoku[i][j] != 0){\r\n            p[i][j][iniSudoku[i][j]-1];\r\n        };\r\n    };\r\n\r\noutput:\r\n    \"Soluci\u00F3 sudoku: \\n\";\r\n    [ k+1 ++ \" \" ++ ((j+1) % 3 == 0 ? \" \" : \"\") ++ (j==8 ? (i+1) % 3 == 0 ? \"\\n\\n\": \"\\n\" : \"\") | i in 0..8, j in 0..8, k in 0..8 where p[i][j][k]];");

	const [result, setResult] = useState("");
	const [error, setError] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const handleClick = () => {
		setIsLoading(true);
		axios.post('http://server.csp2sat.online:9090', {
			input,
			model
		})
			.then(
				res => {
					const a = res.data;
					console.log(res.data);
					setResult(a.result);
					setError(a.error);
					setIsLoading(false);
				}
			)
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
