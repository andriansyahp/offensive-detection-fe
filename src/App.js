import './App.css';
import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from "@material-ui/styles";
import Button from '@material-ui/core/Button';
import { purple } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';

const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    '&:hover': {
      backgroundColor: purple[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(3),
  },
}));

function App() {
  const [result, setResult] = useState('');
  const [text, setText] = useState('');
  const [finalMsg, setFinalMsg] = useState('');
  const [done, setDone] = useState(true);

  const classes = useStyles();

  const handleChange = (e) => {
    setText(e.target.value);
  }

  const handleSubmit = (e) => {
    setFinalMsg(`${text}`)
    setDone(false)
    e.preventDefault();

    fetch("https://offensive-detection-be.herokuapp.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speech: text}),
    }).then((res) => {
      return res.json();
    }).then(data => {
      setResult(data.prediction);
      setDone(true)
    })
  }

  let color = 'white';
  let category = ''
  let verdict = ''
  if(result === 0){
    color = '#7C0032';
    category = 'Hate Speech'
    verdict = `This is a hate speech message. Don't spread hate!`
  }
  else if(result === 1){
    color = '#9D5116';
    category = 'Offensive'
    verdict = `This is an offensive message. Maybe you''ll want to revise the message?`
  }
  else if(result === 2){
    color = '#257A2A';
    category = 'Neutral'
    verdict = `This is a neutral message. Nice!`
  }

  return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Container maxWidth="xl" align="center" style = {{ backgroundColor: '#1C093A', color: 'white' }}>
            <div className="App">
              <div className="content">
                <Typography variant="h3" component="h2" gutterBottom>
                  <span style={{backgroundColor: "#257A2A", color: 'white'}}>Neutral</span> vs <span style={{backgroundColor: "#9D5116", color: 'white'}}>Offensive</span> vs <span style={{backgroundColor: "#7C0032", color: 'white'}}>Hate Speech</span>  Text Detection
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Insert message to classify!
                </Typography>
                <form className={classes.root} noValidate autoComplete="off" onSubmit={(e) => handleSubmit(e)}>
                  <TextField
                      id="outlined-secondary"
                      label="Message"
                      variant="outlined"
                      placeholder="Example: 'Hi!'"
                      fullWidth
                      margin="normal"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={text}
                      onChange={(e) => handleChange(e)}
                      InputProps={{
                        style: {
                          color: "white"
                        }
                      }}
                  />
                  <ColorButton variant="contained" color="primary" className={classes.margin} disabled={text.length === 0}>
                    Classify
                  </ColorButton>
                </form>
                {
                  !done ?
                      <LinearProgress color="secondary" />
                      :
                      category ?
                          <Card className={classes.root} variant="outlined"
                                style={{backgroundColor: '#32004F', color: 'white'}} width='md'>
                            <CardContent>
                              <Typography className={classes.title} gutterBottom>
                                Message
                              </Typography>
                              <Typography variant="h5" component="h2">
                                {finalMsg}
                              </Typography>
                              <Chip label={category} variant="outlined"
                                    style={{backgroundColor: color, color: 'white'}}/>
                              <Typography variant="body2" component="p">
                                {verdict}
                              </Typography>
                            </CardContent>
                          </Card>
                          :
                          null
                }
              </div>
            </div>
          </Container>
        </ThemeProvider>
      </React.Fragment>
  );
}

export default App;
