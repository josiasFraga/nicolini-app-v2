import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {Button, Text, Icon, Image } from 'react-native-elements';
import FormLogin from '@components/Forms/FormLogin';
import GlobalStyle from '@styles/global';
import { getMacAddress, getUniqueId } from 'react-native-device-info';
import { useFormik } from 'formik';
import { CommonActions } from '@react-navigation/native';
import * as yup from 'yup';

import IMAGES from '@constants/images';
import COLORS from '@constants/colors';

const LoginSchema = yup.object().shape({
	user: yup.string().required('Usuário é obrigatório'),
	password: yup.string().required('Senha é obrigatória'),
});

export default function CenaLogin(props) {
	const dispatch = useDispatch();
    const [deviceId, setDeviceId] = React.useState("");

	const componentDidMount = async () => {
		const _deviceId = await getUniqueId();
		setDeviceId(_deviceId);

	}

	React.useEffect(() => {
		componentDidMount();

	}, [])

	

	openHomeCene = () => {
	
		props.navigation.dispatch(
		CommonActions.reset({
		  index: 1,
		  routes: [
			{ name: 'Home' },
		  ],
		  })
		)
	  }

	const formik = useFormik({
		initialValues: { user: '', password: '' },
		validationSchema: LoginSchema,
		onSubmit: (values, {setSubmitting, resetForm}) => {

			let submitValues = values;
			submitValues.tx_coletor = deviceId;
			setSubmitting(true);
		  
			dispatch({
				type: 'LOGIN_TRIGGER',
				payload: {
				submitValues: submitValues,
				setSubmitting: setSubmitting,
				callback_success: () => {
					resetForm()

					dispatch({
						type: 'LOAD_GOODS',
						payload: {}
					});
		
					openHomeCene();
				}
				}
			})
		},
	});

    return (
        <View style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor={'transparent'}
                barStyle={'dark-content'}
            />
            <View style={styles.imageContainer}>
                <Image source={IMAGES.LOGO} style={{ width: 150, height: 120 }} />
            </View>
            <View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'flex-end'}]}>
				<FormLogin formik={formik} />
                <View style={styles.innerSpace}>
                    <Text style={{textAlign: 'center', color: '#999', fontSize: 12}}>ID do dispositivo: {deviceId}</Text>
                </View>
            </View>
            <View style={[GlobalStyle.secureMargin, {flex: 1, justifyContent: 'flex-end'}]}>
                <View style={styles.bgImage}>
                    <Image source={IMAGES.BALL_BG} style={{ width: 140, height: 140 }} />
                </View>
            </View>
        </View>
    );
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
