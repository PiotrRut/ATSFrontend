import React from 'react';
import '../App.scss';
import TeamPic from '../assets/Teampic.png'
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';


// Landing page for the app (the default website which opens upon first visit)
function LandingPage() {
  return(
    <div>
      <br/>
      <h1>Welcome to the ATS System for "AirVia"</h1>
      <h1>Please sign in to get access to your dashboard</h1>

      <br/>

      <h3> System brought to you by </h3>
      <img alt='Team 6ix' style={{ width: '200px' }} src={TeamPic}/>

      <br/> <br/>

      <h3>Visit the GitHub repositories for this project:</h3>
      <Button color="black" href={"https://github.com/PiotrRut/ATSFrontend"}
        startIcon={<GitHubIcon/>}>
          Front end
      </Button>
      <Button color="black" href={"https://github.com/PiotrRut/ATSBackend"}
        startIcon={<GitHubIcon/>}>
          Back end
      </Button>

    </div>

  );
}

export default LandingPage;
