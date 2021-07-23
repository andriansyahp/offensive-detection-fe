import './App.css';
import { useState } from 'react';

function App() {
  const [result, setResult] = useState('');
  const [text, setText] = useState('');



  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("https://offensive-detection-be.herokuapp.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speech: text}),
    }).then((res) => {
      return res.json();
    }).then(data => {
      console.log(data);
      setResult(data.prediction);
    })
  }

  let output = ''
  let color = 'white';
  if(result === 0){
    color = 'red';
    output = `${result} -> This is a hate speech message. Don't spread hate!`  
  }
  else if(result === 1){
    color = 'orange';
    output = `${result} -> This is an offensive message. Maybe you''ll want to revise the message?`
  }
  else if(result === 2){
    color = 'green';
    output = `${result} -> This is a neutral message. Nice!`
  }


  return (
    <div style={{backgroundColor: color}} className="App">
      <div className="content">
        <p className="title">Hate Speech vs Offensive vs Neutral Text Detection</p>
        <p>Insert message to classify!</p>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input autoFocus value={text} type="text" onChange={(e) => handleChange(e)} />
          <button disabled={text.length === 0}>
            Classify
          </button>
        </form>
      <p>{output}</p>
      </div>
    </div>
  );
}

export default App;
