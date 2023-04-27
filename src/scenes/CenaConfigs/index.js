import React, {Component} from 'react';
import { FormConfigs } from '@components/Forms/FormConfigs';

import {
	StyleSheet,
	View,
	StatusBar,
} from 'react-native';
import { Image } from 'react-native-elements';
import GlobalStyle from '@styles/global';
import Header from '@components/Header';
import IMAGES from '@constants/images';
import { connect} from 'react-redux';

type Props = {};
export class CenaConfigs extends Component<Props> {

	render() {
		return (
			<View style={styles.container}>

				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>

                <Header backButton={true} titulo={"Configurações"} />
                
				<View style={[GlobalStyle.secureMargin, {flex: 1}]}>
					<FormConfigs />
				</View>

				<View style={[GlobalStyle.secureMargin, {justifyContent: 'flex-end'}]}>
					<View style={styles.bgImage}>
						<Image source={IMAGES.BALL_BG} style={{ width: 140, height: 140 }} />
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	imageContainer: { 
		justifyContent: 'center',
		alignItems: 'center',
		flex: 2
	},
	text: {
		fontFamily: 'Mitr-Regular',
		lineHeight: 18,
	},
	textMedium: {
		fontFamily: 'Mitr-Medium',
		marginBottom: 3,
	},
	centerFully: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	subtitle: {
		textAlign: 'center',
		fontSize: 15,
		marginBottom: 7,
	},
	innerSpace: {
		padding: 15,
	},
	discountBox: {
		borderWidth: 0.5,
		borderColor: '#CCC',
		padding: 15,
		borderRadius: 15,
		margin: 15,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonVisitante: {
		marginTop: 15,
	},
	buttonCadastrarText: {
		textAlign: 'center',
		color: '#FFF',
	},
	bgImage: {
		width: 120,
		height: 120,
		position: 'absolute',
		zIndex: 999,
		bottom:-50,
		right: -20,
		alignSelf: 'flex-end',
	}
});

export default connect(null, null)(CenaConfigs);