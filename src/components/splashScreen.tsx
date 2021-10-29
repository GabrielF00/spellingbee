import React from "react";
import {ExpandingButton} from "./expandingButton";
import {JoinGameForm} from "./joinGameForm";
import {HiddenForm} from "./hiddenForm";
import {COOP} from "../hex";

interface SplashScreenProps {
    gameSpecifiedInUrl: boolean,
    splashScreenVisible: boolean,
    newGameClickHandler: any,
    joinGameClickHandler: any,
    gameCode: string
}

interface SplashScreenState {
    joinGameFormVisible: boolean,
    newCoopGameFormVisible: boolean,
    newCompetitiveGameFormVisible: boolean
}

export class SplashScreen extends React.Component<SplashScreenProps, SplashScreenState> {

    constructor(props: SplashScreenProps) {
        super(props);
        this.handleNewCoopGameSubmit = this.handleNewCoopGameSubmit.bind(this);
    }

    state = {
        joinGameFormVisible: this.props.gameSpecifiedInUrl,
        newCoopGameFormVisible: false,
        newCompetitiveGameFormVisible: false
    }

    handleJoinGameButtonPush() {
        this.setState({
            joinGameFormVisible: !this.state.joinGameFormVisible
        });
    }

    handleNewCoopGameButtonPush() {
        this.setState({
            newCoopGameFormVisible: !this.state.newCoopGameFormVisible
        });
    }

    handleNewCompetitiveGameButtonPush() {
        this.setState({
            newCompetitiveGameFormVisible: !this.state.newCompetitiveGameFormVisible
        });
    }

    handleNewCoopGameSubmit(playerName: string) {
        this.props.newGameClickHandler(COOP, playerName);
    }

    render() {
        const displayClass = this.props.splashScreenVisible ? "" : "hidden";
        return (
            <div
                className={"fixed z-40 pin overflow-auto bg-gray-600 flex top-0 bottom-0 left-0 w-full h-screen place-content-center place-items-center " + displayClass}>
                <div
                    className="fixed shadow-inner max-w-md m-auto p-8 bg-white md:rounded w-full md:shadow flex flex-col">
                    <h2 className="text-4xl text-center font-hairline md:leading-loose text-grey md:mt-8 mb-4">Bee
                        Genius</h2>
                    <button className="btn-gray" onClick={() => this.props.newGameClickHandler(0, "")}>
                        New Single Player Game
                    </button>
                    <hr/>
                    <ExpandingButton onClick={() => this.handleJoinGameButtonPush()}
                                     contentVisible={this.state.joinGameFormVisible}
                                     buttonText={"Join Existing Game"}/>
                    <JoinGameForm gameCode={this.props.gameCode} placeHolderText={"Player Name"}
                                  handleSubmit={this.props.joinGameClickHandler}
                                  isVisible={this.state.joinGameFormVisible}/>
                    <ExpandingButton onClick={() => this.handleNewCoopGameButtonPush()}
                                     contentVisible={this.state.newCoopGameFormVisible}
                                     buttonText={"New Cooperative Game"}/>
                    <HiddenForm placeHolderText={"Player name"} handleSubmit={this.handleNewCoopGameSubmit}
                                isVisible={this.state.newCoopGameFormVisible}/>
                    {/*<ExpandingButton onClick={() => this.handleNewCompetitiveGameButtonPush()}*/}
                    {/*                 contentVisible={this.state.newCompetitiveGameFormVisible}*/}
                    {/*                 buttonText={"New Competitive Game"}/>*/}
                    {/*<HiddenForm placeHolderText={"Player name"} handleSubmit={this.props.newGameClickHandler}*/}
                    {/*            isVisible={this.state.newCompetitiveGameFormVisible}/>*/}
                    <p className="text-center font-semibold pt-6">Instructions:</p>
                    <p className="pt-6 px-2">Find words using the grid of seven letters. Each word must contain the middle letter. Letters can be used multiple times. There is at least one pangram, which contains all the letters in the grid, and is worth extra points.</p>
                    <p className="text-sm text-center pt-6">By Gabriel Fishman </p>
                    <p className="text-sm text-center">Inspired by the Spelling Bee puzzle in the New York Times </p>
                </div>
            </div>
        )
    }
}