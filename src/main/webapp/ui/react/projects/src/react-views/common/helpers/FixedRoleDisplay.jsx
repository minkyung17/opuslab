import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
// import {keys} from 'lodash';
import {Alert} from "react-bootstrap";
//My imports
import {ShowIf} from "../components/elements/DisplayIf.jsx";
import Permissions from "../../../opus-logic/common/modules/Permissions";

/******************************************************************************
 *
 * @desc - Handles the fixed role display
 *
 ******************************************************************************/
export default class FixedRoleDisplay extends React.Component {

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} props - Props for Fixed Role Display
   *
   **/
    constructor(props = {}) {
        super(props);
        this.updateDateAndTime = this.updateDateAndTime.bind(this);
        this.Permissions = new Permissions(adminData);
    }

  /**
   *
   * @desc - class variables
   * @param {Object}
   *
   **/
    state = {
        environments: {
            local: "localhost",
            dev: "aps-opus-web-d01.dev.it.ucla.edu",
            test: "opustst.it.ucla.edu",
            oldTest: "opustest.it.ucla.edu"
        },
        shouldDisplay: false,
        environment: "",
        roles: "",
        uiRoles: "",
        date: moment().format("ddd MM/DD/YYYY, h:mm a"),
        alertColor: "warning",
        colors: ["success","warning","danger","info"],
        clicks: 0,
        messages: []
    };

    componentDidMount(){
        this.setDisplay(this.props);
    }

    componentWillReceiveProps(props) {
        if(props!==this.state.adminData){
            this.setDisplay(props);
        }
    }

    setDisplay(props){
        let adminData = props;

    // sets the environment display
        this.setEnvironment();

    // sets admin roles
        this.setAdminRoles(props);

    // sets ui roles
        this.setUIRoles();

        this.setMessages();
    }

  /**
   *
   * @desc - sets environment display as well as
   *  boolean value to display component at all
   *
   **/
    setEnvironment(){
        let {environments} = this.state;
        let environment = "";
        let shouldDisplay = false;
    //OPUSDEV-4232 11/29/2022 Changed window.domain to window.location.hostname
        if(window.location.hostname===environments.local){
            environment = "LOCAL: ";
            shouldDisplay = true;
        }else if(window.location.hostname===environments.dev){
            environment = "DEV: ";
            shouldDisplay = true;
        }else if(window.location.hostname===environments.test || window.location.hostname===environments.oldTest){
            environment = "TEST: ";
            shouldDisplay = true;
        }
        this.setState({environment: environment, shouldDisplay: shouldDisplay});
    }

  /**
   *
   * @desc - sets admin role display
   *
   **/
    setAdminRoles(props){
        let adminRoles = props.adminRoles;
        let roles = props.adminFirstName+" - ";
        if(adminRoles.length>=2){
            for(let each in adminRoles){
                let index = parseInt(each);
                if(adminRoles[index+1]){
                    roles += adminRoles[index]+", ";
                }else{
                    roles += adminRoles[index];
                }
            }
        }else{
            roles += adminRoles[0];
        }
        this.setState({roles: roles});
    }

    setUIRoles(){
        let {isAA, isAPO, isCAP, isChair, isDA, isDean, isLibrarySA, isOA, isSA, isVCAP} = this.Permissions;
        let uiRoles = [];
        if(isAA){uiRoles.push("isAA");}
        if(isAPO){uiRoles.push("isAPO");}
        if(isCAP){uiRoles.push("isCAP");}
        if(isChair){uiRoles.push("isChair");}
        if(isDA){uiRoles.push("isDA");}
        if(isDean){uiRoles.push("isDean");}
        if(isLibrarySA){uiRoles.push("isLibrarySA");}
        if(isOA){uiRoles.push("isOA");}
        if(isSA){uiRoles.push("isSA");}
        if(isVCAP){uiRoles.push("isVCAP");}
        this.setState({uiRoles: uiRoles.join(" ")});
    }

    updateDateAndTime(){
        this.setState({date: moment().format("ddd MM/DD/YYYY, h:mm a")});
        this.setState({alertColor: this.state.colors[Math.floor(Math.random()*this.state.colors.length)] });
    }


    clickEvent(){
        if(this.state.shouldDisplay && this.state.clicks>3){
            let alert = this.state.messages[Math.floor(Math.random()*this.state.messages.length)];
            window.alert(alert);
            this.setState({clicks: 0});
        }else{
            this.setState({clicks: this.state.clicks+1});
        }
    }

    setMessages(){
        this.setState({messages: [
            "Hey! Pick on someone your own size!", "Ouch! Stop Poking Me!",
            "Sticks and Stones may break my bones, but clicks will never break me",
            "Hello~ Is it me you're looking for~", "Hey! Watch where you point that thing!",
            "Working hard? More like hardly working...", "Give me a byte to eat",
            "Help! I'm trapped in here!", "Do you know the Muffin Man?", "MWAHAHAHAHA",
            "Where am I? It's dark in here!",  "Now it's your turn to hide!",
            "I'm not dumb. I just have a command of thoroughly useless information.",
            "I try to take it one day at a time, but sometimes several days attack me at once",
            "\"The greatest glory in living lies not in never falling, but in rising every time we fall.\" -Nelson Mandela",
            "\"The way to get started is to quit talking and begin doing.\" -Walt Disney",
            "\"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma – which is living with the results of other people's thinking.\" -Steve Jobs",
            "\"If life were predictable it would cease to be life, and be without flavor.\" -Eleanor Roosevelt",
            "\"If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.\" -Oprah Winfrey",
            "\"If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.\" -James Cameron",
            "\"Life is what happens when you're busy making other plans.\" -John Lennon",
            "\"Spread love everywhere you go. Let no one ever come to you without leaving happier.\" -Mother Teresa",
            "\"Tell me and I forget. Teach me and I remember. Involve me and I learn.\" -Benjamin Franklin",
            "\"The future belongs to those who believe in the beauty of their dreams.\" -Eleanor Roosevelt",
            "\"The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.\" -Helen Keller",
            "\"It is during our darkest moments that we must focus to see the light.\" -Aristotle",
            "\"Whoever is happy will make others happy too.\" -Anne Frank",
            "\"Do not go where the path may lead, go instead where there is no path and leave a trail.\" -Ralph Waldo Emerson",
            "\"You will face many defeats in life, but never let yourself be defeated.\" -Maya Angelou",
            "\"Never let the fear of striking out keep you from playing the game.\" -Babe Ruth",
            "\"In the end, it's not the years in your life that count. It's the life in your years.\" -Abraham Lincoln",
            "\"You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.\" -Dr. Seuss",
            "\"You only live once, but if you do it right, once is enough.\" -Mae West",
            "\"Only a life lived for others is a life worthwhile.\" -Albert Einstein",
            "\"Do not let making a living prevent you from making a life.\" -John Wooden"
        ]});
    }

  /**
   *
   * @desc - Renders the datatable and button suite
   * @returns {void}
   *
   **/
    render() {
        let {state: {shouldDisplay, environment, uiRoles,
      roles, date}} = this;

        return (
      <span>
        <ShowIf show={shouldDisplay}>
          <div id='fixed-role-display' className='navbar-fixed-bottom'>
            <div className='col-md-4'/>
            <div className='col-md-8' onClick={this.updateDateAndTime}>
              <Alert bsStyle={this.state.alertColor}>
                <img src='../images/buttonavatar.png' onClick={() => this.clickEvent()}/><span> </span>
                <strong>{environment+roles}</strong>
                <span className='pull-right'>
                  {uiRoles} &nbsp; &nbsp; &nbsp; {date} &nbsp;
                  <button onClick={() => this.setState({shouldDisplay: false})}>X</button>
                </span>
              </Alert>
            </div>
          </div>
        </ShowIf>
      </span>
    );
    }
}
