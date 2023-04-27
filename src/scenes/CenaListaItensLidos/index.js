import React, {Component} from 'react';

import {
	StyleSheet,
	View,
	StatusBar,
	FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Text, ListItem, SearchBar } from 'react-native-elements';
import GlobalStyle from '@styles/global';
import AlertHelper from '@components/Alert/AlertHelper';
import Header from '@components/Header';
var RNFS = require('react-native-fs');
import DocumentPicker, {
	isInProgress,
  } from 'react-native-document-picker'

import COLORS from '@constants/colors';

import { connect} from 'react-redux';


type Props = {};
export class CenaListaItensLidos extends Component<Props> {

	constructor(props) {
		super(props);
		this.state = {
			file_data: [],
			file_data_n_itens: 0,
            isLoading: false,
            itens: [],
            search: ""
		};
	}

    componentDidMount = () => {

        this.props.loadData();
		this.checkUploadedFile();
        this.buscaItens();
    }

	checkUploadedFile = async () => {
		
		const value = await AsyncStorage.getItem('UPLOADED_FILE_INVERT_COLLECTION');
		
		if (value !== null) {
		  	let data = JSON.parse(value);
		  	this.setState({file_data_n_itens: data.length, file_data: data});
		} else {
			this.setState({file_data_n_itens: 0, file_data: []});
		}
	}

	handleError = (err) => {
		if (DocumentPicker.isCancel(err)) {
		  console.warn('cancelled')
		  // User cancelled the picker, exit any dialogs or menus and move on
		} else if (isInProgress(err)) {
		  console.warn('multiple pickers were opened, only the last will be considered')
		} else {
		  throw err
		}
	}

    buscaItens = async () => {

        let db_table = 'CODIGOS_AVULSOS';

        this.setState({isLoading: true});

        if ( this.props.origin && this.props.origin == "separacao_central") {
            db_table = "CODIGOS_CENTRAL";
        }
     
        if ( this.props.origin && this.props.origin == "coletagem_invert") {
            db_table = "CODIGOS_INVERT";
        }

        try {
            console.log("buscando os itens escaneados " + db_table);
            const value = await AsyncStorage.getItem(db_table);
            if (value !== null) {
                // We have data!!
                let codigos = JSON.parse(value);
                if ( this.state.search.trim() != "" ) {
                    const buscaUsuario = this.state.search.trim().toLocaleLowerCase();
                    codigos = codigos.filter((codigo,index) => {
                        return String(codigo.produto.toLocaleLowerCase()).includes(buscaUsuario) || String(codigo.barcodescanned.toLocaleLowerCase()).includes(buscaUsuario)
                    })
                }
                codigos = [].concat(codigos)
                .sort((a, b) => a.produto > b.produto ? 1 : -1)
                this.setState({"itens": codigos});
            }
        } catch (error) {
            console.log(error);
            AlertHelper.show(
                'error',
                'Erro',
                'Ocorreu um errro ao contar os dados',
            );
        }

        this.setState({isLoading: false});
        
    }

    updateSearch = (search) => {
        this.setState({ search });
        this.buscaItens();
      };


    renderItem = ({ item }) => (
        <ListItem bottomDivider>
        <ListItem.Content>
          <ListItem.Title>{item.produto}</ListItem.Title>
          <ListItem.Subtitle>{item.barcodescanned}</ListItem.Subtitle>
        </ListItem.Content>
        <Text>QTD: {item.qtd}</Text>
      </ListItem>
    );
    
	render() {
        const search = this.state.search;
		return (
			<View style={styles.container}>
				<StatusBar
					translucent={true}
					backgroundColor={'transparent'}
					barStyle={'dark-content'}
				/>
                <Header backButton={true} titulo={"Itens Lidos"} />
                <View style={{ backgroundColor: COLORS.primary}}>
					<Text style={{color: "#FFF", textAlign: "center", fontSize: 18, paddingTop: 10, textTransform: "uppercase"}}>Produtos</Text>
					<View style={[GlobalStyle.row, { justifyContent: "space-around", alignItems: "center"}]}>
						<View style={{padding: 5, marginRight: 5, flex: 1}}>
							<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.state.file_data_n_itens}</Text>
							<Text style={{color: "#FFF", textAlign: "center"}}>Lidos</Text>
						</View>
						<View style={{padding: 5, marginRight: 5, flex: 1}}>
							<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.props.collection_data.n_itens}</Text>
							<Text style={{color: "#FFF", textAlign: "center"}}>Coletados</Text>
						</View>
						<View style={{padding: 5, marginLeft: 5, flex: 1}}>
							<Text style={{textAlign: "center", fontSize: 18, color: "#FFF", fontWeight: "bold"}}>{this.props.collection_data.n_uniqe_itens}</Text>
							<Text style={{color: "#FFF", textAlign: "center"}}>Únicos Coletados</Text>
						</View>
					</View>
				</View>
                <SearchBar
                    placeholder="Buscar item..."
                    onChangeText={this.updateSearch}
                    value={search}
                    lightTheme={true}
                />
				<View style={[{flex: 1, justifyContent: 'center'}]}>
                    <FlatList
                        data={this.state.itens}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.barcodescanned}
                        onRefresh={this.buscaItens}
                        refreshing={this.state.isLoading}
                        ListEmptyComponent={() => (
                            <Text style={{textAlign: 'center'}}>Nenhum item escaneado.</Text>
                        )}
                    />
				
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

const mapStateToProps = state => ({
	collection_data: state.appReducer.invert_collection_data
});


const mapDispatchToProps = dispatch => ({
    loadData() {
        dispatch({
            type: 'LOAD_INVERT_COLLECTION_DATA',
            payload: {}
        })
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CenaListaItensLidos);