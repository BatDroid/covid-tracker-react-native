import React, { Component } from "react";
import Constants from 'expo-constants';
import { Linking, Modal, Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Toast, View } from "native-base";
import { colors } from "../../theme";
import { RegularBoldText, RegularText } from "./Text";
import UserService, { isGBLocale } from "../core/user/UserService";

type PropsType = {}

type State = {
    isModalOpen: boolean,
    showTakeToStore: boolean,
}

const USiOSLink = `https://apps.apple.com/us/app/covid-symptom-tracker/id1503529611`;
const UKiOSLink = `https://apps.apple.com/gb/app/covid-symptom-tracker/id1503529611`;
const AndroidLink = `market://details?id=${Constants.manifest.android.package}`;

const ModalContainer = (props: any) => (
    <Modal transparent={true}>
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
                {props.children}
            </View>
        </View>
    </Modal>
);

export async function shouldAskForRating() {
    const userService = new UserService();
    const profile = await userService.getProfile();
    const eligibleToAskForRating = profile.ask_for_rating;
    const askedToRateStatus = await userService.getAskedToRateStatus();
    return (!askedToRateStatus && eligibleToAskForRating);
}

export class CovidRating extends Component<PropsType, State> {
    state = {
        isModalOpen: true,
        showTakeToStore: false,
    };
    private userService = new UserService();

    decline = () => {
        this.userService.setAskedToRateStatus('asked');
        this.setState({isModalOpen: false})
    };

    declineFeedback = () => {
        this.decline();
        Toast.show({
            text: `Thank you for your feedback.\nWe're working hard to improve things`,
            duration: 3000,
            position: 'top',
            textStyle: {textAlign: 'center', lineHeight: 25},
            // style: {paddingVertical: 40}
        });
    };

    takeToStore = () => {
        this.userService.setAskedToRateStatus('asked');
        if (Platform.OS != 'ios') {
            Linking.openURL(AndroidLink).catch(err => {});
        } else {
            Linking.openURL(isGBLocale() ? UKiOSLink : USiOSLink).catch(err => {});
        }
        this.setState({isModalOpen: false});
    };

    askToRate = (e: any) => {
        this.setState({showTakeToStore: true});
    };

    renderHeader = (headerText: string, subText: string) => (
        <>
            <RegularBoldText style={styles.ratingHeader}>{headerText}</RegularBoldText>
            <RegularText style={styles.ratingText}>{subText}</RegularText>
        </>
    );

    renderActionButtons = (yesLabel: string, yesAction: any, noLabel: string, noAction: any) => (
        <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.ratingButton} onPress={noAction}>
                <RegularText style={styles.buttonText}>{noLabel}</RegularText>
            </TouchableOpacity>
            <View style={styles.verticalDivider}/>
            <TouchableOpacity style={styles.ratingButton} onPress={yesAction}>
                <RegularText style={styles.buttonText}>{yesLabel}</RegularText>
            </TouchableOpacity>
        </View>
    );
//

    render() {
        return (
            this.state.isModalOpen && (
                <ModalContainer>
                    {this.state.showTakeToStore ?
                        <>
                            {this.renderHeader('Please rate this app', 'Your feedback can help more people join the fight against COVID-19')}
                            {this.renderActionButtons('Rate', this.takeToStore, 'Not now', this.decline)}
                        </>
                        : (
                            <>
                                {this.renderHeader('How are we doing?', 'Would you recommend this app to a friend or colleague?')}
                                {this.renderActionButtons('Yes, I would', this.askToRate, `No, I wouldn't`, this.declineFeedback)}
                            </>
                        )}
                </ModalContainer>
            )
        );
    }
}


const actionButtonBorder = 'rgba(240, 240, 240, 1)';
const styles = StyleSheet.create({
    verticalDivider: {
        height: '100%',
        width: 1,
        backgroundColor: actionButtonBorder,
    },
    ratingText: {
        paddingBottom: 30,
        marginHorizontal: 60,
        fontSize: 14,
        textAlign: "center",
    },
    ratingHeader: {
        paddingBottom: 10,
        fontSize: 18,
        textAlign: "center",
    },
    actionContainer: {
        flexDirection: "row",
        justifyContent: "center",
        borderTopWidth: 1,
        borderColor: actionButtonBorder,
    },
    buttonText: {
        textAlign: "center",
        color: colors.linkBlue,
    },
    ratingButton: {
        width: '50%',
        height: 60,
        justifyContent: "center",
        color: colors.linkBlue,
    },
    centeredView: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 30,
        backgroundColor: "white",
        borderRadius: 20,
        paddingTop: 35,
        alignItems: "center",
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
});
