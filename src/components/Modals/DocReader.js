import React, {Component} from 'react';
import {View, StyleSheet, Text, Button, Image, Platform} from 'react-native';
import DocumentScanner from '@woonivers/react-native-document-scanner';
import CompressImage from 'react-native-compress-image';

export default class DocReader extends Component<Props> {
  state = {
    capturando: false,
  };
  render() {
    if (this.state.capturando) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
            alignContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text style={{textAlign: 'center', width: '100%'}}>
            Carregando...
          </Text>
        </View>
      );
    }

    if (this.props.imagem != '' && this.props.imagem != null) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: '#FFF',
          }}>
          <Image source={{uri: this.props.imagem.uri}} style={{flex: 1}} />
          <View style={{position: "absolute", bottom: 0, backgroundColor: 'rgba(52, 52, 52, 0.5)', width: '100%', flexDirection: "row", justifyContent: 'space-between', padding: 5}}>
            <Button
              title="Tentar novamente"
              onPress={() => {
                this.setState({capturando: false});
                this.props.setImage('');
              }}
              style={{flex: 1}}
            />
            <Button
              title="Aceitar"
              style={{flex: 1}}
              onPress={() => this.props.fechaModal()}
            />
          </View>
        </View>
      );
    }
    return (
      <DocumentScanner
        style={styles.scanner}
        onPictureTaken={data => {
          this.setState({capturando: true});
          let file_list = data.croppedImage.split('/');
          let fileName = file_list.pop();
          let file_name_list = fileName.split('.');
          let ext = file_name_list.pop();
          let fileType = '';
          fileType = 'image/' + ext;

          console.log(data.croppedImage);

          CompressImage.createCompressedImage(
            data.croppedImage,
            '@assets/imgs/compressedImages/',
          )
            .then(responseCompress => {
              const source = {
                uri: responseCompress.uri,
                type: fileType,
                name: fileName,
              };
              this.props.setChoosingImage(false);
              this.setState({capturando: false});
              this.props.setImage(source);
              console.log(source);
            })
            .catch(err => {
              console.log(err);
              // Oops, something went wrong. Check that the filename is correct and
              // inspect err to get more details.
              console.log('Erro a o comprimir a imagem');

              this.props.setChoosingImage(false);
              this.setState({capturando: false});
            });
        }}
        saveOnDevice={true}
        overlayColor="rgba(255,130,0, 0.7)"
        enableTorch={true}
        quality={1}
        brightness={1}
        detectionCountBeforeCapture={5}
        detectionRefreshRateInMS={50}
      />
    );
  }
}

const styles = StyleSheet.create({
  scanner: {
    flex: 1,
    aspectRatio: undefined,
  },
  button: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 32,
  },
  buttonText: {
    backgroundColor: 'rgba(245, 252, 255, 0.7)',
    fontSize: 32,
  },
  preview: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  permissions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
